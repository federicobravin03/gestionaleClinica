import { useState } from "react";

function NuovoUtente({ onUtenteCreato, onSessioneScaduta, onChiudi }) {
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
        setDati({ ...dati, [campo]: valore });
    }

    const creaUtente = async () => {
        if (dati.nome === "" || dati.cognome === "" || dati.ruolo === "" || dati.codiceFiscale === "" || dati.password === "" || dati.telefono === "" || dati.email === "") {
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

        if (risposta.ok) {
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
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante la creazione del utente");
        }
    }

    return (
        <div className="velo">
            <div className="modale">
                <div className="modale-intestazione">
                    <h2 className="scheda-titolo">Nuovo utente</h2>
                    <button className="chiudi-modale" onClick={onChiudi}>×</button>
                </div>

                <div className="form-griglia">
                    <div className="campo campo-intero">
                        <label>Ruolo</label>
                        <select value={dati.ruolo} onChange={(e) => aggiornaCampo("ruolo", e.target.value)}>
                            <option value="">Seleziona ruolo</option>
                            <option value="Admin">Admin</option>
                            <option value="Segreteria">Segreteria</option>
                            <option value="Medico">Medico</option>
                        </select>
                    </div>

                    <div className="campo">
                        <label>Nome</label>
                        <input type="text" value={dati.nome} onChange={(e) => aggiornaCampo("nome", e.target.value)} />
                    </div>

                    <div className="campo">
                        <label>Cognome</label>
                        <input type="text" value={dati.cognome} onChange={(e) => aggiornaCampo("cognome", e.target.value)} />
                    </div>

                    <div className="campo campo-intero">
                        <label>Codice fiscale</label>
                        <input type="text" value={dati.codiceFiscale} onChange={(e) => aggiornaCampo("codiceFiscale", e.target.value)} />
                    </div>

                    <div className="campo">
                        <label>Telefono</label>
                        <input type="text" value={dati.telefono} onChange={(e) => aggiornaCampo("telefono", e.target.value)} />
                    </div>

                    <div className="campo">
                        <label>Email</label>
                        <input type="text" value={dati.email} onChange={(e) => aggiornaCampo("email", e.target.value)} />
                    </div>

                    <div className="campo campo-intero">
                        <label>Password</label>
                        <input type="password" value={dati.password} onChange={(e) => aggiornaCampo("password", e.target.value)} />
                    </div>
                </div>

                <button className="bottone-primario" onClick={creaUtente}>Crea utente</button>

                {messaggio && <p className="messaggio messaggio-errore">{messaggio}</p>}
            </div>
        </div>
    )
}

export default NuovoUtente;