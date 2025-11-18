# --------------------------------------------------------------------------
# AutoGenesis: Phase 4, Step 4.4 - NEW Async Authentication Logic
#
# This file REPLACES the old auth.py. It's rewritten to be fully async
# and use Beanie/MongoDB instead of SQLAlchemy.
# --------------------------------------------------------------------------

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Optional
import random
import smtplib 
import os 
from dotenv import load_dotenv 
from email.mime.text import MIMEText

# Import our new Beanie models from models.py
from models import User, UserCreate, TokenData

# Load .env variables (like EMAIL_SENDER, EMAIL_PASSWORD)
load_dotenv()

# --- Password Hashing (No Changes) ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- JWT Configuration (No Changes) ---
SECRET_KEY = "a_very_secret_key_for_autogenesis"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

# --- OTP Configuration (No Changes) ---
OTP_EXPIRE_MINUTES = 10

# --- Email Sending Function (Preserved) ---
def send_verification_email(email: str, otp: str):
    """
    Sends a real verification email using Gmail's SMTP server.
    """
    sender_email = os.getenv("EMAIL_SENDER")
    sender_password = os.getenv("EMAIL_PASSWORD")

    print(f"--- DEBUG: Attempting to send email ---")
    print(f"--- DEBUG: Using sender: {sender_email}")
    print(f"--- DEBUG: Sending To: {email}")

    if not sender_email or not sender_password:
        print("!!! ERROR: Email credentials NOT FOUND in .env file or environment.")
        raise ValueError("Email sender or password not configured.") 

    subject = "Your AutoGenesis Verification Code"
    body = f"""
    Hello,

    Thank you for signing up for AutoGenesis.
    Your One-Time Password (OTP) is: {otp}
    This code will expire in {OTP_EXPIRE_MINUTES} minutes.
    If you did not request this, please ignore this email.

    Best,
    The AutoGenesis Team
    """

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = email

    try:
        print(f"--- DEBUG: Connecting to smtp.gmail.com:465...")
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            print(f"--- DEBUG: Attempting server.login()...")
            server.login(sender_email, sender_password)
            print(f"--- DEBUG: Login successful. Sending message...")
            server.send_message(msg)
        print(f"--- SUCCESS: Verification email sent to {email} ---")
    except smtplib.SMTPAuthenticationError as e:
        print(f"!!! SMTP AUTH ERROR: Login failed. Double-check EMAIL_SENDER and EMAIL_PASSWORD (App Password).")
        print(f"!!! Google Error Details: {e}")
        raise e
    except Exception as e:
        print(f"!!! FAILED to send email. Error Type: {type(e).__name__}")
        print(f"!!! Error Details: {e}")
        raise e

# --- Helper Functions (No Changes) ---

def generate_otp():
    return str(random.randint(100000, 999999))

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# --- NEW ASYNC/BEANIE DATABASE FUNCTIONS ---

async def get_user(email: str) -> Optional[User]:
    """
    (REPLACED) Fetches a user from MongoDB using Beanie.
    """
    return await User.find_one(User.email == email)

async def create_user(user: UserCreate) -> User:
    """
    (REPLACED) Creates a new user in MongoDB using Beanie.
    Includes the new fields: name, age, profession.
    """
    hashed_password = get_password_hash(user.password)
    otp = generate_otp()
    otp_expires = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
    
    db_user = User(
        name=user.name,
        email=user.email,
        age=user.age,
        profession=user.profession,
        hashed_password=hashed_password,
        is_verified=False,
        otp_secret=otp,
        otp_expires_at=otp_expires
    )
    
    await db_user.insert()
    
    try:
        send_verification_email(db_user.email, otp)
    except Exception as email_error:
        print(f"!!! WARNING: User {db_user.email} created, but FAILED to send verification email: {email_error}")
        
    return db_user

