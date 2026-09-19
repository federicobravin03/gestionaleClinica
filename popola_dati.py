"""
Popolamento del sistema con dati di prova.

Lo script opera attraverso le API dell'applicazione, quindi richiede
che il server sia avviato (http://localhost:8000) e che esista gia'
l'utente amministratore creato da crea_admin.py.

Uso:  python popola_dati.py
"""

import requests
from datetime import datetime, timedelta

BASE = "http://localhost:8000"
ADMIN_USERNAME = "mario.rossi"
ADMIN_PASSWORD = "ciao123"


def login():
    risposta = requests.post(BASE + "/login", json={
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    })
    if not risposta.ok:
        print("Login fallito:", risposta.status_code, risposta.text)
        return None
    return risposta.json()["access_token"]


def intestazioni(token):
    return {"Authorization": "Bearer " + token}


MEDICI = [
    ("Elena",   "Moretti",  "MRTLNE85M41H501K", "Dermatologia",      "M001"),
    ("Paolo",   "Serra",    "SRRPLA78B12F205X", "Ortopedia",         "M002"),
    ("Luca",    "Bianchi",  "BNCLCU80C15L219R", "Cardiologia",       "M003"),
    ("Giulia",  "Ricci",    "RCCGLI82D55H501T", "Ginecologia",       "M004"),
    ("Andrea",  "Costa",    "CSTNDR75E20A662P", "Oculistica",        "M005"),
    ("Chiara",  "Fabbri",   "FBBCHR88F60D612N", "Medicina generale", "M006"),
]

PAZIENTI = [
    ("Laura",     "Fontana",  "FNTLRA90A41H501Z", "1990-01-01", "F", "3401110001", "laura.fontana@example.it",    "Via Roma 1, Udine"),
    ("Stefano",   "Rizzo",    "RZZSFN85B12F205Y", "1985-02-12", "M", "3401110002", "stefano.rizzo@example.it",    "Via Verdi 14, Udine"),
    ("Roberto",   "Esposito", "SPSRRT72C03L219W", "1972-03-03", "M", "3401110003", "roberto.esposito@example.it", "Via Dante 8, Udine"),
    ("Francesca", "Greco",    "GRCFNC95D45H501Q", "1995-04-05", "F", "3401110004", None,                          "Via Mazzini 22, Udine"),
    ("Matteo",    "Barbieri", "BRBMTT88E18A662V", "1988-05-18", "M", "3401110005", "matteo.barbieri@example.it",  "Via Garibaldi 5, Udine"),
    ("Davide",    "Villa",    "VLLDVD79F22D612J", "1979-06-22", "M", "3401110006", "davide.villa@example.it",     "Via Cavour 30, Udine"),
    ("Martina",   "Sartori",  "SRTMTN93G50H501B", "1993-07-10", "F", "3401110007", "martina.sartori@example.it",  "Via Manzoni 9, Udine"),
    ("Valentina", "Colombo",  "CLMVNT87H55F205D", "1987-08-15", "F", "3401110008", "valentina.colombo@example.it","Via Leopardi 3, Udine"),
    ("Giovanni",  "Rossi",    "RSSGNN68I25L219M", "1968-09-25", "M", "3401110009", "giovanni.rossi@example.it",   "Via Foscolo 17, Udine"),
    ("Gennaro",   "Bianchi",  "BNCGNR50H03H501O", "1950-06-03", "M", "3352379564", "gennaro.bianchi@example.it",  "Via Palio 10, Roma"),
]


def creaMedici(token):
    creati = []
    for nome, cognome, cf, specializzazione, albo in MEDICI:
        risposta = requests.post(BASE + "/utenti", headers=intestazioni(token), json={
            "nome": nome,
            "cognome": cognome,
            "codiceFiscale": cf,
            "ruolo": "Medico",
            "telefono": "0432000000",
            "email": nome.lower() + "." + cognome.lower() + "@poliambulatorio.it",
            "password": "medico123"
        })
        if not risposta.ok:
            print("  utente medico non creato:", nome, cognome, risposta.status_code, risposta.text)
            continue
        utente = risposta.json()

        risposta = requests.post(BASE + "/medici", headers=intestazioni(token), json={
            "utente_id": utente["id"],
            "numeroAlbo": albo,
            "specializzazione": specializzazione
        })
        if not risposta.ok:
            print("  medico non creato:", nome, cognome, risposta.status_code, risposta.text)
            continue
        creati.append(risposta.json())
        print("  medico:", nome, cognome, "-", specializzazione)
    return creati


def creaPazienti(token):
    creati = []
    for nome, cognome, cf, nascita, sesso, telefono, email, indirizzo in PAZIENTI:
        risposta = requests.post(BASE + "/pazienti", headers=intestazioni(token), json={
            "nome": nome,
            "cognome": cognome,
            "codiceFiscale": cf,
            "dataNascita": nascita,
            "sesso": sesso,
            "telefono": telefono,
            "email": email,
            "indirizzo": indirizzo
        })
        if not risposta.ok:
            print("  paziente non creato:", nome, cognome, risposta.status_code, risposta.text)
            continue
        creati.append(risposta.json())
        print("  paziente:", nome, cognome)
    return creati


def prossimiGiorniLavorativi(quanti):
    giorni = []
    giorno = datetime.now().date() + timedelta(days=1)
    while len(giorni) < quanti:
        if giorno.weekday() < 5:
            giorni.append(giorno)
        giorno = giorno + timedelta(days=1)
    return giorni


def creaAppuntamenti(token, medici, pazienti):
    if not medici or not pazienti:
        print("  nessun appuntamento creato: mancano medici o pazienti")
        return

    orari = [9, 10, 11, 12, 15, 16, 17]
    giorni = prossimiGiorniLavorativi(4)

    creati = 0
    indice = 0
    for giorno in giorni:
        for ora in orari:
            medico = medici[indice % len(medici)]
            paziente = pazienti[indice % len(pazienti)]
            indice = indice + 1

            dataOra = datetime(giorno.year, giorno.month, giorno.day, ora, 0, 0)
            risposta = requests.post(BASE + "/appuntamenti", headers=intestazioni(token), json={
                "dataOra": dataOra.isoformat(),
                "paziente_id": paziente["id"],
                "medico_id": medico["id"]
            })
            if risposta.ok:
                creati = creati + 1
            else:
                print("  appuntamento non creato:", dataOra, risposta.status_code, risposta.text)
    print("  appuntamenti creati:", creati)


def main():
    token = login()
    if token is None:
        return

    print("Creazione dei medici...")
    medici = creaMedici(token)

    print("Creazione dei pazienti...")
    pazienti = creaPazienti(token)

    print("Creazione degli appuntamenti...")
    creaAppuntamenti(token, medici, pazienti)

    print("Popolamento completato.")


if __name__ == "__main__":
    main()
