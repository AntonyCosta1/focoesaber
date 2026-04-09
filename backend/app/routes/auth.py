from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.core.security import verify_password, criar_token_de_acesso

router = APIRouter(prefix="/login", tags=["login"])

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.senha, user.senha):
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

  

