from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.atividade import Atividade
from app.models.escola import Escola

from app.schemas.atividade import CriarAtividade, AtividadeResponse
from app.dependencies.auth import exigir_perfil, get_current_user
from app.models.user import User

router = APIRouter(prefix="/atividades", tags=["Atividades"])

@router.post("/", response_model=AtividadeResponse)
def criar_atividade(
    data: CriarAtividade, 
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(exigir_perfil("admin"))
    ):
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

@router.delete("/{id_atividade}")
def excluir_atividade(
    id_atividade: int, 
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(exigir_perfil("admin"))
    ):
    atividade = db.query(Atividade).filter(Atividade.id_atividade == id_atividade).first()

    if not atividade:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    
    db.delete(atividade)
    db.commit()

    return {"message": "Atividade excluida com sucesso"}

@router.get("/", response_model=list[AtividadeResponse])
def listar_atividades(
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_user)
):
    return db.query(Atividade).all()

@router.put("/{id_atividade}", response_model=AtividadeResponse)
def editar_atividade(
    id_atividade: int,
    data: CriarAtividade,
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(exigir_perfil("admin"))
):
    atividade = db.query(Atividade).filter(
        Atividade.id_atividade == id_atividade
    ).first()

    if not atividade:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")

    atividade.nome = data.nome
    atividade.descricao = data.descricao
    atividade.id_escola = data.id_escola

    db.commit()
    db.refresh(atividade)

    return atividade