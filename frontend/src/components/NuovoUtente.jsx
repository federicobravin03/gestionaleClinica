import { useState } from "react";

function NuovoUtente({onUtenteCreato, onSessioneScaduta}) {
    const [messaggio, setMessaggio] = useState("");

    const [dati, setDati] = useState({
        nome: "",
        cognome: "",
        ruolo: "",
        codiceFiscale: "",
        password: "",
        telefono: "",
        email: ""
    });

    const aggiornaCampo = (campo, valore) => {
        setDati({...dati, [campo]:valore});
    }

    const creaUtente = async () => {
        if(dati.nome === "" || dati.cognome === "" || dati.ruolo ==="" || dati.codiceFiscale === "" || dati.password === "" || dati.telefono === "" || dati.email === "") {
            setMessaggio("Compilare tutti i campi obbligatori");
            return;
        }

        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/utenti", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(dati)
        });

        const risultato = await risposta.json();

        if(risposta.ok) {
            setDati({
                nome: "",
                cognome: "",
                ruolo: "",
                codiceFiscale: "",
                password: "",
                telefono: "",
                email: ""
            })
            onUtenteCreato();
            setMessaggio(`Utente creato con successo. Username: ${risultato.username}`);
        } else if(risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante la creazione del utente");
        }
    }

    return(
        <div>
            <select value={dati.ruolo} onChange={(e) => aggiornaCampo("ruolo", e.target.value)}>
                <option value="">Seleziona ruolo</option>
                <option value="Admin">Admin</option>
                <option value="Segreteria">Segreteria</option>
                <option value="Medico">Medico</option>
            </select>
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
                placeholder="Codice fiscale"
                value={dati.codiceFiscale}
                onChange={(e) => aggiornaCampo("codiceFiscale", e.target.value)}
            />
            <input 
                type="password"
                placeholder="password"
                value={dati.password}
                onChange={(e) => aggiornaCampo("password", e.target.value)}
            />
            <input 
                type="text"
                placeholder="Telefono"
                value={dati.telefono}
                onChange={(e) => aggiornaCampo("telefono", e.target.value)}
            />
            <input 
                type="text"
                placeholder="email"
                value={dati.email}
                onChange={(e) => aggiornaCampo("email", e.target.value)}
            />

            <button onClick={creaUtente}>Crea utente</button>
            <p>{messaggio}</p>
        </div>
    )
}

export default NuovoUtente;