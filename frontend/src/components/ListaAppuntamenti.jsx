import { useEffect, useState } from "react";

function ListaAppuntamenti({ aggiornamento }) {
    const [appuntamenti, setAppuntamenti] = useState([]);
    const [pazienti, setPazienti] = useState([]);
    const [medici, setMedici] = useState([]);
    const [messaggio, setMessaggio] = useState("");

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
        } else {
            setMessaggio("Errore durante il caricamento");
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
                        {new Date(appuntamento.dataOra).toLocaleString("it-IT", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"})}
                         - Stato: {appuntamento.stato} - Paziente: {nomePaziente(appuntamento.paziente_id)} - Medico: {nomeMedico(appuntamento.medico_id)}
                    </li>
                ))}
            </ul>
            <p>{messaggio}</p>
        </div>
    )
}

export default ListaAppuntamenti;