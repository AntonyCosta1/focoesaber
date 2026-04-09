from pydantic import BaseModel
from datetime import date

class CriarFrequencia(BaseModel):
    id_inscricao: int
    data_aula: date
    tipo_aula: str
    presente: bool

class FrequenciaResponse(BaseModel):
    id_frequencia: int
    id_inscricao: int
    data_aula: date
    tipo_aula: str
    presente: bool

    class Config:
        from_attributes = True