from pydantic import BaseModel

class CriarDesempenho(BaseModel):
    id_inscricao: int
    id_professor: int
    descricao: str
    observacao: str | None = None

class DesempenhoResponse(BaseModel):
    id_desempenho: int
    id_inscricao: int
    id_professor: int
    descricao: str
    observacao: str | None = None
    validado: bool

    class Config:
        from_attributes = True