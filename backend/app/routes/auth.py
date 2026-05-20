from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.schemas.auth import TokenResponse
from app.core.security import verify_password, criar_token_de_acesso, hash_password

router = APIRouter(prefix="/login", tags=["login"])


class CriarAdminBootstrap(BaseModel):
    nome: str
    email: str  # Email simples, sem validação de EmailStr
    senha: str
    telefone: str = ""


@router.post("/criar-admin-primeiro", response_model=TokenResponse)
def criar_primeiro_admin(
    dados: CriarAdminBootstrap,
    db: Session = Depends(get_db)
):
    """
    Cria o primeiro usuário admin do sistema.
    Só funciona se não houver nenhum admin no banco de dados.
    """
    # Verifica se já existe um admin
    admin_existe = db.query(User).filter(User.tipo_usuario == "admin").first()
    
    if admin_existe:
        raise HTTPException(
            status_code=403, 
            detail="Já existe um admin. Use a funcionalidade normal de criação de usuários."
        )
    
    # Verifica se o email já está cadastrado
    usuario_existe = db.query(User).filter(User.email == dados.email).first()
    if usuario_existe:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # Cria o primeiro admin
    novo_admin = User(
        nome=dados.nome,
        email=dados.email,
        senha=hash_password(dados.senha),
        telefone=dados.telefone,
        tipo_usuario="admin"
    )
    
    db.add(novo_admin)
    db.commit()
    db.refresh(novo_admin)
    
    # Retorna um token de acesso
    access_token = criar_token_de_acesso({
        "sub": str(novo_admin.id_usuario),
        "email": novo_admin.email,
        "tipo_usuario": novo_admin.tipo_usuario
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.senha):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    access_token = criar_token_de_acesso({
        "sub": str(user.id_usuario),
        "email": user.email,
        "tipo_usuario": user.tipo_usuario
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }