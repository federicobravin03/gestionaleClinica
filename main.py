from fastapi import FastAPI, Depends, HTTPException
from database import Base, engine, get_db
from sqlalchemy.orm import Session
from schemas import PazienteOut
from schemas import PazienteCreate
from schemas import PazienteUpdate
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

@app.get("/pazienti/{id}", response_model=PazienteOut)
async def cercaId(id: int, db: Session = Depends(get_db)):
    service = PazienteServices(db)
    pazientePerId = service.cercaId(id)
    if pazientePerId is None:
        raise HTTPException(status_code=404, detail="Paziente non trovato")
    return pazientePerId

@app.patch("/pazienti/{id}", response_model=PazienteOut)
async def aggiornaPaziente(id: int, dati: PazienteUpdate, db: Session = Depends(get_db)):
    service = PazienteServices(db)
    pazienteAggioranto = service.aggiorna(id, dati)
    return pazienteAggioranto

@app.delete("/pazienti/{id}")
async def eliminaPaziente(id: int, db: Session = Depends(get_db)):
    service = PazienteServices(db)
    pazienteEliminato = service.elimina(id)
    return pazienteEliminato