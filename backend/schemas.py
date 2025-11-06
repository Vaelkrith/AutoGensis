# --------------------------------------------------------------------------
# AutoGenesis: FIX for 422 Error (Part 1)
#
# This update aligns the ChatMessage schema with the database model.
# --------------------------------------------------------------------------

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- OTP Schemas ---
class OtpVerify(BaseModel):
    email: str
    otp: str

class ResendOtpRequest(BaseModel):
    email: str


# --- Chat Schemas (FIXED) ---
class ChatMessage(BaseModel):
    id: int                # <-- ADDED
    sender: str
    text: str
    timestamp: datetime    # <-- ADDED

    class Config:
        from_attributes = True # Pydantic v2+ way to read from ORM models

class ChatRequest(BaseModel):
    question: str


# --- Project Schemas ---
class ProjectBase(BaseModel):
    idea: str
    title: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    class Config:
        from_attributes = True


# --- User Schemas ---
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    is_verified: bool
    projects: List[Project] = []
    class Config:
        from_attributes = True


# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None