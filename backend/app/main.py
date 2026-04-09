from fastapi import FastAPI
from app.database import engine, Base

from app.models.aluno import Aluno
from app.models.escola import Escola
from app.models.user import User

from app.routes.user import router as user_router
from app.routes.auth import router as auth_router

app = FastAPI()
app.include_router(user_router)
app.include_router(auth_router)
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"msg": "API Foco é saber rodando"}