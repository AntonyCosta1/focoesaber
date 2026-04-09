from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    senha = Column(String(150), nullable=False)
    telefone = Column(String(20))
    tipo_usuario = Column(String(20), nullable=False)
    ativo = Column(Boolean, default=True)