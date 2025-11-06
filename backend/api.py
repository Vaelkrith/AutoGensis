# --------------------------------------------------------------------------
# AutoGenesis: FIX for 422 Error (Part 2)
#
# This update manually constructs the Pydantic models for the response
# to guarantee a 100% match with the (now fixed) schema.
# --------------------------------------------------------------------------

import smtplib
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from datetime import datetime, timezone, timedelta
import models, schemas, auth, database
from main import evocore_orchestrator, llm
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

database.create_db_and_tables()

app = FastAPI(
    title="AutoGenesis API",
    description="The complete backend server with professional authentication.",
    version="2.1.3" # Version bump for new fix
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- AUTHENTICATION ENDPOINTS (No changes needed) ---

@app.post("/api/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = auth.get_user(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    try:
        new_user = auth.create_user(db=db, user=user)
        return schemas.User.model_validate(new_user) 
    except Exception as e:
        print(f"!!! SEVERE ERROR during signup for {user.email}: {e}")
        if isinstance(e, smtplib.SMTPAuthenticationError):
             raise HTTPException(status_code=500, detail="Could not send verification email. Please check server email credentials.")
        else:
            raise HTTPException(status_code=500, detail=f"Could not create user: {e}")

@app.post("/api/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified. Please check your inbox for an OTP.")
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/verify-otp", response_model=schemas.Token)
def verify_otp(request: schemas.OtpVerify, db: Session = Depends(get_db)):
    user = auth.get_user(db, email=request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        raise HTTPException(status_code=400, detail="Account already verified")
    if not user.otp_expires_at or user.otp_expires_at < datetime.utcnow().replace(tzinfo=None):
        raise HTTPException(status_code=400, detail="OTP has expired")
    if user.otp_secret != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.is_verified = True
    user.otp_secret = None
    user.otp_expires_at = None
    db.commit()

    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/resend-otp")
def resend_otp(request: schemas.ResendOtpRequest, db: Session = Depends(get_db)):
    user = auth.get_user(db, email=request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        raise HTTPException(status_code=400, detail="Account is already verified")

    new_otp = auth.generate_otp()
    user.otp_secret = new_otp
    user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=auth.OTP_EXPIRE_MINUTES)
    db.commit()
    auth.send_verification_email(user.email, new_otp)
    return {"message": "A new OTP has been sent to your email address."}


# --- CHATBOT ENDPOINTS (FIXED) ---

@app.get("/api/chat/history", response_model=List[schemas.ChatMessage])
def get_chat_history(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    """
    Retrieves the chat history.
    FIX: Manually constructs the Pydantic objects to fix 422 error.
    """
    db_messages = db.query(models.ChatMessage).filter(models.ChatMessage.user_id == current_user.id).order_by(models.ChatMessage.timestamp).all()
    
    # --- THIS IS THE FIX ---
    # Manually create the list of Pydantic objects
    response_messages = []
    for msg in db_messages:
        response_messages.append(
            schemas.ChatMessage(
                id=msg.id,
                sender=msg.sender,
                text=msg.text,
                timestamp=msg.timestamp
            )
        )
    return response_messages

@app.post("/api/chat", response_model=schemas.ChatMessage)
def handle_chat(request: schemas.ChatRequest, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    """
    Handles a single chat turn.
    FIX: Manually constructs the Pydantic response object.
    """
    user_message = models.ChatMessage(text=request.question, sender="user", user_id=current_user.id)
    db.add(user_message)
    db.commit() 
    
    chat_history_db = db.query(models.ChatMessage).filter(models.ChatMessage.user_id == current_user.id).order_by(models.ChatMessage.timestamp.desc()).limit(10).all()
    chat_history_db.reverse()
    chat_history_str = "\n".join([f"{msg.sender}: {msg.text}" for msg in chat_history_db])
    
    prompt_template = """You are 'Genesis', a sharp and concise startup advisor AI...""" # (prompt omitted)
    prompt = PromptTemplate.from_template(prompt_template)
    chain = prompt | llm | StrOutputParser()
    ai_response_text = chain.invoke({"chat_history_str": chat_history_str, "question": request.question})
    
    ai_message = models.ChatMessage(text=ai_response_text, sender="ai", user_id=current_user.id)
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)
    
    # --- THIS IS THE FIX ---
    # Manually create the Pydantic object for the response
    return schemas.ChatMessage(
        id=ai_message.id,
        sender=ai_message.sender,
        text=ai_message.text,
        timestamp=ai_message.timestamp
    )

@app.post("/api/generate", response_model=schemas.Project)
def generate_mvp(request: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    """
    Generates an MVP.
    FIX: Manually constructs the Pydantic response object.
    """
    try:
        new_project = models.Project(idea=request.idea, title=f"Project for '{request.idea[:25]}...'", owner_id=current_user.id)
        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        # --- THIS IS THE FIX ---
        # Manually create the Pydantic object for the response
        return schemas.Project(
            id=new_project.id,
            idea=new_project.idea,
            title=new_project.title,
            owner_id=new_project.owner_id,
            created_at=new_project.created_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))