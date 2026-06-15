from fastapi import FastAPI, Depends, HTTPException
from database import Base, engine, get_db
from sqlalchemy.orm import Session
from schemas import PazienteOut
from schemas import PazienteCreate
from schemas import PazienteUpdate
from schemas import MedicoOut
from schemas import MedicoCreate
from schemas import MedicoUpdate
from services import PazienteServices
from services import MedicoServices

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

@app.get("/medici", response_model=list[MedicoOut])
async def leggiMedici(db: Session = Depends(get_db)):
    service = MedicoServices(db)
    listaMedici = service.leggiTutti()
    return listaMedici

@app.post("/medici", response_model=MedicoOut, status_code=201)
async def creaMedici(dati: MedicoCreate, db: Session = Depends(get_db)):
    service = MedicoServices(db)
    nuovoMedico = service.crea(dati)
    return nuovoMedico

@app.get("/medici/{id}", response_model=MedicoOut)
async def cercaMedicoId(id: int, db: Session = Depends(get_db)):
    service = MedicoServices(db)
    medico = service.cercaId(id)
    if medico is None:
        raise HTTPException(status_code=404, detail="Medico non trovato")
    return medico

@app.patch("/medici/{id}", response_model=MedicoOut)
async def aggiornaMedico(id: int, dati: MedicoUpdate, db: Session = Depends(get_db)):
    service = MedicoServices(db)
    medicoAggiornato = service.aggiorna(id, dati)
    return medicoAggiornato

@app.delete("/medici/{id}")
async def eliminaMedico(id: int, db: Session = Depends(get_db)):
    service = MedicoServices(db)
    medicoEliminato = service.elimina(id)
    return medicoEliminato