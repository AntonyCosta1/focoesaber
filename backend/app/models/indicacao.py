from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.database import Base
from sqlalchemy.sql import func 

class Indicacao(Base):
    __tablename__ = "indicacoes"

    id_indicacao = Column(Integer, primary_key=True, index=True)
    id_aluno = Column(Integer, ForeignKey("alunos.id_aluno"), nullable=False)
    id_professor = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    data_indicacao = Column(DateTime(timezone=True), server_default=func.now())
    status_aprovacao = Column(String(20),nullable=False, default="pendente")
    observacao = Column(String(250), nullable=True)