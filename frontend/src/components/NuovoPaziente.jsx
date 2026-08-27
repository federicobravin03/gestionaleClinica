import { useState } from "react";

function NuovoPaziente({ onPazienteCreato, onSessioneScaduta, onChiudi }) {
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
        if (dati.nome === "" || dati.cognome === "" || dati.codiceFiscale === "" || dati.dataNascita === "" || dati.telefono === "" || dati.indirizzo === "" || dati.sesso === "") {
            setMessaggio("Compilare tutti i campi obbligatori");
            return;
        }

        const token = localStorage.getItem("token");

        const daInviare = { ...dati, email: dati.email === "" ? null : email.dati };

        const risposta = await fetch("http://localhost:8000/pazienti", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(daInviare)
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
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            const risultato = await risposta.json();
            setMessaggio("Errore: " + JSON.stringify(risultato.detail));
        }
    }

    return (
        <div className="velo">
            <div className="modale">
                <div className="modale-intestazione">
                    <h2 className="scheda-titolo">Nuovo paziente</h2>
                    <button className="chiudi-modale" onClick={onChiudi}>×</button>
                </div>
                
                <div className="form-griglia">
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
                        <label>Data di nascita</label>
                        <input type="date" value={dati.dataNascita} onChange={(e) => aggiornaCampo("dataNascita", e.target.value)} />
                    </div>

                    <div className="campo">
                        <label>Sesso</label>
                        <select value={dati.sesso} onChange={(e) => aggiornaCampo("sesso", e.target.value)}>
                            <option value="">Seleziona</option>
                            <option value="M">Maschio</option>
                            <option value="F">Femmina</option>
                        </select>
                    </div>

                    <div className="campo">
                        <label>Telefono</label>
                        <input type="text" value={dati.telefono} onChange={(e) => aggiornaCampo("telefono", e.target.value)} />
                    </div>

                    <div className="campo">
                        <label>Email <span className="facoltativo">(facoltativo)</span></label>
                        <input type="text" value={dati.email} onChange={(e) => aggiornaCampo("email", e.target.value)} />
                    </div>

                    <div className="campo campo-intero">
                        <label>Indirizzo</label>
                        <input type="text" value={dati.indirizzo} onChange={(e) => aggiornaCampo("indirizzo", e.target.value)} />
                    </div>
                </div>

                <button className="bottone-primario" onClick={creaPaziente}>Crea paziente</button>

                {messaggio && <p className="messaggio messaggio-errore">{messaggio}</p>}
            </div>
        </div>
    )
}

export default NuovoPaziente;