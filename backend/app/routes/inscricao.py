from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.inscricao import Inscricao
from app.models.indicacao import Indicacao
from app.models.atividade import Atividade
from app.models.aluno import Aluno

from app.schemas.inscricao import CriarInscricao, InscricaoResponse

router = APIRouter(prefix="/inscricoes", tags=["Inscrições"])

@router.post("/", response_model=InscricaoResponse)
def criar_inscricao(data: CriarInscricao, db: Session = Depends(get_db)):

    indicacao = db.query(Indicacao).filter(Indicacao.id_indicacao == data.id_indicacao).first()
    if not indicacao:
        raise HTTPException(status_code=404, detail="Indicação não encontrada")
    
    if indicacao.status_aprovacao != "aprovado":
        raise HTTPException(status_code=400, detail="Indicação não aprovada")
    
    aluno = db.query(Aluno).filter(Aluno.id_aluno == indicacao.id_aluno).first()

    atividade = db.query(Atividade).filter(Atividade.id_atividade == data.id_atividade).first()
    if not atividade:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    
    if atividade.id_escola != aluno.id_escola:
        raise HTTPException(status_code=400, detail="Atividade não pertence à escola do aluno")
    
    existe = db.query(Inscricao).filter(Inscricao.id_indicacao == data.id_indicacao).first()
    if existe:
        raise HTTPException(status_code=400, detail="Indicação já utilizada para inscrição")
    
    inscricao = Inscricao(
        id_aluno = aluno.id_aluno,
        id_indicacao = data.id_indicacao,
        id_atividade = data.id_atividade,
    )

    db.add(inscricao)
    db.commit()
    db.refresh(inscricao)
    return inscricao
