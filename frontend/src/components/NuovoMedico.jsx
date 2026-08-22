import { useState, useEffect } from "react";

function NuovoMedico({ onMedicoCreato, onSessioneScaduta }) {
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
        <div>
            <select value={dati.utente_id} onChange={(e) => aggiornaCampo("utente_id", e.target.value)}>
                <option value="">Seleziona utente</option>
                {utenti.filter((u) => u.ruolo === "Medico").map((utente) => (
                    <option key={utente.id} value={utente.id}>
                        {utente.nome} {utente.cognome}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Numero albo"
                value={dati.numeroAlbo}
                onChange={(e) => aggiornaCampo("numeroAlbo", e.target.value)}
            />
            <input
                type="text"
                placeholder="Specializzazione"
                value={dati.specializzazione}
                onChange={(e) => aggiornaCampo("specializzazione", e.target.value)}
            />

            <button onClick={creaMedico}>Crea medico</button>
            <p>{messaggio}</p>
        </div>
    )
}

export default NuovoMedico;