"""
Popolamento dello storico: appuntamenti gia' conclusi, necessari
perche' la dashboard economica abbia dati da rappresentare.

A differenza di popola_dati.py questo script non passa dalle API ma
richiama direttamente il livello dei modelli: i controlli applicativi
impediscono infatti di registrare un appuntamento in una data passata,
vincolo corretto in esercizio ma incompatibile con la creazione di uno
storico. Da eseguire dopo popola_dati.py.

Uso:  python popola_storico.py
"""

from datetime import datetime, timedelta
from decimal import Decimal

from database import SessionLocal
from models import Appuntamento, Medico, Paziente, StatoAppuntamento

ESITI = [
    ("Visita di controllo eseguita, nessuna anomalia riscontrata.", "80.00"),
    ("Medicazione eseguita, rimozione punti tra sette giorni.",     "90.00"),
    ("Esito nella norma, si consiglia controllo annuale.",          "100.00"),
    ("Rilasciata certificazione, nessuna anomalia riscontrata.",    "90.00"),
    ("Terapia farmacologica avviata, controllo tra 30 giorni.",     "50.00"),
    ("Accertamenti diagnostici prescritti, esito atteso.",          "120.00"),
]


def giorniLavorativiPassati(quanti):
    giorni = []
    giorno = datetime.now().date() - timedelta(days=1)
    while len(giorni) < quanti:
        if giorno.weekday() < 5:
            giorni.append(giorno)
        giorno = giorno - timedelta(days=1)
    return giorni


def main():
    db = SessionLocal()
    try:
        medici = db.query(Medico).all()
        pazienti = db.query(Paziente).all()

        if not medici or not pazienti:
            print("Nessun medico o paziente presente: eseguire prima popola_dati.py")
            return

        esistenti = db.query(Appuntamento).filter(
            Appuntamento.stato == StatoAppuntamento.CONCLUSO
        ).count()
        if esistenti > 0:
            print("Lo storico e' gia' presente (" + str(esistenti) + " appuntamenti conclusi).")
            return

        orari = [9, 10, 11, 15, 16]
        creati = 0
        indice = 0

        for giorno in giorniLavorativiPassati(6):
            for ora in orari:
                medico = medici[indice % len(medici)]
                paziente = pazienti[indice % len(pazienti)]
                esito, prezzo = ESITI[indice % len(ESITI)]
                indice = indice + 1

                appuntamento = Appuntamento(
                    dataOra=datetime(giorno.year, giorno.month, giorno.day, ora, 0, 0),
                    paziente_id=paziente.id,
                    medico_id=medico.id,
                    stato=StatoAppuntamento.CONCLUSO,
                    prezzo=Decimal(prezzo),
                    esito=esito
                )
                db.add(appuntamento)
                creati = creati + 1

        db.commit()
        print("Appuntamenti conclusi inseriti:", creati)

    finally:
        db.close()


if __name__ == "__main__":
    main()
