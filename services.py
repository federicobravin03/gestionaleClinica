from models import Paziente
from models import Medico
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
    
    def aggiorna(self, id, dati):
        paziente = self.cercaId(id)

        if paziente is None:
            raise HTTPException(status_code=404, detail="Paziente non trovato")

        campiDaAggiornare = dati.model_dump(exclude_unset=True)

        for campo, valore in campiDaAggiornare.items():
            setattr(paziente, campo, valore)

        self.db.commit()
        self.db.refresh(paziente)
        return paziente
    
    def elimina(self, id):
        paziente = self.cercaId(id)
        
        if paziente is None:
            raise HTTPException(status_code=404, detail="Paziente non trovato")
        
        self.db.delete(paziente)
        self.db.commit()
        return {"message": "Paziente eliminato con successo"}
    
class MedicoServices:
    def __init__(self, db):
        self.db = db
    
    def cercaNumeroAlbo(self, numeroAlbo):
        query = select(Medico).where(Medico.numeroAlbo == numeroAlbo)
        risultato = self.db.execute(query).scalar_one_or_none()
        return risultato
    
    def crea(self, dati):
        esisitente = self.cercaNumeroAlbo(dati.numeroAlbo)

        if esisitente is not None:
            raise HTTPException(status_code=409, detail="Medico già esistente")
        
        nuovoMedico = Medico(
            utente_id = dati.utente_id,
            numeroAlbo = dati.numeroAlbo,
            specializzazione = dati.specializzazione
        )

        self.db.add(nuovoMedico)
        self.db.commit()
        self.db.refresh(nuovoMedico)

        return nuovoMedico
    
    def leggiTutti(self):
        query = select(Medico)
        risultato = self.db.execute(query).scalars().all()
        return risultato
    
    def cercaId(self, id):
        query = select(Medico).where(Medico.id == id)
        risultato = self.db.execute(query).scalar_one_or_none()
        return risultato
    
    def aggiorna(self, id, dati):
        medico = self.cercaId(id)

        if medico is None:
            raise HTTPException(status_code=404, detail="Medico non trovato")
        
        campiDaAggiornare = dati.model_dump(exclude_unset=True)

        for campo, valore in campiDaAggiornare.items():
            setattr(medico, campo, valore)

        self.db.commit()
        self.db.refresh(medico)
        return medico
    
    def elimina(self, id):
        medico = self.cercaId(id)

        if medico is None:
            raise HTTPException(status_code=404, detail="Medico non trovato")
        
        self.db.delete(medico)
        self.db.commit()
        return{"message": "Medico eliminato con successo"}