from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from app.database import Base

class Aluno(Base):
    __tablename__ = "alunos"

    id_aluno = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    data_nascimento = Column(Date, nullable=False)
    matricula = Column(String(30), unique=True, nullable=False)
    matriculado_ativo = Column(Boolean, default=True)
    id_escola = Column(Integer, ForeignKey("escolas.id_escola"), nullable=False)
    id_responsavel = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    

