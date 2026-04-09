from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.aluno import Aluno
from app.models.inscricao import Inscricao
from app.models.frequencia import Frequencia
from app.models.desempenho import Desempenho

router = APIRouter(prefix="/progresso", tags=["Progresso"])


@router.get("/aluno/{id_aluno}")
def consultar_progresso_aluno(id_aluno: int, db: Session = Depends(get_db)):
    aluno = db.query(Aluno).filter(Aluno.id_aluno == id_aluno).first()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")

    inscricao = db.query(Inscricao).filter(Inscricao.id_aluno == id_aluno).first()
    if not inscricao:
        raise HTTPException(status_code=404, detail="Aluno não possui inscrição no projeto")

    frequencias = db.query(Frequencia).filter(
        Frequencia.id_inscricao == inscricao.id_inscricao
    ).all()

    desempenhos = db.query(Desempenho).filter(
        Desempenho.id_inscricao == inscricao.id_inscricao
    ).all()

    return {
        "aluno": {
            "id_aluno": aluno.id_aluno,
            "nome": aluno.nome,
            "matricula": aluno.matricula,
            "id_escola": aluno.id_escola,
            "id_responsavel": aluno.id_responsavel
        },
        "inscricao": {
            "id_inscricao": inscricao.id_inscricao,
            "id_atividade": inscricao.id_atividade,
            "status_inscricao": inscricao.status_inscricao
        },
        "frequencias": [
            {
                "id_frequencia": f.id_frequencia,
                "data_aula": f.data_aula,
                "tipo_aula": f.tipo_aula,
                "presente": f.presente
            }
            for f in frequencias
        ],
        "desempenhos": [
            {
                "id_desempenho": d.id_desempenho,
                "data_registro": d.data_registro,
                "descricao": d.descricao,
                "observacao": d.observacao,
                "validado": d.validado
            }
            for d in desempenhos
        ]
    }