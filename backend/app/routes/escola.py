from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.escola import Escola
from app.schemas.escola import CriarEscola, EscolaResponse

router = APIRouter(prefix="/escolas", tags=["Escolas"])

@router.post("/", response_model=EscolaResponse)
def criar_escola(data: CriarEscola, db: Session = Depends(get_db)):
    escola = Escola(**data.dict())
    db.add(escola)
    db.commit()
    db.refresh(escola)
    return escola

@router.get("/", response_model=list[EscolaResponse])
def listar_escolas(db: Session = Depends(get_db)):
    return db.query(Escola).all()