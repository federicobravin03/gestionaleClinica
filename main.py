from fastapi import FastAPI, Depends, HTTPException
from database import Base, engine, get_db
from sqlalchemy.orm import Session
from schemas import PazienteOut, PazienteCreate, PazienteUpdate
from schemas import MedicoOut, MedicoCreate, MedicoUpdate
from schemas import UtenteOut, UtenteCreate, UtenteUpdate
from schemas import AppuntamentoOut, AppuntamentoCreate, AppuntamentoUpdate
from services import PazienteServices
from services import MedicoServices
from services import UtenteServices
from services import AppuntamentoServices

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

@app.get("/utenti", response_model=list[UtenteOut])
async def leggiUtenti(db: Session = Depends(get_db)):
    service = UtenteServices(db)
    listaUtenti = service.leggiTutti()
    return listaUtenti

@app.post("/utenti", response_model=UtenteOut, status_code=201)
async def creaUtente(dati: UtenteCreate, db: Session = Depends(get_db)):
    service = UtenteServices(db)
    nuovoUtente = service.crea(dati)
    return nuovoUtente

@app.get("/utenti/{id}", response_model=UtenteOut)
async def cercaUtenteId(id: int, db: Session = Depends(get_db)):
    service = UtenteServices(db)
    utente = service.cercaId(id)
    if utente is None:
        raise HTTPException(status_code=404 ,detail="Utente non trovato")
    return  utente

@app.patch("/utenti/{id}", response_model=UtenteOut)
async def aggiornaUtente(id: int, dati: UtenteUpdate, db: Session = Depends(get_db)):
    service = UtenteServices(db)
    utenteAggiornato = service.aggiorna(id, dati)
    return utenteAggiornato

@app.delete("/utenti/{id}")
async def eliminaUtente(id: int, db: Session = Depends(get_db)):
    service = UtenteServices(db)
    utenteEliminato = service.elimina(id)
    return utenteEliminato

@app.get("/appuntamenti", response_model=list[AppuntamentoOut])
async def leggiAppuntamenti(db: Session = Depends(get_db)):
    service = AppuntamentoServices(db)
    listaAppuntamenti = service.leggiTutti()
    return listaAppuntamenti

@app.post("/appuntamenti", response_model=AppuntamentoOut, status_code=201)
async def creaAppuntamento(dati: AppuntamentoCreate, db: Session = Depends(get_db)):
    service = AppuntamentoServices(db)
    nuovoAppuntamento = service.crea(dati)
    return nuovoAppuntamento

@app.get("/appuntamenti/{id}", response_model=AppuntamentoOut)
async def cercaAppuntamentoId(id: int, db: Session = Depends(get_db)):
    service = AppuntamentoServices(db)
    appuntamento = service.cercaId(id)
    if appuntamento is None:
        raise HTTPException(status_code=404, detail="Appuntamento non trovato")
    return appuntamento

@app.patch("/appuntamenti/{id}", response_model=AppuntamentoOut)
async def aggiornaAppuntamento(id: int, dati: AppuntamentoUpdate, db: Session = Depends(get_db)):
    service = AppuntamentoServices(db)
    appuntamentoAggiornato = service.aggiorna(id, dati)
    return appuntamentoAggiornato

@app.delete("/appuntamenti/{id}")
async def eliminaAppuntamento(id: int, db: Session = Depends(get_db)):
    service = AppuntamentoServices(db)
    appuntamentoEliminato = service.elimina(id)
    return appuntamentoEliminato