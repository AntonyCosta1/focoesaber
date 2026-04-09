from sqlalchemy import Column, Integer, String, ForeignKey, Date, Boolean
from app.database import Base

class Frequencia(Base):
    __tablename__ = "frequencias"

    id_frequencia = Column(Integer, primary_key=True, index=True)
    id_inscricao = Column(Integer, ForeignKey("inscricoes.id_inscricao"), nullable=False)
    data_aula = Column(Date, nullable=False)
    tipo_aula = Column(String(50), nullable=False)
    presente = Column(Boolean, default=False)