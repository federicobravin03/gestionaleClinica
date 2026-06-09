from fastapi import FastAPI, Depends
from database import Base, engine, get_db
from sqlalchemy.orm import Session
from sqlalchemy import select
from schemas import PazienteOut
import models

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "ciao mondo"}


Base.metadata.create_all(engine)

@app.get("/pazienti", response_model=list[PazienteOut])
async def leggiPazienti(db: Session = Depends(get_db)):
    query = select(models.Paziente)
    risultato = db.execute(query).scalars().all()
    return risultato