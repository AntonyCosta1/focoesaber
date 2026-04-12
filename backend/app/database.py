from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = "postgresql://focoesaber_user:If34DUtu4sLI2xOHrdSNPk3j22V1T5B1@dpg-d7duuvhf9bms738dhc70-a.oregon-postgres.render.com/focoesaber"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()