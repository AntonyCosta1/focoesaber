from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.atividade import Atividade
from app.models.escola import Escola

from app.schemas.atividade import CriarAtividade, AtividadeResponse

router = APIRouter(prefix="/atividades", tags=["Atividades"])

@router.post("/", response_model=AtividadeResponse)
def criar_atividade(data: CriarAtividade, db: Session = Depends(get_db)):
    escola = db.query(Escola).filter(Escola.id_escola == data.id_escola).first()
    if not escola:
        raise HTTPException(status_code=404, detail="Escola não encontrada")
    
    atividade = Atividade(
        nome = data.nome,
        descricao = data.descricao,
        id_escola = data.id_escola
    )

    db.add(atividade)
    db.commit()
    db.refresh(atividade)
    return atividade

@router.get("/", response_model=list[AtividadeResponse])
def listar_atividades(db: Session = Depends(get_db)):
    return db.query(Atividade).all()