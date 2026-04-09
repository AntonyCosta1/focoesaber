from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.aluno import Aluno
from app.models.frequencia import Frequencia
from app.models.inscricao import Inscricao

router = APIRouter(prefix="/relatorios", tags=["Relatórios"])

@router.get("/frequencia/{id_aluno}")
def relatorio_frequencia(id_aluno: int, db: Session = Depends(get_db)):
    inscricao = db.query(Inscricao).filter(Inscricao.id_aluno == id_aluno).first()
    if not inscricao:
        return {"msg": "Aluno não encontrado ou não inscrito em nenhuma atividade"}
    
    frequencias = db.query(Frequencia).filter(Frequencia.id_inscricao == inscricao.id_inscricao).all()

    total = len(frequencias)
    presentes = len([f for f in frequencias if f.presente])

    percentual = (presentes / total * 100) if total > 0 else 0

    return {
        "total_aulas": total,
        "presencas": presentes,
        "faltas": total - presentes,
        "percentual_presenca": round(percentual, 2)
    }

@router.get("/alunos-risco")
def alunos_em_risco(db: Session = Depends(get_db)):
    alunos = db.query(Aluno).all()
    resultado = []

    for aluno in alunos:
        inscricao = db.query(Inscricao).filter(Inscricao.id_aluno == aluno.id_aluno).first()
        if not inscricao:
            continue
        
        frequencias = db.query(Frequencia).filter(Frequencia.id_inscricao == inscricao.id_inscricao).all()

        total = len(frequencias)
        if total == 0:
            continue
        
        presentes = len([f for f in frequencias if f.presente])
        percentual = presentes / total * 100

        if percentual < 75:  # Considera risco se presença for menor que 75%
            resultado.append({
                "id_aluno": aluno.id_aluno,
                "nome": aluno.nome,
                "percentual": round(percentual, 2)
            })

    return resultado

@router.get("/status/{id_aluno}")
def status_aluno(id_aluno: int, db: Session = Depends(get_db)):
    inscricao = db.query(Inscricao).filter(Inscricao.id_aluno == id_aluno).first()
    if not inscricao:
        return {"Status": "Aluno não inscrito em nenhuma atividade"}
    
    frequencias = db.query(Frequencia).filter(Frequencia.id_inscricao == inscricao.id_inscricao).all()

    total = len(frequencias)
    if total == 0:
        return {"Status": "Sem registros de frequência"}
    
    presentes = len([f for f in frequencias if f.presente])
    percentual = presentes / total * 100

    if percentual >= 75:
        status = "Ativo"
    elif percentual >= 50:
        status = "Risco"
    else:
        status = "Critico"

    return {
        "id_aluno": id_aluno,
        "percentual" : round(percentual, 2),
        "status": status
    }