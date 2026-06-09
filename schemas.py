from pydantic import BaseModel 
import datetime
from models import Sesso

class PazienteOut(BaseModel):
    id: int
    nome: str
    cognome: str
    codiceFiscale: str
    dataNascita: datetime.date
    telefono: str
    email: str | None
    indirizzo: str
    sesso: Sesso

    model_config = {"from_attributes": True}