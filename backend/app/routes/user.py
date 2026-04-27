from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import CriarUsuario, UserResponse
from app.core.security import hash_password
from app.dependencies.auth import exigir_perfil, get_current_user

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
def listar_usuarios(
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(exigir_perfil("admin"))
):
    return db.query(User).all()

@router.get("/buscar/{nome}")
def buscar_usuario_por_nome(nome: str, db: Session = Depends(get_db)):
    usuarios = db.query(User).filter(User.nome.ilike(f"%{nome}%")).all()

    if not usuarios:
        raise HTTPException(status_code=404, detail="Nenhum aluno encontrado")

    return usuarios

@router.get("/me", response_model=UserResponse)
def meu_usuario(usuario_atual: User = Depends(get_current_user)):
    return usuario_atual