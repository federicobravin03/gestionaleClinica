import { useEffect, useState } from "react";

function NuovoAppuntamento({onAppuntamentoCreato}) {
    const [pazienti, setPazienti] = useState([]);
    const [medici, setMedici] = useState([]);
    const [messaggio, setMessaggio] = useState("");
    const [dati, setDati] = useState({
        dataOra: "",
        paziente_id: "",
        medico_id: ""
    });

    const aggiornaCampo = (campo, valore) => {
        setDati({...dati, [campo]: valore});
    }

    const creaAppuntamento = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/appuntamenti", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(dati)
        });

        if (risposta.ok) {
            setDati({
                dataOra: "",
                paziente_id: "",
                medico_id: ""
            })
            onAppuntamentoCreato();
            setMessaggio("Appuntamento creato con successo");
        } else {
            const risultato = await risposta.json();
            setMessaggio("Errore: " + JSON.stringify(risultato.detail));
        }
    }

    const caricaPazienti = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/pazienti", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const elenco = await risposta.json();

        if (risposta.ok) {
            setPazienti(elenco);
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

        const elenco = await risposta.json();

        if (risposta.ok) {
            setMedici(elenco);
        } else {
            setMessaggio("Errore durante il caricamento");
        }
    }

    useEffect(() => {
        caricaPazienti();
        caricaMedici();
    }, [])

    return (
        <div>
            <input type="datetime-local" value={dati.dataOra} onChange={(e) => aggiornaCampo("dataOra", e.target.value)} />

            <select value={dati.paziente_id} onChange={(e) => aggiornaCampo("paziente_id", e.target.value)}>
                <option value="">Seleziona paziente</option>

                {pazienti.map((paziente) => (
                    <option key={paziente.id} value={paziente.id}>
                        {paziente.nome} {paziente.cognome}
                    </option>
                ))}
            </select>

            <select value={dati.medico_id} onChange={(e) => aggiornaCampo("medico_id", e.target.value)}>
                <option value="">Seleziona medico</option>

                {medici.map((medico) => (
                    <option key={medico.id} value={medico.id}>
                        {medico.utente.nome} {medico.utente.cognome} - {medico.specializzazione}
                    </option>
                ))}
            </select>

            <button onClick={creaAppuntamento}>Crea appuntamento</button>

            <p>{messaggio}</p>
        </div>
    )
}

export default NuovoAppuntamento;