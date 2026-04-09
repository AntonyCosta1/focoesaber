from fastapi import FastAPI
from app.database import engine, Base

from app.models.aluno import Aluno
from app.models.escola import Escola
from app.models.user import User
from app.models.indicacao import Indicacao
from app.models.historico_aprovacao import HistoricoAprovacao
from app.models.atividade import Atividade
from app.models.inscricao import Inscricao
from app.models.frequencia import Frequencia
from app.models.desempenho import Desempenho

from app.routes.user import router as user_router
from app.routes.auth import router as auth_router
from app.routes.escola import router as escola_router
from app.routes.aluno import router as aluno_router
from app.routes.indicacao import router as indicacao_router
from app.routes.inscricao import router as inscricao_router
from app.routes.atividade import router as atividade_router
from app.routes.frequencia import router as frequencia_router
from app.routes.desempenho import router as desempenho_router
from app.routes.progresso import router as progresso_router
from app.routes.relatorios import router as relatorios_router



app = FastAPI()
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(escola_router)
app.include_router(aluno_router)
app.include_router(indicacao_router)
app.include_router(inscricao_router)
app.include_router(atividade_router)
app.include_router(frequencia_router)
app.include_router(desempenho_router)
app.include_router(progresso_router)
app.include_router(relatorios_router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"msg": "API Foco é saber rodando"}