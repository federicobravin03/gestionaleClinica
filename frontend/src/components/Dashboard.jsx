import { useEffect, useState } from "react";

function Dashboard({ onSessioneScaduta }) {
    const [appuntamenti, setAppuntamenti] = useState([]);
    const [messaggio, setMessaggio] = useState("");

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
            setMessaggio(dati.detail);
        }
    }

    const conclusi = appuntamenti.filter((a) => a.stato === "Concluso");
    const totale = conclusi.reduce((somma, a) => somma + Number(a.prezzo), 0);
    const media = conclusi.length > 0 ? totale / conclusi.length : 0;

    useEffect(() => {
        caricaAppuntamenti();
    }, []);

    return (
        <div className="scheda">
            <h2 className="scheda-titolo">Riepilogo economico</h2>

            <div className="griglia-statistiche">
                <div className="statistica">
                    <span className="statistica-valore">€{totale.toFixed(2)}</span>
                    <span className="statistica-etichetta">Incasso totale</span>
                </div>
                <div className="statistica">
                    <span className="statistica-valore">{conclusi.length}</span>
                    <span className="statistica-etichetta">Visite concluse</span>
                </div>
                <div className="statistica">
                    <span className="statistica-valore">€{media.toFixed(2)}</span>
                    <span className="statistica-etichetta">Valore medio</span>
                </div>
            </div>

            {messaggio && <p className="messaggio messaggio-errore">{messaggio}</p>}
        </div>
    )
}

export default Dashboard;