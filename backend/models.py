# # --- models.py ---
# # CORRECT VERSION - Includes OTP fields

# from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, JSON, Text, Boolean #<-- Make sure Boolean is imported
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func 

# from database import Base

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True)
#     email = Column(String, unique=True, index=True, nullable=False)
#     hashed_password = Column(String, nullable=False)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())

#     # --- THESE LINES MUST BE PRESENT ---
#     is_verified = Column(Boolean, default=False)  # <--- THIS ONE
#     otp_secret = Column(String, nullable=True) 
#     otp_expires_at = Column(DateTime(timezone=True), nullable=True)

#     projects = relationship("Project", back_populates="owner")
#     chat_messages = relationship("ChatMessage", back_populates="user")

# # (Rest of the file remains the same - Project, ChatMessage classes)
# class Project(Base):
#     __tablename__ = "projects"
#     id = Column(Integer, primary_key=True)
#     idea = Column(Text, nullable=False)
#     title = Column(String, index=True)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     product_plan = Column(JSON)
#     design_plan = Column(JSON)
#     generated_code = Column(Text)
#     owner_id = Column(Integer, ForeignKey("users.id"))
#     owner = relationship("User", back_populates="projects")

# class ChatMessage(Base):
#     __tablename__ = "chat_messages"
#     id = Column(Integer, primary_key=True)
#     text = Column(Text, nullable=False)
#     sender = Column(String, nullable=False)
#     timestamp = Column(DateTime(timezone=True), server_default=func.now())
#     user_id = Column(Integer, ForeignKey("users.id"))
#     user = relationship("User", back_populates="chat_messages")

# --------------------------------------------------------------------------
# AutoGenesis: Phase 4, Step 4.3 - NEW MongoDB Data Models
#
# This file REPLACES the old models.py AND schemas.py.
# It uses beanie.Document (Pydantic v2) and fixes all library conflicts.
# --------------------------------------------------------------------------

from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Database Document Models (Used by Beanie) ---
# These are the "blueprints" for data in your MongoDB.

class User(Document):
    """
    The main user model.
    Includes name, age, and profession as requested.
    """
    name: str
    email: EmailStr
    age: Optional[int] = None
    profession: Optional[str] = None
    hashed_password: str
    is_verified: bool = False
    otp_secret: Optional[str] = None
    otp_expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "users" # The collection name in MongoDB


class Project(Document):
    """
    The model for storing generated MVP projects.
    """
    owner_id: PydanticObjectId # Links to the User's _id
    idea: str
    title: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    product_plan: Optional[dict] = None
    design_plan: Optional[dict] = None
    generated_code: Optional[str] = None

    class Settings:
        name = "projects"


class ChatMessage(Document):
    """
    The model for storing chat messages.
    Linked to a user_id for per-user history, as requested.
    """
    user_id: PydanticObjectId # Links to the User's _id
    sender: str # "user" or "ai"
    text: str
    timestamp: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "chat_messages"

# --- API Data Schemas (Used by FastAPI) ---
# This replaces the need for a separate 'schemas.py' file.

class UserCreate(BaseModel):
    """Schema for creating a new user (what the signup form sends)."""
    name: str
    email: EmailStr
    password: str
    age: Optional[int] = None
    profession: Optional[str] = None

class UserDisplay(BaseModel):
    """Schema for safely returning user data (no password)."""
    id: PydanticObjectId = Field(..., alias="_id")
    name: str
    email: EmailStr
    age: Optional[int]
    profession: Optional[str]
    is_verified: bool
    created_at: datetime

class Token(BaseModel):
    """Schema for returning a JWT token."""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Schema for the data encoded inside the JWT."""
    email: Optional[str] = None

class OtpVerify(BaseModel):
    """Schema for the OTP verification request."""
    email: EmailStr
    otp: str

class ResendOtpRequest(BaseModel):
    """Schema for the resend-OTP request."""
    email: EmailStr

class ChatRequest(BaseModel):
    """Schema for sending a new chat question."""
    question: str

class ChatMessageDisplay(BaseModel):
    """Schema for returning a single chat message."""
    id: PydanticObjectId = Field(..., alias="_id")
    sender: str
    text: str
    timestamp: datetime

class IdeaRequest(BaseModel):
    """Schema for the MVP generator request."""
    idea: str

class ProjectDisplay(BaseModel):
    """Schema for returning project data."""
    id: PydanticObjectId = Field(..., alias="_id")
    owner_id: PydanticObjectId
    idea: str
    title: Optional[str]
    created_at: datetime