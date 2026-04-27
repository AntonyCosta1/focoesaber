from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.desempenho import Desempenho
from app.models.inscricao import Inscricao
from app.models.user import User
from app.dependencies.auth import get_current_user, exigir_perfil

from app.schemas.desempenho import CriarDesempenho, DesempenhoResponse

router = APIRouter(prefix="/desempenhos", tags=["Desempenhos"])

@router.post("/", response_model=DesempenhoResponse)
def criar_desempenho(
    data: CriarDesempenho, 
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(exigir_perfil("admin","professor"))
    ):
    inscricao = db.query(Inscricao).filter(Inscricao.id_inscricao == data.id_inscricao).first()
    if not inscricao:
        raise HTTPException(status_code=404, detail="Inscrição não encontrada")
    
    professor = db.query(User).filter(User.id_usuario == data.id_professor).first()
    if not professor:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    
    if professor.tipo_usuario != "professor":
        raise HTTPException(status_code=400, detail="Usuário não é um professor")
    
    desempenho = Desempenho(
        id_inscricao=data.id_inscricao,
        id_professor=usuario_atual.id_usuario,
        descricao=data.descricao,
        observacao=data.observacao,
        validado=True
    )

    db.add(desempenho)
    db.commit()
    db.refresh(desempenho)
    return desempenho

@router.get("/", response_model=list[DesempenhoResponse])
def listar_desempenhos(
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(exigir_perfil("admin","professor"))
    ):
    return db.query(Desempenho).all()
