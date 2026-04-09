from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db

from app.models.aluno import Aluno
from app.models.user import User
from app.models.indicacao import Indicacao
from app.models.historico_aprovacao import HistoricoAprovacao

from app.schemas.indicacao import CriarIndicacao, IndicacaoResponse
from app.schemas.historico_aprovacao import (
    RespostaIndicacaoRequest,
    HistoricoAprovacaoResponse
)


router = APIRouter(prefix="/indicacoes", tags=["Indicações"])

@router.post("/", response_model=IndicacaoResponse)
def criar_indicacao(data: CriarIndicacao, db: Session = Depends(get_db)):
    aluno = db.query(Aluno).filter(Aluno.id_aluno == data.id_aluno).first()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    professor = db.query(User).filter(User.id_usuario == data.id_professor).first()
    if not professor:
        raise HTTPException(status_code=404, detail="Professor não encontrado")
    
    if professor.tipo_usuario != "professor":
        raise HTTPException(status_code=400, detail="Usuário não é um professor")
    
    if not aluno.matriculado_ativo:
        raise HTTPException(status_code=400, detail="Aluno não está ativo para indicação")
    
    indicacao = Indicacao(
        id_aluno = data.id_aluno,
        id_professor = data.id_professor,
        observacao = data.observacao,
        status_aprovacao = "pendente"
    )


    db.add(indicacao)
    db.commit()
    db.refresh(indicacao)
    return indicacao

@router.get("/", response_model=list[IndicacaoResponse])
def listar_indicacoes(db: Session = Depends(get_db)):
    return db.query(Indicacao).all()
    
@router.put("/{id_indicacao}/aprovar", response_model=HistoricoAprovacaoResponse)
def aprovar_indicacao(
    id_indicacao: int,
    data: RespostaIndicacaoRequest,
    db: Session = Depends(get_db)
):
    indicacao = db.query(Indicacao).filter(Indicacao.id_indicacao == id_indicacao).first()
    if not indicacao:
        raise HTTPException(status_code=404, detail="Indicação não encontrada")
    
    responsavel = db.query(User).filter(User.id_usuario == data.id_responsavel).first()
    if not responsavel:
        raise HTTPException(status_code=404, detail="Responsável não encontrado")
    
    if responsavel.tipo_usuario != "responsavel":
        raise HTTPException(status_code=400, detail="Usuário não é um responsável")
    
    indicacao.status_aprovacao = "aprovado"

    historico = HistoricoAprovacao(
        id_indicacao = id_indicacao,
        id_responsavel = data.id_responsavel,
        status_resposta = "aprovado",
        observacao = data.observacao
    )

    db.add(historico)
    db.commit()
    db.refresh(historico)

    return historico

@router.put("/{id_indicacao}/recusar", response_model=HistoricoAprovacaoResponse)
def recusar_indicacao(
    id_indicacao: int,
    data: RespostaIndicacaoRequest,
    db: Session = Depends(get_db)
):
    indicacao = db.query(Indicacao).filter(Indicacao.id_indicacao == id_indicacao).first()
    if not indicacao:
        raise HTTPException(status_code=404, detail="Indicação não encontrada")

    responsavel = db.query(User).filter(User.id_usuario == data.id_responsavel).first()
    if not responsavel:
        raise HTTPException(status_code=404, detail="Responsável não encontrado")

    if responsavel.tipo_usuario != "responsavel":
        raise HTTPException(status_code=400, detail="Usuário não é um responsável")

    indicacao.status_aprovacao = "recusado"

    historico = HistoricoAprovacao(
        id_indicacao = id_indicacao,
        id_responsavel = data.id_responsavel,
        status_resposta = "recusado",
        observacao = data.observacao
    )

    db.add(historico)
    db.commit()
    db.refresh(historico)

    return historico
