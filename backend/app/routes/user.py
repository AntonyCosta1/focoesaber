from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import CriarUsuario, UserResponse
from app.core.security import hash_password

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

@router.post("/", response_model=UserResponse)
def criar_usuario(usuario: CriarUsuario, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == usuario.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    user = User(
        nome = usuario.nome,
        email = usuario.email,
        senha = hash_password(usuario.senha),
        telefone = usuario.telefone,
        tipo_usuario = usuario.tipo_usuario
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@router.get("/", response_model=list[UserResponse])
def listar_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(User).all()
    return usuarios