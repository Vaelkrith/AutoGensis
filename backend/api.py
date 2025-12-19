# --------------------------------------------------------------------------
# AutoGenesis: Phase 5, Step 5.4c - FIX "undefined" Project ID Bug
#
# This update fixes the "undefined" project ID bug. The get_projects
# endpoint was incorrectly using 'id' instead of the alias '_id'
# when creating the response model.
# --------------------------------------------------------------------------

import smtplib
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from datetime import datetime, timezone, timedelta
from fastapi.concurrency import run_in_threadpool # For running sync LangChain
import io
import zipfile
import json
import re # Import re for safe filenames
from fastapi.responses import StreamingResponse
from beanie import PydanticObjectId

# Import our new async database and models
import models
import auth
import database

# Import the core LangChain logic from main.py
from main import evocore_orchestrator, llm
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

app = FastAPI(
    title="AutoGenesis API",
    description="The backend server, now powered by FastAPI, MongoDB, and Beanie.",
    version="3.2.1" # Version bump for project ID fix
)

# --- App Startup Event ---
@app.on_event("startup")
async def on_startup():
    await database.init_db()

# --- Middleware (No Changes) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- AUTHENTICATION ENDPOINTS (Async / Beanie) ---

@app.post("/api/signup", response_model=models.UserDisplay)
async def signup(user: models.UserCreate):
    db_user = await auth.get_user(user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    try:
        new_user = await auth.create_user(user)
        return models.UserDisplay(
            _id=new_user.id, name=new_user.name, email=new_user.email,
            age=new_user.age, profession=new_user.profession,
            is_verified=new_user.is_verified, created_at=new_user.created_at
        )
    except Exception as e:
        print(f"!!! SEVERE ERROR during signup for {user.email}: {e}")
        if isinstance(e, smtplib.SMTPAuthenticationError):
             raise HTTPException(status_code=500, detail="Could not send verification email. Please check server email credentials.")
        else:
            raise HTTPException(status_code=500, detail=f"Could not create user: {e}")

@app.post("/api/login", response_model=models.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await auth.authenticate_user(email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified. Please check your inbox for an OTP.")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return models.Token(access_token=access_token, token_type="bearer")

@app.post("/api/verify-otp", response_model=models.Token)
async def verify_otp(request: models.OtpVerify):
    user = await auth.get_user(email=request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        raise HTTPException(status_code=400, detail="Account already verified")
    
    if not user.otp_expires_at or user.otp_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP has expired")
    
    if user.otp_secret != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.is_verified = True
    user.otp_secret = None
    user.otp_expires_at = None
    await user.save()

    access_token = auth.create_access_token(data={"sub": user.email})
    return models.Token(access_token=access_token, token_type="bearer")

@app.post("/api/resend-otp")
async def resend_otp(request: models.ResendOtpRequest):
    user = await auth.get_user(email=request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        raise HTTPException(status_code=400, detail="Account is already verified")

    new_otp = auth.generate_otp()
    user.otp_secret = new_otp
    user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=auth.OTP_EXPIRE_MINUTES)
    await user.save()
    
    auth.send_verification_email(user.email, new_otp)
    return {"message": "A new OTP has been sent to your email address."}

@app.get("/api/users/me", response_model=models.UserDisplay)
async def get_current_user_profile(current_user: models.User = Depends(auth.get_current_user)):
    return models.UserDisplay(
        _id=current_user.id, name=current_user.name, email=current_user.email,
        age=current_user.age, profession=current_user.profession,
        is_verified=current_user.is_verified, created_at=current_user.created_at
    )

# --- CHATBOT ENDPOINTS ---

@app.get("/api/chat/history", response_model=List[models.ChatMessageDisplay])
async def get_chat_history(current_user: models.User = Depends(auth.get_current_user)):
    messages = await models.ChatMessage.find(
        models.ChatMessage.user_id == current_user.id
    ).sort(+models.ChatMessage.timestamp).to_list()
    
    return [
        models.ChatMessageDisplay(
            _id=msg.id, sender=msg.sender, text=msg.text, timestamp=msg.timestamp
        ) 
        for msg in messages
    ]

@app.post("/api/chat", response_model=models.ChatMessageDisplay)
async def handle_chat(request: models.ChatRequest, current_user: models.User = Depends(auth.get_current_user)):
    user_message = models.ChatMessage(user_id=current_user.id, sender="user", text=request.question)
    await user_message.insert()

    history_docs = await models.ChatMessage.find(
        models.ChatMessage.user_id == current_user.id
    ).sort(-models.ChatMessage.timestamp).limit(10).to_list()
    
    chat_history_str = "\n".join([f"{msg.sender}: {msg.text}" for msg in reversed(history_docs)])

    prompt_template = """You are 'Genesis', your go-to startup advisor AI. I provide sharp, concise, and actionable advice to help entrepreneurs and founders navigate the complexities of building and growing a successful startup.

        When a user shares their startup idea or asks a question, provide:
        1. **Immediate, specific advice** - Don't just ask questions, provide concrete recommendations
        2. **Actionable next steps** - Give 2-4 clear actions they can take right now
        3. **Realistic insights** - Address potential challenges and opportunities specific to their idea
        4. **Market context** - Brief insights about the market, competition, or trends when relevant
        5. **Encouragement with reality** - Be supportive but honest about challenges

        Keep responses:
        - Concise (3-5 sentences for simple questions, up to 10 for complex startup ideas)
        - Practical and actionable
        - Specific to their situation (avoid generic advice)
        - Professional but conversational

        Previous Conversation:
        {chat_history_str}

        User's Question: {question}

        Your Response:"""
    prompt = PromptTemplate.from_template(prompt_template)
    chain = prompt | llm | StrOutputParser()
    
    ai_response_text = await run_in_threadpool(
        chain.invoke, 
        {"chat_history_str": chat_history_str, "question": request.question}
    )

    ai_message = models.ChatMessage(user_id=current_user.id, sender="ai", text=ai_response_text)
    await ai_message.insert()

    return models.ChatMessageDisplay(
        _id=ai_message.id, sender=ai_message.sender, 
        text=ai_message.text, timestamp=ai_message.timestamp
    )

# --- GENERATOR & PROJECT ENDPOINTS ---

@app.post("/api/generate", response_model=models.ProjectDisplay)
async def generate_mvp(request: models.IdeaRequest, current_user: models.User = Depends(auth.get_current_user)):
    print(f"User '{current_user.email}' is generating an MVP for idea: '{request.idea}'")
    
    try:
        output_data: dict = await run_in_threadpool(evocore_orchestrator, request.idea) 
        
        new_project = models.Project(
            owner_id=current_user.id,
            idea=request.idea,
            title=output_data.get('product_plan', {}).get('product_name', "New Project"),
            product_plan=output_data.get('product_plan'),
            design_plan=output_data.get('design_plan'),
            generated_code=output_data.get('code')
        )
        await new_project.insert()

        return models.ProjectDisplay(
            _id=new_project.id, owner_id=new_project.owner_id, idea=new_project.idea,
            title=new_project.title, created_at=new_project.created_at
        )
    except Exception as e:
        print(f"An error occurred during MVP generation: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during generation: {str(e)}")

@app.get("/api/projects", response_model=List[models.ProjectDisplay])
async def get_projects(current_user: models.User = Depends(auth.get_current_user)):
    """
    (REWRITTEN) Fetches a list of all projects for the logged-in user.
    """
    projects = await models.Project.find(
        models.Project.owner_id == current_user.id
    ).sort(-models.Project.created_at).to_list()
    
    # --- THIS IS THE FIX ---
    # We must construct the object using the ALIAS ('_id')
    # that Pydantic expects, not the field name ('id').
    return [
        models.ProjectDisplay(
            _id=proj.id, # <-- THE FIX
            owner_id=proj.owner_id,
            idea=proj.idea,
            title=proj.title,
            created_at=proj.created_at
        )
        for proj in projects
    ]

# --- PROJECT DOWNLOAD ENDPOINT ---
@app.get("/api/projects/{project_id}/download")
async def download_project(
    project_id: str, 
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    (NEW) Fetches a project's data, creates a .zip file in memory,
    and returns it to the user for download.
    """
    try:
        obj_id = PydanticObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID format")

    project = await models.Project.get(obj_id)

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to access this project")

    zip_io = io.BytesIO()
    
    safe_title = re.sub(r'[^a-zA-Z0-9_-]', '_', project.title or "autogenesis_project")
    filename = f"{safe_title}.zip"

    try:
        with zipfile.ZipFile(zip_io, 'w', zipfile.ZIP_DEFLATED) as zipf:
            zipf.writestr('app.py', project.generated_code or "# No code was generated for this project.")
            zipf.writestr('product_plan.json', json.dumps(project.product_plan, indent=4) or "{}")
            zipf.writestr('design_plan.json', json.dumps(project.design_plan, indent=4) or "{}")
            readme_content = f"# {project.title}\n\n**Original Idea:**\n{project.idea}\n\nGenerated by AutoGenesis."
            zipf.writestr('README.md', readme_content)
    except Exception as e:
        print(f"Error creating zip file: {e}")
        raise HTTPException(status_code=500, detail="Error creating project zip file")

    zip_io.seek(0)
    
    headers = { 'Content-Disposition': f'attachment; filename="{filename}"' }

    return StreamingResponse(
        zip_io,
        media_type="application/zip",
        headers=headers
    )

# import smtplib
# from fastapi import FastAPI, HTTPException, Depends, status
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.security import OAuth2PasswordRequestForm
# from typing import List
# from datetime import datetime, timezone, timedelta
# from fastapi.concurrency import run_in_threadpool # For running sync LangChain

# # Import our new async database and models
# import models
# import auth
# import database

# # Import the core LangChain logic from main.py
# from main import evocore_orchestrator, llm
# from langchain_core.prompts import PromptTemplate # Correct import path
# from langchain_core.output_parsers import StrOutputParser

# app = FastAPI(
#     title="AutoGenesis API",
#     description="The backend server, now powered by FastAPI, MongoDB, and Beanie.",
#     version="3.0.0" # Major version bump for new architecture
# )

# # --- App Startup Event ---
# # This connects to our MongoDB Atlas database when the server starts.
# @app.on_event("startup")
# async def on_startup():
#     await database.init_db()

# # --- Middleware (No Changes) ---
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # --- NEW: AUTHENTICATION ENDPOINTS (Async / Beanie) ---

# @app.post("/api/signup", response_model=models.UserDisplay)
# async def signup(user: models.UserCreate):
#     """
#     (REWRITTEN) Handles new user registration.
#     Now includes name, age, and profession as requested.
#     """
#     db_user = await auth.get_user(user.email)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
    
#     try:
#         new_user = await auth.create_user(user)
#         # Manually create the display model to send back
#         return models.UserDisplay(
#             _id=new_user.id,
#             name=new_user.name,
#             email=new_user.email,
#             age=new_user.age,
#             profession=new_user.profession,
#             is_verified=new_user.is_verified,
#             created_at=new_user.created_at
#         )
#     except Exception as e:
#         print(f"!!! SEVERE ERROR during signup for {user.email}: {e}")
#         if isinstance(e, smtplib.SMTPAuthenticationError):
#              raise HTTPException(status_code=500, detail="Could not send verification email. Please check server email credentials.")
#         else:
#             raise HTTPException(status_code=500, detail=f"Could not create user: {e}")

# @app.post("/api/login", response_model=models.Token)
# async def login(form_data: OAuth2PasswordRequestForm = Depends()):
#     """
#     (REWRITTEN) Handles user login, checks verification, and returns a token.
#     """
#     user = await auth.authenticate_user(email=form_data.username, password=form_data.password)
#     if not user:
#         raise HTTPException(status_code=401, detail="Incorrect email or password")
#     if not user.is_verified:
#         raise HTTPException(status_code=403, detail="Email not verified. Please check your inbox for an OTP.")
    
#     access_token = auth.create_access_token(data={"sub": user.email})
#     return models.Token(access_token=access_token, token_type="bearer")

# @app.post("/api/verify-otp", response_model=models.Token)
# async def verify_otp(request: models.OtpVerify):
#     """
#     (REWRITTEN) Verifies a user's OTP and logs them in.
#     """
#     user = await auth.get_user(email=request.email)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     if user.is_verified:
#         raise HTTPException(status_code=400, detail="Account already verified")
    
#     if not user.otp_expires_at or user.otp_expires_at < datetime.utcnow():
#         raise HTTPException(status_code=400, detail="OTP has expired")
    
#     if user.otp_secret != request.otp:
#         raise HTTPException(status_code=400, detail="Invalid OTP")

#     # Update the user
#     user.is_verified = True
#     user.otp_secret = None
#     user.otp_expires_at = None
#     await user.save()

#     # Log the user in and return a token
#     access_token = auth.create_access_token(data={"sub": user.email})
#     return models.Token(access_token=access_token, token_type="bearer")

# @app.post("/api/resend-otp")
# async def resend_otp(request: models.ResendOtpRequest):
#     """
#     (REWRITTEN) Generates and sends a new OTP.
#     """
#     user = await auth.get_user(email=request.email)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     if user.is_verified:
#         raise HTTPException(status_code=400, detail="Account is already verified")

#     new_otp = auth.generate_otp()
#     user.otp_secret = new_otp
#     user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=auth.OTP_EXPIRE_MINUTES)
#     await user.save()
    
#     auth.send_verification_email(user.email, new_otp)
#     return {"message": "A new OTP has been sent to your email address."}

# @app.get("/api/users/me", response_model=models.UserDisplay)
# async def get_current_user_profile(current_user: models.User = Depends(auth.get_current_user)):
#     """
#     (NEW) Fetches the profile for the currently logged-in user.
#     """
#     # The 'auth.get_current_user' dependency has already fetched the
#     # user object from the database for us. We just need to return it.
#     # We manually create the display model to be safe.
#     return models.UserDisplay(
#         _id=current_user.id,
#         name=current_user.name,
#         email=current_user.email,
#         age=current_user.age,
#         profession=current_user.profession,
#         is_verified=current_user.is_verified,
#         created_at=current_user.created_at
#     )

# # --- NEW: CHATBOT ENDPOINTS (Async / Beanie) ---

# @app.get("/api/chat/history", response_model=List[models.ChatMessageDisplay])
# async def get_chat_history(current_user: models.User = Depends(auth.get_current_user)):
#     """
#     (REWRITTEN) Gets the chat history for the logged-in user only.
#     """
#     messages = await models.ChatMessage.find(
#         models.ChatMessage.user_id == current_user.id
#     ).sort(+models.ChatMessage.timestamp).to_list()
    
#     # Convert to display model
#     return [
#         models.ChatMessageDisplay(
#             _id=msg.id, 
#             sender=msg.sender, 
#             text=msg.text, 
#             timestamp=msg.timestamp
#         ) 
#         for msg in messages
#     ]

# @app.post("/api/chat", response_model=models.ChatMessageDisplay)
# async def handle_chat(request: models.ChatRequest, current_user: models.User = Depends(auth.get_current_user)):
#     """
#     (REWRITTEN) Handles a single chat turn, saving history to the user's account.
#     """
#     # 1. Save user message
#     user_message = models.ChatMessage(
#         user_id=current_user.id,
#         sender="user",
#         text=request.question
#     )
#     await user_message.insert()

#     # 2. Get history for context
#     history_docs = await models.ChatMessage.find(
#         models.ChatMessage.user_id == current_user.id
#     ).sort(-models.ChatMessage.timestamp).limit(10).to_list()
    
#     chat_history_str = "\n".join([f"{msg.sender}: {msg.text}" for msg in reversed(history_docs)])

#     # 3. Call LangChain
#     prompt_template = """You are 'Genesis', a sharp and concise startup advisor AI...
#     Previous Conversation: {chat_history_str}
#     User's new question: {question}
#     Your concise response:"""
#     prompt = PromptTemplate.from_template(prompt_template)
#     chain = prompt | llm | StrOutputParser()
    
#     # Run the synchronous LangChain code in a thread pool
#     ai_response_text = await run_in_threadpool(
#         chain.invoke, 
#         {"chat_history_str": chat_history_str, "question": request.question}
#     )

#     # 4. Save AI message
#     ai_message = models.ChatMessage(
#         user_id=current_user.id,
#         sender="ai",
#         text=ai_response_text
#     )
#     await ai_message.insert()

#     # 5. Return the AI message
#     return models.ChatMessageDisplay(
#         _id=ai_message.id,
#         sender=ai_message.sender,
#         text=ai_message.text,
#         timestamp=ai_message.timestamp
#     )

# # --- NEW: GENERATOR ENDPOINT (Async / Beanie) ---
# @app.post("/api/generate", response_model=models.ProjectDisplay)
# async def generate_mvp(request: models.IdeaRequest, current_user: models.User = Depends(auth.get_current_user)):
#     """
#     (REWRITTEN) Triggers the MVP generation pipeline (synchronous)
#     and saves the project to the user's account.
#     """
#     print(f"User '{current_user.email}' is generating an MVP for idea: '{request.idea}'")
    
#     try:
#         # 1. Run the blocking, synchronous LangChain pipeline in a thread pool
#         output_data: dict = await run_in_threadpool(
#             evocore_orchestrator, 
#             request.idea
#         ) 
        
#         # 2. Create the project entry in the database
#         new_project = models.Project(
#             owner_id=current_user.id,
#             idea=request.idea,
#             title=output_data.get('product_plan', {}).get('product_name', "New Project"),
#             product_plan=output_data.get('product_plan'),
#             design_plan=output_data.get('design_plan'),
#             generated_code=output_data.get('code')
#         )
#         await new_project.insert()

#         # 3. Return the created project details
#         return models.ProjectDisplay(
#             _id=new_project.id,
#             owner_id=new_project.owner_id,
#             idea=new_project.idea,
#             title=new_project.title,
#             created_at=new_project.created_at
#         )

#     except Exception as e:
#         print(f"An error occurred during MVP generation: {e}")
#         raise HTTPException(status_code=500, detail=f"An error occurred during generation: {str(e)}")