from pydantic import BaseModel

class CriarAtividade(BaseModel):
    nome: str
    descricao: str | None = None
    id_escola: int

class AtividadeResponse(BaseModel):
    id_atividade: int
    nome: str
    descricao: str | None = None
    id_escola: int

    class Config:
        from_attributes = True