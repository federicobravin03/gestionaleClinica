import { useEffect, useState } from "react";

function ListaMedici({ aggiornamento, ruolo, onSessioneScaduta }) {
    const [medici, setMedici] = useState([]);
    const [messaggio, setMessaggio] = useState("");

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

    const eliminaMedico = async (id) => {
        const token = localStorage.getItem("token");

        if (!confirm("Eliminare il medico?")) {
            return;
        }

        const risposta = await fetch(`http://localhost:8000/medici/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (risposta.ok) {
            caricaMedici();
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante l'eliminazione");
        }
    }

    useEffect(() => {
        caricaMedici();
    }, [aggiornamento])

    return (
        <div className="scheda">
            <h2 className="scheda-titolo">Elenco medici</h2>

            {medici.length === 0 ? (
                <p className="lista-vuota">Nessun medico registrato</p>
            ) : (
                <ul className="lista">
                    {medici.map((medico) => (
                        <li key={medico.id} className="lista-riga">
                            <div className="riga-info">
                                <span className="riga-principale">{medico.utente.nome} {medico.utente.cognome}</span>
                                <span className="riga-secondaria">{medico.specializzazione}</span>
                                <span className="riga-secondaria">Albo n. {medico.numeroAlbo}</span>
                            </div>

                            {ruolo === "Admin" && (
                                <div className="riga-azioni">
                                    <button className="bottone-secondario bottone-pericolo" onClick={() => eliminaMedico(medico.id)}>Elimina</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {messaggio && <p className="messaggio messaggio-errore">{messaggio}</p>}
        </div>
    )
}

export default ListaMedici;