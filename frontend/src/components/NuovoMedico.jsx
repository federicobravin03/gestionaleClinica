import { useState, useEffect, createContext } from "react";

function NuovoMedico({ onMedicoCreato, onSessioneScaduta, onChiudi }) {
    const [messaggio, setMessaggio] = useState("");
    const [utenti, setUtenti] = useState([]);
    const [dati, setDati] = useState({
        utente_id: "",
        numeroAlbo: "",
        specializzazione: ""
    });

    const aggiornaCampo = (campo, valore) => {
        setDati({ ...dati, [campo]: valore });
    }

    const creaMedico = async () => {
        if (dati.utente_id === "" || dati.numeroAlbo === "" || dati.specializzazione === "") {
            setMessaggio("Compilare tutti i campi");
            return;
        }
        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/medici", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(dati),
        });

        if (risposta.ok) {
            setDati({
                utente_id: "",
                numeroAlbo: "",
                specializzazione: ""
            })

            onMedicoCreato();
            setMessaggio("Medico creato con successo");
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante la creazione del medico");
        }
    }

    const caricaUtenti = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/utenti", {
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        const elenco = await risposta.json();

        if (risposta.ok) {
            setUtenti(elenco);
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante il caricamento");
        }
    }

    useEffect(() => {
        caricaUtenti();
    }, [])

    return (
        <div className="velo">
            <div className="modale">
                <div className="modale-intestazione">
                    <h2 className="scheda-titolo">Nuovo medico</h2>
                    <button className="chiudi-modale" onClick={onChiudi}>×</button>
                </div>

                <div className="form-griglia">
                    <div className="campo">
                        <label>Utente</label>
                        <select value={dati.utente_id} onChange={(e) => aggiornaCampo("utente_id", e.target.value)}>
                            <option value="">Seleziona utente</option>
                            {utenti.filter((u) => u.ruolo === "Medico").map((utente) => (
                                <option key={utente.id} value={utente.id}>
                                    {utente.nome} {utente.cognome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="campo">
                        <label>Numero albo</label>
                        <input type="text" value={dati.numeroAlbo} onChange={(e) => aggiornaCampo("numeroAlbo", e.target.value)} />
                    </div>

                    <div className="campo campo-intero">
                        <label>Specializzazione</label>
                        <input type="text" value={dati.specializzazione} onChange={(e) => aggiornaCampo("specializzazione", e.target.value)} />
                    </div>
                </div>

                <button className="bottone-primario" onClick={creaMedico}>Crea medico</button>

                {messaggio && <p className="messaggio messaggio-errore">{messaggio}</p>}
            </div>
        </div>
    )
}

export default NuovoMedico;