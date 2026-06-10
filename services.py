from models import Paziente

class PazienteServices:
    def __init__(self, db):
        self.db = db

    def crea(self, dati):
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