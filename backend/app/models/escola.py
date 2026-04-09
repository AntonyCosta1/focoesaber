from sqlalchemy import Column, Integer, String
from app.database import Base

class Escola(Base):
    __tablename__ = "escolas"

    id_escola = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    endereco = Column(String(250))
    telefone = Column(String(20))
