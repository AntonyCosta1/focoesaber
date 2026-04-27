from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.database import get_db
from app.models.user import User
from app.core.security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/login")

def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id_usuario: str = payload.get("sub")

        if id_usuario is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user = db.query(User).filter(User.id == id_usuario).first()

    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    
    return user

def exigir_perfil(*perfis):
    def verificar(usuario_atual: User = Depends(get_current_user)):
        if usuario_atual.tipo_usuario not in perfis:
            raise HTTPException(status_code=403, detail="Acesso negado")
        return usuario_atual
    return verificar

