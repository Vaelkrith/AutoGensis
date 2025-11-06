# --------------------------------------------------------------------------
# AutoGenesis: Phase 4, Step 1 - Database Setup
#
# This file sets up our connection to a SQLite database using SQLAlchemy.
# It creates the "engine" that talks to the database and a "session"
# maker to handle individual conversations with it. The `Base` class
# will be used by our models to define the table structures.
# --------------------------------------------------------------------------

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the database URL. For SQLite, this is the path to the file.
# The 'check_same_thread' argument is needed for SQLite.
SQLALCHEMY_DATABASE_URL = "sqlite:///./autogenesis.db"

# Create the SQLAlchemy engine. This is the main entry point to the database.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Each instance of SessionLocal will be a new database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# We will inherit from this Base class to create each of our database models.
Base = declarative_base()

# A new function to create the database and all tables
def create_db_and_tables():
    Base.metadata.create_all(bind=engine)