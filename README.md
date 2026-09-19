# Gestionale Poliambulatorio

Applicazione full-stack API-based per la gestione di un poliambulatorio:
anagrafiche dei pazienti, personale medico, prenotazione delle visite e
registrazione degli esiti, con accesso differenziato per ruolo
(amministratore, segreteria, medico).

Progetto realizzato come Project Work per il corso di laurea in
Informatica per le Aziende Digitali (L-31).

## Tecnologie

**Backend:** Python, FastAPI, SQLAlchemy, Pydantic, PostgreSQL, PyJWT, passlib/bcrypt
**Frontend:** React, Vite, Chart.js

## Requisiti

- Python 3.11 o superiore
- Node.js 18 o superiore
- PostgreSQL 14 o superiore

## Installazione

### 1. Clonazione del repository

git clone https://github.com/federicobravin03/gestionaleClinica.git
cd gestionaleClinica

### 2. Ambiente virtuale

Windows:

python -m venv venv
venv\Scripts\activate

Linux / macOS:

python3 -m venv venv
source venv/bin/activate

### 3. Dipendenze del backend

pip install -r requirements.txt

### 4. Base di dati

Creare un database PostgreSQL vuoto:

CREATE DATABASE gestionale_clinica;

### 5. Variabili d'ambiente

Creare un file `.env` nella cartella principale del progetto, copiando
`.env.example`, e valorizzare le due variabili:

DATABASE_URL=postgresql://utente:password@localhost:5432/gestionale_clinica
SECRET_KEY=una-stringa-lunga-e-casuale

`SECRET_KEY` è la chiave con cui vengono firmati i token di
autenticazione: va scelta diversa per ogni installazione.

### 6. Avvio del backend

fastapi dev main.py

Il server risponde su http://localhost:8000
La documentazione Swagger è disponibile su http://localhost:8000/docs

### 7. Dati iniziali

Le tabelle vengono create al primo avvio del backend: eseguire quindi
questo passaggio dopo aver avviato il server almeno una volta.

Creare l'utente amministratore iniziale:

python crea_admin.py

Lo script verifica che non esista già un amministratore e, in caso
contrario, ne crea uno stampando a video le credenziali generate.
Non opera attraverso l'API, ma richiama direttamente il livello dei
servizi: i controlli di autorizzazione risiedono infatti sugli
endpoint, e questo consente di inizializzare il sistema quando ancora
nessun utente può autenticarsi.

Successivamente, per popolare il sistema con dati di prova
(pazienti, medici e appuntamenti in vari stati):

python popola_dati.py
python popola_storico.py

### 8. Frontend

cd frontend
npm install
npm run dev

L'interfaccia è raggiungibile su http://localhost:5173

## Credenziali di prova

| Ruolo          | Nome utente | Password |
| -------------- | ----------- | -------- |
| Amministratore | mario.rossi | ciao123  |

Credenziali dimostrative, valide solo sull'installazione locale con i
dati di prova.

## Struttura del progetto

gestionaleClinica/
├── main.py           endpoint dell'API
├── services.py       logica applicativa
├── models.py         modelli dei dati (SQLAlchemy)
├── schemas.py        schemi di validazione (Pydantic)
├── auth.py           autenticazione e autorizzazione
├── database.py       connessione al database
├── popola_dati.py    script di popolamento
└── frontend/
    └── src/
        ├── App.jsx
        └── components/

## Note e limiti

- L'invio delle e-mail di conferma è simulato tramite log sul server.
- Le modifiche allo schema del database richiedono la ricreazione delle
  tabelle: non è presente uno strumento di migrazione.
- Gli elenchi caricano tutti i record senza impaginazione, soluzione
  adeguata ai volumi previsti ma non a insiemi di dati estesi.