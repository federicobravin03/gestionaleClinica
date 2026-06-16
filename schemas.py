from pydantic import BaseModel, EmailStr
import datetime
from models import Sesso, Ruolo

class PazienteOut(BaseModel):
    id: int
    nome: str
    cognome: str
    codiceFiscale: str
    dataNascita: datetime.date
    telefono: str
    email: str | None
    indirizzo: EmailStr
    sesso: Sesso

    model_config = {"from_attributes": True}

class PazienteCreate(BaseModel):
    nome: str
    cognome: str
    codiceFiscale: str
    dataNascita: datetime.date
    telefono: str
    email: EmailStr | None
    indirizzo: str
    sesso: Sesso

class PazienteUpdate(BaseModel):
    nome: str | None = None
    cognome: str | None = None
    dataNascita: datetime.date | None = None
    telefono: str | None = None
    email: EmailStr | None = None
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

class UtenteOut(BaseModel):
    id: int
    nome: str
    cognome: str
    codiceFiscale: str
    ruolo: Ruolo
    telefono: str
    username: str
    email: EmailStr

    model_config = {"from_attributes": True}

class UtenteCreate(BaseModel):
    nome: str
    cognome: str
    codiceFiscale: str
    ruolo: Ruolo
    telefono: str
    username: str
    email: EmailStr
    password: str

class UtenteUpdate(BaseModel):
    nome: str | None = None
    cognome: str | None = None
    ruolo: Ruolo | None = None
    telefono: str | None = None
    username: str | None = None
    email: EmailStr | None = None