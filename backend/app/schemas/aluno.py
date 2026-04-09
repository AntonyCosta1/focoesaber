from pydantic import BaseModel
from datetime import date

class CriarAluno(BaseModel):
    nome: str
    data_nascimento: date
    matricula: str
    id_escola: int
    id_responsavel: int

class AlunoResponse(BaseModel):
    id_aluno: int
    nome: str
    data_nascimento: date
    matricula: str
    id_escola: int
    id_responsavel: int

    class Config:
        from_attributes = True