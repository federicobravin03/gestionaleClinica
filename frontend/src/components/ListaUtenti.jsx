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

        if (risposta.ok) {
            setUtenti(dati);
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante il caricamento");
        }
    }

    const eliminaUtente = async (id) => {
        const token = localStorage.getItem("token");

        if (!confirm("Eliminare utente?")) {
            return;
        }

        const risposta = await fetch(`http://localhost:8000/utenti/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (risposta.ok) {
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

    return (
        <div className="scheda">
            <h2 className="scheda-titolo">Elenco utenti</h2>

            {utenti.length === 0 ? (
                <p className="lista-vuota">Nessun utente registrato</p>
            ) : (
                <ul className="lista">
                    {utenti.map((u) => (
                        <li key={u.id} className="lista-riga">
                            <div className="riga-info">
                                <span className="riga-principale">{u.nome} {u.cognome}</span>
                                <span className="riga-secondaria">{u.ruolo}</span>
                                <span className="riga-secondaria">{u.username}</span>
                            </div>

                            <div className="riga-azioni">
                                <button className="bottone-secondario bottone-pericolo" onClick={() => eliminaUtente(u.id)}>Elimina</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {messaggio && <p className="messaggio messaggio-errore">{messaggio}</p>}
        </div>
    )
}

export default ListaUtenti;