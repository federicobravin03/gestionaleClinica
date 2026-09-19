from database import SessionLocal
from services import UtenteServices
from schemas import UtenteCreate

NOME = "Mario"
COGNOME = "Rossi"
CODICE_FISCALE = "RSSMRA80A01H501U"
TELEFONO = "3401234567"
EMAIL = "mario.rossi@poliambulatorio.it"
PASSWORD = "ciao123"
RUOLO = "Admin"


def main():
    db = SessionLocal()
    try:
        service = UtenteServices(db)

        for utente in service.leggiTutti():
            if utente.ruolo.value == RUOLO:
                print("Esiste già un amministratore. Nessuna operazione eseguita.")
                return

        dati = UtenteCreate(
            nome=NOME,
            cognome=COGNOME,
            codiceFiscale=CODICE_FISCALE,
            ruolo=RUOLO,
            telefono=TELEFONO,
            email=EMAIL,
            password=PASSWORD
        )
        creato = service.crea(dati)

        print("Amministratore creato correttamente.")
        print("  Nome utente: " + creato.username)
        print("  Password:    " + PASSWORD)

    finally:
        db.close()


if __name__ == "__main__":
    main()