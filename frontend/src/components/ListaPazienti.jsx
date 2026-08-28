import { useEffect, useState } from "react";

function ListaPazienti({ aggiornamento, ruolo, onSessioneScaduta }) {
    const [pazienti, setPazienti] = useState([]);
    const [messaggio, setMessaggio] = useState("");
    const [inModifica, setInModifica] = useState(null);

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

    const eliminaPaziente = async (id) => {
        const token = localStorage.getItem("token");

        if (!confirm("Eliminare il paziente?")) {
            return;
        }

        const risposta = await fetch(`http://localhost:8000/pazienti/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (risposta.ok) {
            caricaPazienti();
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante l'eliminazione");
        }
    }

    const salvaModifica = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch(`http://localhost:8000/pazienti/${inModifica.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(inModifica)
        });

        if (risposta.ok) {
            setInModifica(null);
            caricaPazienti();
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante la modifica");
        }
    }

    const aggiornaCampoModifica = (campo, valore) => {
        setInModifica({ ...inModifica, [campo]: valore });
    }

    useEffect(() => {
        caricaPazienti();
    }, [aggiornamento])

    return (
        <div className="scheda">
            <h2 className="scheda-titolo">Elenco pazienti</h2>

            {pazienti.length === 0 ? (
                <p className="lista-vuota">Nessun paziente registrato</p>
            ) : (
                <ul className="lista">
                    {pazienti.map((paziente) => (
                        <li key={paziente.id} className="lista-riga">
                            <div className="riga-info">
                                <span className="riga-principale">{paziente.nome} {paziente.cognome}</span>
                                <span className="riga-secondaria">{paziente.telefono}</span>
                                <span className="riga-secondaria">{paziente.email || "—"}</span>
                            </div>

                            {(ruolo === "Admin" || ruolo === "Segreteria") && (
                                <div className="riga-azioni">
                                    <button className="bottone-secondario" onClick={() => setInModifica(paziente)}>Modifica</button>
                                    <button className="bottone-secondario bottone-pericolo" onClick={() => eliminaPaziente(paziente.id)}>Elimina</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {inModifica && (
                <div className="velo">
                    <div className="modale">
                        <div className="modale-intestazione">
                            <h2 className="scheda-titolo">Modifica paziente</h2>
                            <button className="chiudi-modale" onClick={() => setInModifica(null)}>×</button>
                        </div>

                        <div className="form-griglia">
                            <div className="campo">
                                <label>Telefono</label>
                                <input type="text" value={inModifica.telefono} onChange={(e) => aggiornaCampoModifica("telefono", e.target.value)} />
                            </div>
                            <div className="campo">
                                <label>Email</label>
                                <input type="text" value={inModifica.email || ""} onChange={(e) => aggiornaCampoModifica("email", e.target.value)} />
                            </div>
                            <div className="campo campo-intero">
                                <label>Indirizzo</label>
                                <input type="text" value={inModifica.indirizzo} onChange={(e) => aggiornaCampoModifica("indirizzo", e.target.value)} />
                            </div>
                        </div>

                        <button className="bottone-primario" onClick={salvaModifica}>Salva modifiche</button>
                    </div>
                </div>
            )}

            {messaggio && <p className="messaggio messaggio-errore">{messaggio}</p>}
        </div>
    )
}

export default ListaPazienti;