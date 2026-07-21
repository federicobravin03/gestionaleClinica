import os
import jwt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITMO = "HS256"
DURATA_TOKEN = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def verificaPassword(password, passwordHash):
    return pwd_context.verify(password, passwordHash)

def creaToken(utente, ruolo):
    scadenza = datetime.now(timezone.utc) + timedelta(minutes=DURATA_TOKEN)

    dizionario = {
        "sub": str(utente),
        "ruolo": ruolo,
        "exp": scadenza
    }

    return jwt.encode(dizionario, SECRET_KEY, algorithm=ALGORITMO)

def verificaToken(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITMO])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Utente non autenticato")

def utenteCorrente(credenziali: HTTPAuthorizationCredentials = Depends(security)):
    token = credenziali.credentials
    
    return verificaToken(token)

def soloAdmin(utente = Depends(utenteCorrente)):
    if utente["ruolo"] != "Admin":
        raise HTTPException(status_code=403, detail="Operazione riservata agli amministratori")
    else:
        return utente
    
def richiediRuoli(*ruoliAmmessi):
    def controllo(utente = Depends(utenteCorrente)):
        if utente["ruolo"] not in ruoliAmmessi:
            raise HTTPException(status_code=403, detail="Utente non autorizzato")
        return utente
    return controllo