# # --------------------------------------------------------------------------
# # AutoGenesis: Phase 4, Step 1 - Database Setup
# #
# # This file sets up our connection to a SQLite database using SQLAlchemy.
# # It creates the "engine" that talks to the database and a "session"
# # maker to handle individual conversations with it. The `Base` class
# # will be used by our models to define the table structures.
# # --------------------------------------------------------------------------

# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker

# # Define the database URL. For SQLite, this is the path to the file.
# # The 'check_same_thread' argument is needed for SQLite.
# SQLALCHEMY_DATABASE_URL = "sqlite:///./autogenesis.db"

# # Create the SQLAlchemy engine. This is the main entry point to the database.
# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
# )

# # Each instance of SessionLocal will be a new database session.
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # We will inherit from this Base class to create each of our database models.
# Base = declarative_base()

# # A new function to create the database and all tables
# def create_db_and_tables():
#     Base.metadata.create_all(bind=engine)

# --------------------------------------------------------------------------
# AutoGenesis: Phase 4, Step 4.2 - NEW MongoDB Database Connection
#
# This file REPLACES the old database.py. It connects to MongoDB Atlas
# using Beanie and your .env connection string.
# --------------------------------------------------------------------------
# --------------------------------------------------------------------------
# AutoGenesis: Phase 4, Step 4.2 - NEW MongoDB Database Connection
#
# This file connects to MongoDB Atlas using Beanie.
# --------------------------------------------------------------------------

import os
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Type
from pydantic import BaseModel

# We must import all the models we want Beanie to discover.
# This will import from the 'models.py' file we are about to create.
import models

# Load the connection string from the .env file
MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING")

if not MONGO_CONNECTION_STRING:
    raise ValueError("MONGO_CONNECTION_STRING is not set in the .env file")

# Define all the Document models Beanie needs to initialize
DOCUMENT_MODELS: List[Type[BaseModel]] = [
    models.User,
    models.Project,
    models.ChatMessage
]

async def init_db():
    """
    Initializes the database connection and Beanie.
    """
    print("Connecting to MongoDB Atlas...")
    try:
        # Create the MongoDB client
        client = AsyncIOMotorClient(MONGO_CONNECTION_STRING)
        
        # Get the database (you can name this whatever you want)
        db = client.autogenesis_db

        # Initialize Beanie with the database and document models
        await init_beanie(database=db, document_models=DOCUMENT_MODELS)
        
        print("Successfully connected to MongoDB Atlas and initialized Beanie.")
    except Exception as e:
        print(f"!!! FAILED to connect to MongoDB Atlas: {e}")
        print("!!! Please check your MONGO_CONNECTION_STRING in the .env file and ensure your IP is whitelisted in Atlas.")
        raise