async def authenticate_user(email: str, password: str) -> Optional[User]:
    """
    (REPLACED) Authenticates a user against the MongoDB database.
    """
    user = await get_user(email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    (REPLACED) FastAPI dependency to get the current user from a JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = await get_user(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user




# from fastapi import Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from jose import JWTError, jwt
# from passlib.context import CryptContext
# from datetime import datetime, timedelta, timezone
# from typing import Optional
# from sqlalchemy.orm import Session
# import random
# import smtplib 
# import os 
# from dotenv import load_dotenv 
# from email.mime.text import MIMEText

# import database, models, schemas

# load_dotenv()

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# SECRET_KEY = "a_very_secret_key_for_autogenesis"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

# OTP_EXPIRE_MINUTES = 10

# def send_verification_email(email: str, otp: str):
#     """
#     Sends a real verification email using Gmail's SMTP server.
#     ADDED EXTRA DEBUGGING.
#     """
#     sender_email = os.getenv("EMAIL_SENDER")
#     sender_password = os.getenv("EMAIL_PASSWORD")

#     print(f"--- DEBUG: Attempting to send email ---")
#     print(f"--- DEBUG: Using sender: {sender_email}")
#     print(f"--- DEBUG: Sending To: {email}")

#     if not sender_email or not sender_password:
#         print("!!! ERROR: Email credentials NOT FOUND in .env file or environment.")
        
#         raise ValueError("Email sender or password not configured.") 
        

#     subject = "Your AutoGenesis Verification Code"
#     body = f"""
#     Hello,

#     Thank you for signing up for AutoGenesis.
#     Your One-Time Password (OTP) is: {otp}
#     This code will expire in {OTP_EXPIRE_MINUTES} minutes.
#     If you did not request this, please ignore this email.

#     Best,
#     The AutoGenesis Team
#     """

#     msg = MIMEText(body)
#     msg['Subject'] = subject
#     msg['From'] = sender_email
#     msg['To'] = email

#     try:
#         print(f"--- DEBUG: Connecting to smtp.gmail.com:465...")
#         with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
#             print(f"--- DEBUG: Attempting server.login()...")
#             server.login(sender_email, sender_password)
#             print(f"--- DEBUG: Login successful. Sending message...")
#             server.send_message(msg)
#         print(f"--- SUCCESS: Verification email sent to {email} ---")
#     except smtplib.SMTPAuthenticationError as e:
#         print(f"!!! SMTP AUTH ERROR: Login failed. Double-check EMAIL_SENDER and EMAIL_PASSWORD (App Password).")
#         print(f"!!! Google Error Details: {e}")
        
#         raise e
#     except Exception as e:
#         print(f"!!! FAILED to send email. Error Type: {type(e).__name__}")
#         print(f"!!! Error Details: {e}")
        
#         raise e



# def generate_otp():
#     return str(random.randint(100000, 999999))

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def get_password_hash(password):
#     return pwd_context.hash(password)

# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.now(timezone.utc) + expires_delta
#     else:
#         expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# def get_user(db: Session, email: str):
#     return db.query(models.User).filter(models.User.email == email).first()

# def create_user(db: Session, user: schemas.UserCreate):
#     hashed_password = get_password_hash(user.password)
    
    
#     db_user = models.User(
#         email=user.email, 
#         hashed_password=hashed_password
#     )
#     db_user.is_verified = False 
    
#     # Set OTP details
#     otp = generate_otp()
#     db_user.otp_secret = otp
#     db_user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
    
#     # Add to session and commit
#     db.add(db_user)
#     db.commit()
    
#     # Refresh to get DB-generated values like ID and created_at
#     db.refresh(db_user) 
    
#     # Send email
#     try:
#         send_verification_email(db_user.email, otp)
#     except Exception as email_error:
#         print(f"!!! WARNING: User {db_user.email} created, but FAILED to send verification email: {email_error}")
        
#     return db_user # Return the final object

# def authenticate_user(db: Session, email: str, password: str):
#     user = get_user(db, email)
#     if not user or not verify_password(password, user.hashed_password):
#         return None
#     return user

# def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.SessionLocal)):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email: str = payload.get("sub")
#         if email is None:
#             raise credentials_exception
#         token_data = schemas.TokenData(email=email)
#     except JWTError:
#         raise credentials_exception
    
#     user = get_user(db, email=token_data.email)
#     if user is None:
#         raise credentials_exception
#     return user

# --------------------------------------------------------------------------
# AutoGenesis: Phase 4, Step 4.4 - NEW Async Authentication Logic
#
# This file REPLACES the old auth.py. It's rewritten to be fully async
# and use Beanie/MongoDB instead of SQLAlchemy.
# All non-database logic (email, JWT, hashing) is preserved.
# --------------------------------------------------------------------------

