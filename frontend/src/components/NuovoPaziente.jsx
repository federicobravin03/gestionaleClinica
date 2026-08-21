import { useState } from "react";

function NuovoPaziente({onPazienteCreato, onSessioneScaduta}) {
    const [messaggio, setMessaggio] = useState("");

    const [dati, setDati] = useState({
        nome: "",
        cognome: "",
        codiceFiscale: "",
        dataNascita: "",
        telefono: "",
        email: "",
        indirizzo: "",
        sesso: ""
    });

    const aggiornaCampo = (campo, valore) => {
        setDati({ ...dati, [campo]: valore });
    }

    const creaPaziente = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/pazienti", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(dati)
        });

        if (risposta.ok) {
            setDati({
                nome: "",
                cognome: "",
                codiceFiscale: "",
                dataNascita: "",
                telefono: "",
                email: "",
                indirizzo: "",
                sesso: ""
            })
            onPazienteCreato();
            setMessaggio("Paziente creato con successo");
        } else if(risposta.status === 401) {
            onSessioneScaduta();
        } else {
            const risultato = await risposta.json();
            setMessaggio("Errore: " + JSON.stringify(risultato.detail));
        }
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Nome"
                value={dati.nome}
                onChange={(e) => aggiornaCampo("nome", e.target.value)}
            />
            <input
                type="text"
                placeholder="Cognome"
                value={dati.cognome}
                onChange={(e) => aggiornaCampo("cognome", e.target.value)}
            />
            <input
                type="text"
                placeholder="Codice Fiscale"
                value={dati.codiceFiscale}
                onChange={(e) => aggiornaCampo("codiceFiscale", e.target.value)}
            />
            <input
                type="date"
                value={dati.dataNascita}
                onChange={(e) => aggiornaCampo("dataNascita", e.target.value)}
            />
            <input
                type="text"
                placeholder="Telefono"
                value={dati.telefono}
                onChange={(e) => aggiornaCampo("telefono", e.target.value)}
            />
            <input
                type="text"
                placeholder="Email"
                value={dati.email}
                onChange={(e) => aggiornaCampo("email", e.target.value)}
            />
            <input
                type="text"
                placeholder="Indirizzo"
                value={dati.indirizzo}
                onChange={(e) => aggiornaCampo("indirizzo", e.target.value)}
            />
            <select
                value={dati.sesso}
                onChange={(e) => aggiornaCampo("sesso", e.target.value)}
            >
                <option value="">Seleziona sesso</option>
                <option value="M">Maschio</option>
                <option value="F">Femmina</option>
            </select>

            <button onClick={creaPaziente}>Crea paziente</button>
            <p>{messaggio}</p>
        </div>
    )
}

export default NuovoPaziente;