# Gestionale Clinica

È un'app full-stack API-based che permette la gestione di pazienti, medici, appuntamenti e visite

## Tecnologie
- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic

## Requisiti
- Python
- PostgreSQL

## Installazione e avvio
- Clonare, creare e attivare ambiente virtuale
- Installare le dipendenze con `pip install -r requirements.txt`
- Creare un file .env nella cartella del progetto, contenente la variabile DATABASE_URL con la stringa di connessione al proprio database PostgreSQL. Esempio: `DATABASE_URL=postgresql://utente:password@localhost:5432/gestionale_clinica`
- Avviare con `fastapi dev main.py`