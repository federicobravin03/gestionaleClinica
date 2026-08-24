import { useEffect, useState } from "react";

function ListaUtenti({ aggiornamento, onSessioneScaduta }) {
    const [utenti, setUtenti] = useState([]);
    const [messaggio, setMessaggio] = useState("");

    const caricaUtenti = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/utenti", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const dati = await risposta.json();

        if(risposta.ok) {
            setUtenti(dati);
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante il caricamento");
        }
    }

    const eliminaUtente = async (id) => {
        const token = localStorage.getItem("token");

        if(!confirm("Eliminare utente?")) {
            return;
        }

        const risposta = await fetch(`http://localhost:8000/utenti/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if(risposta.ok) {
            caricaUtenti();
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante l'eliminazione");
        }
    }

    useEffect(() => {
        caricaUtenti();
    }, [aggiornamento])

    return(
        <div>
            <ul>
                {utenti.map((utente) => (
                    <li key={utente.id}>
                        {utente.nome} {utente.cognome} - {utente.ruolo} - username: {utente.username} - {utente.email}
                        <button onClick={() => eliminaUtente(utente.id)}>Elimina</button>
                    </li>
                ))}
            </ul>
            <p>{messaggio}</p>
        </div>
    )
}

export default ListaUtenti;