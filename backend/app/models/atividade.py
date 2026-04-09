from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Atividade(Base):
    __tablename__ = "atividades"

    id_atividade = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    descricao = Column(String(255))
    id_escola = Column(Integer, ForeignKey("escolas.id_escola"), nullable=False)