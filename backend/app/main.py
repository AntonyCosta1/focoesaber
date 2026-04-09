from fastapi import FastAPI
from app.database import engine, Base

from app.models.aluno import Aluno
from app.models.escola import Escola
from app.models.user import User
from app.models.indicacao import Indicacao
from app.models.historico_aprovacao import HistoricoAprovacao

from app.routes.user import router as user_router
from app.routes.auth import router as auth_router
from app.routes.escola import router as escola_router
from app.routes.aluno import router as aluno_router
from app.routes.indicacao import router as indicacao_router


app = FastAPI()
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(escola_router)
app.include_router(aluno_router)
app.include_router(indicacao_router)
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"msg": "API Foco é saber rodando"}