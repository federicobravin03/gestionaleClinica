import { useEffect, useState } from "react";

function RiepilogoBarra({ onSessioneScaduta }) {
    const [appuntamenti, setAppuntamenti] = useState([]);

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

    useEffect(() => {
        caricaAppuntamenti();
    }, []);

    const oggi = new Date().toDateString();
    const diOggi = appuntamenti.filter((a) => new Date(a.dataOra).toDateString() === oggi).length;
    const programmati = appuntamenti.filter((a) => a.stato === "Programmato").length;

    return (
        <div className="riepilogo-barra">
            <div className="riepilogo-voce">
                <span className="riepilogo-numero">{diOggi}</span>
                <span className="riepilogo-etichetta">Appuntamenti oggi</span>
            </div>
            <div className="riepilogo-voce">
                <span className="riepilogo-numero">{programmati}</span>
                <span className="riepilogo-etichetta">In programma</span>
            </div>
        </div>
    )
}

export default RiepilogoBarra;