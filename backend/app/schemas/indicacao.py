from pydantic import BaseModel
from datetime import datetime

class CriarIndicacao(BaseModel):
    id_aluno: int
    id_professor: int
    observacao: str | None = None

class IndicacaoResponse(BaseModel):
    id_indicacao: int
    id_aluno: int
    id_professor: int
    data_indicacao: datetime
    status_aprovacao: str
    observacao: str | None

    class Config:
        from_attributes = True