# --- models.py ---
# CORRECT VERSION - Includes OTP fields

from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, JSON, Text, Boolean #<-- Make sure Boolean is imported
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func 

from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # --- THESE LINES MUST BE PRESENT ---
    is_verified = Column(Boolean, default=False)  # <--- THIS ONE
    otp_secret = Column(String, nullable=True) 
    otp_expires_at = Column(DateTime(timezone=True), nullable=True)

    projects = relationship("Project", back_populates="owner")
    chat_messages = relationship("ChatMessage", back_populates="user")

# (Rest of the file remains the same - Project, ChatMessage classes)
class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    idea = Column(Text, nullable=False)
    title = Column(String, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    product_plan = Column(JSON)
    design_plan = Column(JSON)
    generated_code = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="projects")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True)
    text = Column(Text, nullable=False)
    sender = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="chat_messages")