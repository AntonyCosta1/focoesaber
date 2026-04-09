from pydantic import BaseModel

class CriarEscola(BaseModel):
    nome: str
    endereco: str | None = None
    telefone: str | None = None

class EscolaResponse(BaseModel):
    id_escola: int
    nome: str
    endereco: str | None
    telefone: str | None

    class Config:
        from_attributes = True