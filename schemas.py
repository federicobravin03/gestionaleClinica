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

class PazienteCreate(BaseModel):
    nome: str
    cognome: str
    codiceFiscale: str
    dataNascita: datetime.date
    telefono: str
    email: str | None
    indirizzo: str
    sesso: Sesso

class PazienteUpdate(BaseModel):
    nome: str | None = None
    cognome: str | None = None
    dataNascita: datetime.date | None = None
    telefono: str | None = None
    email: str | None = None
    indirizzo: str | None = None
    sesso: Sesso | None = None

class MedicoOut(BaseModel):
    id: int
    utente_id: int
    numeroAlbo: str
    specializzazione: str

    model_config = {"from_attributes": True}

class MedicoCreate(BaseModel):
    utente_id: int
    numeroAlbo: str
    specializzazione: str

class MedicoUpdate(BaseModel):
    numeroAlbo: str | None = None
    specializzazione: str | None = None