from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.database import Base
from sqlalchemy.sql import func

class Inscricao(Base):
    __tablename__ = "inscricoes"

    id_inscricao = Column(Integer, primary_key=True, index=True)
    id_aluno = Column(Integer, ForeignKey("alunos.id_aluno"), nullable=False)
    id_indicacao = Column(Integer, ForeignKey("indicacoes.id_indicacao"), nullable=False, unique=True)
    id_atividade = Column(Integer, ForeignKey("atividades.id_atividade"), nullable=False)
    status_inscricao = Column(String(20), default="ativa")
    data_confirmacao = Column(DateTime(timezone=True), server_default=func.now())