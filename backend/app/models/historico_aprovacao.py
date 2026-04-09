from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base
from sqlalchemy.sql import func

class HistoricoAprovacao(Base):
    __tablename__ = "historico_aprovacao"

    id_historico = Column(Integer, primary_key=True, index=True)
    id_indicacao = Column(Integer, ForeignKey("indicacoes.id_indicacao"), nullable=False)
    id_responsavel = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    data_resposta = Column(DateTime(timezone=True), server_default=func.now())
    status_resposta = Column(String(20), nullable=False)
    observacao = Column(String(250), nullable=True)
