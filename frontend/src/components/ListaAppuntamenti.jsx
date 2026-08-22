import { useEffect, useState } from "react";

function ListaAppuntamenti({ aggiornamento, onSessioneScaduta }) {
    const [appuntamenti, setAppuntamenti] = useState([]);
    const [pazienti, setPazienti] = useState([]);
    const [medici, setMedici] = useState([]);
    const [messaggio, setMessaggio] = useState("");
    const [inConclusione, setInConclusione] = useState(null);
    const [datiConclusione, setDatiConclusione] = useState({prezzo: "", esito: ""});

    const caricaAppuntamenti = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/appuntamenti", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const dati = await risposta.json();

        if (risposta.ok) {
            setAppuntamenti(dati);
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante il caricamento");
        }
    }

    const caricaPazienti = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/pazienti", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const dati = await risposta.json();

        if (risposta.ok) {
            setPazienti(dati);
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante il caricamento");
        }
    }

    const caricaMedici = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/medici", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const dati = await risposta.json();

        if (risposta.ok) {
            setMedici(dati);
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante il caricamento");
        }
    }

    const annullaAppuntamento = async (id) => {
        const token = localStorage.getItem("token");

        if (!confirm("Annullare appuntamento?")) {
            return;
        }

        const risposta = await fetch(`http://localhost:8000/appuntamenti/${id}/annulla`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (risposta.ok) {
            caricaAppuntamenti();
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante l'annullamento");
        }
    }

    const iniziaAppuntamento = async (id) => {
        const token = localStorage.getItem("token");

        const risposta = await fetch(`http://localhost:8000/appuntamenti/${id}/inizia`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (risposta.ok) {
            caricaAppuntamenti();
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante l'inizializzazione dell'appuntamento");
        }
    }

    const nomePaziente = (id) => {
        const paziente = pazienti.find((p) => p.id === id);
        return paziente ? `${paziente.nome} ${paziente.cognome}` : "—";
    }

    const nomeMedico = (id) => {
        const medico = medici.find((m) => m.id === id);
        return medico ? `${medico.utente.nome} ${medico.utente.cognome} - ${medico.specializzazione}` : "—";
    }

    const salvaConclusione = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch(`http://localhost:8000/appuntamenti/${inConclusione.id}/concludi`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(datiConclusione)
        });

        if (risposta.ok) {
            setInConclusione(null);
            setDatiConclusione({prezzo: "", esito: ""});
            caricaAppuntamenti();
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante la conclusione dell'appuntamento");
        }
    }

    const aggiornaCampoConclusione = (campo, valore) => {
        setDatiConclusione({...datiConclusione, [campo]: valore});
    }

    useEffect(() => {
        caricaAppuntamenti();
        caricaPazienti();
        caricaMedici();
    }, [aggiornamento])

    return (
        <div>
            <ul>
                {appuntamenti.map((appuntamento) => (
                    <li key={appuntamento.id}>
                        {new Date(appuntamento.dataOra).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        - Stato: {appuntamento.stato} - Paziente: {nomePaziente(appuntamento.paziente_id)} - Medico: {nomeMedico(appuntamento.medico_id)}
                        {appuntamento.stato === "Programmato" && (
                            <span>
                                <button onClick={() => iniziaAppuntamento(appuntamento.id)}>Inizia</button>
                                <button onClick={() => annullaAppuntamento(appuntamento.id)}>Annulla</button>
                            </span>
                        )}
                        {appuntamento.stato === "In corso" && (
                            inConclusione && inConclusione.id === appuntamento.id ? (
                                <span>
                                    <input type="number" placeholder="Prezzo" value={datiConclusione.prezzo} onChange={(e) => aggiornaCampoConclusione("prezzo", e.target.value)} />
                                    <input type="text" placeholder="Esito" value={datiConclusione.esito} onChange={(e) => aggiornaCampoConclusione("esito", e.target.value)} />
                                    <button onClick={salvaConclusione}>Salva</button>
                                    <button onClick={() => setInConclusione(null)}>Annulla</button>
                                </span>
                            ) : (
                                <button onClick={() => {setInConclusione(appuntamento), setDatiConclusione({prezzo: "", esito: ""})}}>Concludi</button>
                            )
                        )}
                    </li>
                ))}
            </ul>
            <p>{messaggio}</p>
        </div>
    )
}

export default ListaAppuntamenti;