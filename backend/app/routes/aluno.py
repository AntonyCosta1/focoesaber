from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.aluno import Aluno
from app.models.user import User
from app.models.escola import Escola
from app.schemas.aluno import CriarAluno, AlunoResponse

router = APIRouter(prefix="/alunos", tags=["Alunos"])

@router.post("/", response_model=AlunoResponse)
def criar_aluno(data: CriarAluno, db: Session = Depends(get_db)):
    responsavel = db.query(User).filter(User.id_usuario == data.id_responsavel).first()
    if not responsavel:
        raise HTTPException(status_code=404, detail="Responsável não encontrado")

    aluno = Aluno(**data.dict())

    db.add(aluno)
    db.commit()
    db.refresh(aluno)

    return aluno

@router.get("/", response_model=list[AlunoResponse])
def listar_alunos(db: Session = Depends(get_db)):
    return db.query(Aluno).all()