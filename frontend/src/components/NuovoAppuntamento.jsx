import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function NuovoAppuntamento({ onAppuntamentoCreato, onSessioneScaduta, onChiudi }) {
    const [pazienti, setPazienti] = useState([]);
    const [medici, setMedici] = useState([]);
    const [dataSelezionata, setDataSelezionata] = useState(null);
    const [messaggio, setMessaggio] = useState("");
    const [dati, setDati] = useState({
        ora: "",
        paziente_id: "",
        medico_id: ""
    });

    const aggiornaCampo = (campo, valore) => {
        setDati({ ...dati, [campo]: valore });
    }

    const creaAppuntamento = async () => {
        if (dataSelezionata === null || dati.ora === "" || dati.paziente_id === "" || dati.medico_id === "") {
            setMessaggio("Compilare tutti i campi");
            return;
        }
        
        const anno = dataSelezionata.getFullYear();
        const mese = String(dataSelezionata.getMonth() + 1).padStart(2, "0");
        const giorno = String(dataSelezionata.getDate()).padStart(2, "0");

        const daInviare = {
            dataOra: `${anno}-${mese}-${giorno}T${dati.ora}:00`,
            paziente_id: dati.paziente_id,
            medico_id: dati.medico_id
        }

        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/appuntamenti", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(daInviare)
        });

        if (risposta.ok) {
            setDati({
                data: "",
                ora: "",
                paziente_id: "",
                medico_id: ""
            })
            setDataSelezionata(null);
            onAppuntamentoCreato();
            setMessaggio("Appuntamento creato con successo");
        } else if (risposta.status === 401) {
            onSessioneScaduta();
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
        } else if (risposta.status === 401) {
            onSessioneScaduta();
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
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante il caricamento");
        }
    }

    useEffect(() => {
        caricaPazienti();
        caricaMedici();
    }, [])

    return (
        <div className="velo">
            <div className="modale">
                <div className="modale-intestazione">
                    <h2 className="scheda-titolo">Nuovo appuntamento</h2>
                    <button className="chiudi-modale" onClick={onChiudi}>×</button>
                </div>

                <div className="form-griglia">
                    <div className="campo campo-intero">
                        <label>Paziente</label>
                        <select value={dati.paziente_id} onChange={(e) => aggiornaCampo("paziente_id", e.target.value)}>
                            <option value="">Seleziona paziente</option>
                            {pazienti.map((paziente) => (
                                <option key={paziente.id} value={paziente.id}>{paziente.nome} {paziente.cognome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="campo campo-intero">
                        <label>Medico</label>
                        <select value={dati.medico_id} onChange={(e) => aggiornaCampo("medico_id", e.target.value)}>
                            <option value="">Seleziona medico</option>
                            {medici.map((medico) => (
                                <option key={medico.id} value={medico.id}>{medico.utente.nome} {medico.utente.cognome} — {medico.specializzazione}</option>
                            ))}
                        </select>
                    </div>

                    <div className="campo">
                        <label>Data</label>
                        <DatePicker
                            selected={dataSelezionata}
                            onChange={(data) => setDataSelezionata(data)}
                            minDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Seleziona data"
                        />
                    </div>
                    
                    <div className="campo">
                        <label>Orario</label>
                        <select value={dati.ora} onChange={(e) => aggiornaCampo("ora", e.target.value)}>
                            <option value="">Seleziona orario</option>
                            {["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00"].map((ora) =>(<option key={ora} value={ora}>{ora}</option>))}
                        </select>
                    </div>
                </div>

                <button className="bottone-primario" onClick={creaAppuntamento}>Crea appuntamento</button>

                {messaggio && <p className="messaggio messaggio-errore">{messaggio}</p>}
            </div>
        </div>
    )
}

export default NuovoAppuntamento;