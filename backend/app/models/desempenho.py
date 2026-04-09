from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.sql import func
from app.database import Base

class Desempenho(Base):
    __tablename__ = "desempenhos"

    id_desempenho = Column(Integer, primary_key=True, index=True)
    id_inscricao = Column(Integer, ForeignKey("inscricoes.id_inscricao"), nullable=False)
    id_professor = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    data_registro = Column(DateTime(timezone=True), server_default=func.now())
    descricao = Column(String(255), nullable=True)
    observacao = Column(Text, nullable=True)
    validado = Column(Boolean, default=False)