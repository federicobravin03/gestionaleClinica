import { useEffect, useState } from "react";

function ListaAppuntamenti({ aggiornamento, ruolo, onSessioneScaduta }) {
    const [appuntamenti, setAppuntamenti] = useState([]);
    const [pazienti, setPazienti] = useState([]);
    const [medici, setMedici] = useState([]);
    const [filtro, setFiltro] = useState("Tutti");
    const [messaggio, setMessaggio] = useState("");
    const [inConclusione, setInConclusione] = useState(null);
    const [datiConclusione, setDatiConclusione] = useState({ prezzo: "", esito: "" });

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
            setMessaggio(risultato.detail);
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
            const risultato = await risposta.json();
            setMessaggio(risultato.detail);
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
            const risultato = await risposta.json();
            setMessaggio(risultato.detail);
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
            const risultato = await risposta.json();
            setMessaggio(+ risultato.detail);
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
            const risultato = await risposta.json();
            setMessaggio(risultato.detail);
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
            setDatiConclusione({ prezzo: "", esito: "" });
            caricaAppuntamenti();
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            const risultato = await risposta.json();
            setMessaggio("Errore: " + risultato.detail);
        }
    }

    const aggiornaCampoConclusione = (campo, valore) => {
        setDatiConclusione({ ...datiConclusione, [campo]: valore });
    }

    const classeStato = (stato) => {
        if (stato === "Programmato") return "stato-programmato";
        if (stato === "In corso") return "stato-in-corso";
        if (stato === "Concluso") return "stato-concluso";
        return "stato-annullato";
    }

    useEffect(() => {
        caricaAppuntamenti();
        caricaPazienti();
        caricaMedici();
    }, [aggiornamento])

    const appuntamentiFiltrati = appuntamenti.filter((a) => filtro === "Tutti" || a.stato === filtro);

    return (
        <div className="scheda">
            <h2 className="scheda-titolo">Elenco appuntamenti</h2>

            <div className="filtri">
                <button className="filtro-voce" onClick={() => setFiltro("Tutti")} disabled={filtro === "Tutti"}>Tutti</button>
                <button className="filtro-voce" onClick={() => setFiltro("Programmato")} disabled={filtro === "Programmato"}>Programmati</button>
                <button className="filtro-voce" onClick={() => setFiltro("In corso")} disabled={filtro === "In corso"}>In corso</button>
                <button className="filtro-voce" onClick={() => setFiltro("Concluso")} disabled={filtro === "Concluso"}>Conclusi</button>
                <button className="filtro-voce" onClick={() => setFiltro("Annullato")} disabled={filtro === "Annullato"}>Annullati</button>
            </div>

            {appuntamentiFiltrati.length === 0 ? (
                <p className="lista-vuota">Nessun appuntamento da mostrare</p>
            ) : (
                <ul className="lista">
                    {appuntamentiFiltrati.map((appuntamento) => (
                        <li key={appuntamento.id} className="lista-riga">
                            <div className="riga-info">
                                <span className="riga-principale">
                                    {new Date(appuntamento.dataOra).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </span>
                                <span className={`stato ${classeStato(appuntamento.stato)}`}>{appuntamento.stato}</span>
                                <span className="riga-secondaria">{nomePaziente(appuntamento.paziente_id)}</span>
                                <span className="riga-secondaria">{nomeMedico(appuntamento.medico_id)}</span>
                                {appuntamento.stato === "Concluso" && (
                                    <span className="riga-secondaria">€{appuntamento.prezzo} · {appuntamento.esito}</span>
                                )}
                            </div>

                            <div className="riga-azioni">
                                {appuntamento.stato === "Programmato" && (
                                    <>
                                        {(ruolo === "Admin" || ruolo === "Medico") && (
                                            <button className="bottone-azione" onClick={() => iniziaAppuntamento(appuntamento.id)}>Inizia</button>
                                        )}
                                        {(ruolo === "Admin" || ruolo === "Segreteria") && (
                                            <button className="bottone-secondario bottone-pericolo" onClick={() => annullaAppuntamento(appuntamento.id)}>Annulla</button>
                                        )}
                                    </>
                                )}

                                {appuntamento.stato === "In corso" && (ruolo === "Admin" || ruolo === "Medico") && (
                                    <button className="bottone-azione" onClick={() => { setInConclusione(appuntamento); setDatiConclusione({ prezzo: "", esito: "" }); }}>Concludi</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {inConclusione && (
                <div className="velo">
                    <div className="modale">
                        <div className="modale-intestazione">
                            <h2 className="scheda-titolo">Concludi visita</h2>
                            <button className="chiudi-modale" onClick={() => setInConclusione(null)}>×</button>
                        </div>

                        <div className="form-griglia">
                            <div className="campo">
                                <label>Prezzo (€)</label>
                                <input type="number" value={datiConclusione.prezzo} onChange={(e) => aggiornaCampoConclusione("prezzo", e.target.value)} />
                            </div>
                            <div className="campo campo-intero">
                                <label>Esito</label>
                                <input type="text" value={datiConclusione.esito} onChange={(e) => aggiornaCampoConclusione("esito", e.target.value)} />
                            </div>
                        </div>

                        <button className="bottone-primario" onClick={salvaConclusione}>Salva conclusione</button>
                    </div>
                </div>
            )}

            {messaggio && <p className="messaggio messaggio-errore">{messaggio}</p>}
        </div>
    )
}

export default ListaAppuntamenti;