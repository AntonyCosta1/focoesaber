from pydantic import BaseModel

class CriarInscricao(BaseModel):
    id_indicacao: int
    id_atividade: int

class InscricaoResponse(BaseModel):
    id_inscricao: int
    id_aluno: int
    id_indicacao: int
    id_atividade: int
    status_inscricao: str

    class Config:
        from_attributes = True