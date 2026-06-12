from models import Paziente
from sqlalchemy import select
from fastapi import HTTPException

class PazienteServices:
    def __init__(self, db):
        self.db = db

    def crea(self, dati):
        esistente = self.cercaCodiceFiscale(dati.codiceFiscale)
        
        if esistente is not None:
            raise HTTPException(status_code=409, detail="Il codice fiscale è gia presente")
        
        nuovoPaziente = Paziente(
            nome = dati.nome,
            cognome = dati.cognome,
            codiceFiscale = dati.codiceFiscale,
            dataNascita = dati.dataNascita,
            telefono = dati.telefono,
            email = dati.email,
            indirizzo = dati.indirizzo,
            sesso = dati.sesso
        )

        self.db.add(nuovoPaziente)
        self.db.commit()
        self.db.refresh(nuovoPaziente)

        return nuovoPaziente
    
    def leggiTutti(self):
        query = select(Paziente)
        risultato = self.db.execute(query).scalars().all()
        return risultato
    
    def cercaCodiceFiscale(self, codiceFiscale):
        query = select(Paziente).where(Paziente.codiceFiscale == codiceFiscale)
        risultato = self.db.execute(query).scalar_one_or_none()
        return risultato
    
    def cercaId(self, id):
        query = select(Paziente).where(Paziente.id == id)
        risultato = self.db.execute(query).scalar_one_or_none()
        return risultato