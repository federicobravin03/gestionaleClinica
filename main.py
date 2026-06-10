from fastapi import FastAPI, Depends
from database import Base, engine, get_db
from sqlalchemy.orm import Session
from schemas import PazienteOut
from schemas import PazienteCreate
from services import PazienteServices

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "ciao mondo"}


Base.metadata.create_all(engine)

@app.get("/pazienti", response_model=list[PazienteOut])
async def leggiPazienti(db: Session = Depends(get_db)):
    service = PazienteServices(db)
    listaPazienti = service.leggiTutti()
    return listaPazienti

@app.post("/pazienti", response_model=PazienteOut, status_code=201)
async def creaPazienti(dati: PazienteCreate, db: Session = Depends(get_db)):
    service = PazienteServices(db)
    nuovoPaziente = service.crea(dati)
    return nuovoPaziente
