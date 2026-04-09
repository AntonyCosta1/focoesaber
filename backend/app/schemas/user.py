from pydantic import BaseModel, EmailStr

class CriarUsuario(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    telefone: str | None = None
    tipo_usuario: str

class UserResponse(BaseModel):
    id_usuario: int
    nome: str
    email: EmailStr
    telefone: str | None = None
    tipo_usuario: str

    class Config:
        from_attributes = True