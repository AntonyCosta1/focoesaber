from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.frequencia import Frequencia
from app.models.inscricao import Inscricao
from app.dependencies.auth import get_current_user, exigir_perfil
from app.models.user import User

from app.schemas.frequencia import CriarFrequencia, FrequenciaResponse

router = APIRouter(prefix="/frequencias", tags=["frequencias"])

@router.post("/", response_model=FrequenciaResponse)
def criar_frequencia(
    data: CriarFrequencia, 
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(exigir_perfil("admin","professor"))
    ):

    if usuario_atual.tipo_usuario == "professor":
        # Verificar se o professor está associado à inscrição
        inscricao_professor = db.query(Inscricao).filter(
            Inscricao.id_inscricao == data.id_inscricao,
            Inscricao.id_professor == usuario_atual.id_usuario
        ).first()
        if not inscricao_professor:
            raise HTTPException(status_code=403, detail="Professor não associado a esta inscrição")
        
    inscricao = db.query(Inscricao).filter(Inscricao.id_inscricao == data.id_inscricao).first()
    if not inscricao:
        raise HTTPException(status_code=404, detail="Inscrição não encontrada")
    
    if data.tipo_aula not in ["reforco", "recreativa"]:
        raise HTTPException(status_code=400, detail="Tipo de aula inválido")
    
    frequencia = Frequencia(
        id_inscricao = data.id_inscricao,
        data_aula = data.data_aula,
        tipo_aula = data.tipo_aula,
        presente = data.presente
    )
    db.add(frequencia)
    db.commit()
    db.refresh(frequencia)
    return frequencia

@router.get("/", response_model=list[FrequenciaResponse])
def listar_frequencias(
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(exigir_perfil("admin","professor"))
    ):
    return db.query(Frequencia).all()
