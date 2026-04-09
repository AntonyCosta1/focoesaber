from pydantic import BaseModel
from datetime import datetime

class RespostaIndicacaoRequest(BaseModel):
    id_responsavel: int
    observacao: str | None = None

class HistoricoAprovacaoResponse(BaseModel):
    id_historico: int
    id_indicacao: int
    id_responsavel: int
    data_resposta: datetime
    status_resposta: str
    observacao: str | None

    class Config:
        from_attributes = True