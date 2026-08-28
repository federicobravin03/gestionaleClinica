import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function Dashboard({ onSessioneScaduta }) {
    const [appuntamenti, setAppuntamenti] = useState([]);
    const [medici, setMedici] = useState([]);
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

    const contaStato = (stato) => appuntamenti.filter((a) => a.stato === stato).length;
    const datiGrafico = {
        labels: ["Programmati", "In corso", "Conclusi", "Annullati"],
        datasets: [{
            data: [
                contaStato("Programmato"),
                contaStato("In corso"),
                contaStato("Concluso"),
                contaStato("Annullato")
            ],
            backgroundColor: ["#3A6EA5", "#B57E2E", "#4A9B8E", "#9CA8B4"],
            borderWidth: 0
        }]
    };

    const incassoPerMedico = medici.map((medico) => {
        const suoi = conclusi.filter((a) => a.medico_id === medico.id);
        const somma = suoi.reduce((tot, a) => tot + Number(a.prezzo), 0);
        return { nome: `${medico.utente.cognome}`, somma: somma };
    });

    const caricaMedici = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/medici", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const dati = await risposta.json();

        if (risposta.ok) {
            setMedici(dati);
        } else if (risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante il caricamento");
        }
    }

    const datiIncasso = {
        labels: incassoPerMedico.map((m) => m.nome),
        datasets: [{
            label: "Incasso (€)",
            data: incassoPerMedico.map((m) => m.somma),
            backgroundColor: "#4A9B8E",
            borderRadius: 6
        }]
    };

    useEffect(() => {
        caricaAppuntamenti();
    }, []);

    useEffect(() => {
        caricaAppuntamenti();
        caricaMedici();
    }, []);

    return (
        <>
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
            </div>

            <div className="griglia-grafici">
                <div className="scheda">
                    <h2 className="scheda-titolo">Appuntamenti per stato</h2>
                    <div className="contenitore-grafico">
                        <Doughnut
                            data={datiGrafico}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "bottom",
                                        labels: {
                                            padding: 30
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="scheda">
                    <h2 className="scheda-titolo">Incasso per medico</h2>
                    <div className="contenitore-grafico"><Bar data={datiIncasso} options={{ maintainAspectRatio: false }} /></div>
                </div>
            </div>
            {messaggio && <p className="messaggio messaggio-errore">{messaggio}</p>}

        </>
    )
}

export default Dashboard;