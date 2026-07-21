from models import Paziente
from models import Medico
from models import Utente
from models import Appuntamento
from models import StatoAppuntamento
from models import Utente
from sqlalchemy import select
from fastapi import HTTPException
from auth import pwd_context

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
    
    def cercaUtenteId(self, utente_id):
        query = select(Medico).where(Medico.utente_id == utente_id)
        risultato = self.db.execute(query).scalar_one_or_none()
        return risultato
    
    def leggiPerMedico(self, medico_id):
        query = select(Appuntamento).where(Appuntamento.medico_id == medico_id)
        risultato = self.db.execute(query).scalars().all()
        return risultato
    
    def crea(self, dati):
        esistente = self.cercaNumeroAlbo(dati.numeroAlbo)

        if esistente is not None:
            raise HTTPException(status_code=409, detail="Medico già esistente")
        
        utente = UtenteServices(self.db).cercaId(dati.utente_id)

        if utente is None:
            raise HTTPException(status_code=404, detail="Utente non trovato")
        
        if self.cercaUtenteId(dati.utente_id) is not None:
            raise HTTPException(status_code=409, detail="Utente già associato a un medico")
        
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
    
class UtenteServices:
    def __init__(self, db):
        self.db = db
    
    def cercaCodiceFiscale(self, codiceFiscale):
        query = select(Utente).where(Utente.codiceFiscale == codiceFiscale)
        risultato = self.db.execute(query).scalar_one_or_none()
        return risultato
    
    def cercaUsername(self, username):
        query = select(Utente).where(Utente.username == username)
        risultato = self.db.execute(query).scalar_one_or_none()
        return risultato

    def crea(self, dati):
        esistente = self.cercaCodiceFiscale(dati.codiceFiscale)

        if esistente is not None:
            raise HTTPException(status_code=409, detail="Utente già esistente")
        
        nuovoUtente = Utente(
            nome = dati.nome,
            cognome = dati.cognome,
            codiceFiscale = dati.codiceFiscale,
            ruolo = dati.ruolo,
            telefono = dati.telefono,
            email = dati.email,
            username = dati.username,
            passwordHash = pwd_context.hash(dati.password)
        )

        self.db.add(nuovoUtente)
        self.db.commit()
        self.db.refresh(nuovoUtente)

        return nuovoUtente
    
    def leggiTutti(self):
        query = select(Utente)
        risulato = self.db.execute(query).scalars().all()
        return risulato
    
    def cercaId(self, id):
        query = select(Utente).where(Utente.id == id)
        risultato = self.db.execute(query).scalar_one_or_none()
        return risultato
    
    def aggiorna(self, id, dati):
        utente = self.cercaId(id)

        if utente is None:
            raise HTTPException(status_code=404, detail="Utente non trovato")
        
        campiDaAggiornare = dati.model_dump(exclude_unset=True)

        for campo, valore in campiDaAggiornare.items():
            setattr(utente, campo, valore)

        self.db.commit()
        self.db.refresh(utente)
        return utente
    
    def elimina(self, id):
        utente = self.cercaId(id)
        
        if utente is None:
            raise HTTPException(status_code=404, detail="Utente non trovato")
        
        self.db.delete(utente)
        self.db.commit()
        return{"message": "Utente elimnato con successo"}
    
class AppuntamentoServices:
    def __init__(self, db):
        self.db = db

    def cercaId(self, id):
        query = select(Appuntamento).where(Appuntamento.id == id)
        risultato = self.db.execute(query).scalar_one_or_none()
        return risultato
    
    def cercaMedicoEOra(self, medico_id, dataOra):
        query = select(Appuntamento).where(
            Appuntamento.medico_id == medico_id,
            Appuntamento.dataOra == dataOra
        )
        
        risulato = self.db.execute(query).scalar_one_or_none()
        return risulato
    
    def crea(self, dati):
        occupato = self.cercaMedicoEOra(dati.medico_id, dati.dataOra)

        if occupato is not None:
            raise HTTPException(status_code=409, detail="Il medico ha già un appuntamento in questo orario")

        nuovoAppuntamento = Appuntamento(
            dataOra = dati.dataOra,
            paziente_id = dati.paziente_id,
            medico_id = dati.medico_id
        )

        self.db.add(nuovoAppuntamento)
        self.db.commit()
        self.db.refresh(nuovoAppuntamento)

        return nuovoAppuntamento
    
    def leggiTutti(self):
        query = select(Appuntamento)
        risultato = self.db.execute(query).scalars().all()
        return risultato
    
    def aggiorna(self, id, dati):
        appuntamento = self.cercaId(id)

        if appuntamento is None:
            raise HTTPException(status_code=404, detail="Appuntamento non trovato")
        
        campiDaAggiornare = dati.model_dump(exclude_unset=True)

        for campo, valore in campiDaAggiornare.items():
            setattr(appuntamento, campo, valore)

        self.db.commit()
        self.db.refresh(appuntamento)
        return appuntamento
    
    def elimina(self, id):
        appuntamento = self.cercaId(id)

        if appuntamento is None:
            raise HTTPException(status_code=404, detail="Appuntamento non trovato")
        
        self.db.delete(appuntamento)
        self.db.commit()
        return{"message": "Appuntamento eliminato con successo"}
    
    def annulla(self, id):
        appuntamento = self.cercaId(id)

        if appuntamento is None:
            raise HTTPException(status_code=404, detail="Appuntamento non trovato")

        if appuntamento.stato != StatoAppuntamento.PROGRAMMATO:
            raise HTTPException(status_code=409, detail="L'appuntamento non può essere annullato")
        
        appuntamento.stato = StatoAppuntamento.ANNULLATO
        
        self.db.commit()
        self.db.refresh(appuntamento)
        return appuntamento

    def inizia(self, id):
        appuntamento = self.cercaId(id)

        if appuntamento is None:
            raise HTTPException(status_code=404, detail="Appuntamento non trovato")
        
        if appuntamento.stato != StatoAppuntamento.PROGRAMMATO:
            raise HTTPException(status_code=409, detail="L'appuntamento non può essere iniziato")
        
        appuntamento.stato = StatoAppuntamento.INCORSO

        self.db.commit()
        self.db.refresh(appuntamento)
        return appuntamento

    def concludi(self, id, dati):
        appuntamento = self.cercaId(id)

        if appuntamento is None:
            raise HTTPException(status_code=404, detail="Appuntamento non trovato")
        
        if appuntamento.stato != StatoAppuntamento.INCORSO:
            raise HTTPException(status_code=409, detail="L'appuntamento non può essere concluso")

        appuntamento.stato = StatoAppuntamento.CONCLUSO
        appuntamento.prezzo = dati.prezzo
        appuntamento.esito = dati.esito

        self.db.commit()
        self.db.refresh(appuntamento)   
        return appuntamento