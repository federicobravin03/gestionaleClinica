import { useEffect, useState } from "react";

function ListaPazienti({aggiornamento}) {
    const [pazienti, setPazienti] = useState([]);
    const [messaggio, setMessaggio] = useState("");

    const caricaPazienti = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/pazienti", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const dati = await risposta.json();

        if (risposta.ok) {
            setPazienti(dati);
        } else {
            setMessaggio("Errore durante il caricamento")
        }
    }

    useEffect(() => {
        caricaPazienti();
    }, [aggiornamento])

    return (
        <div>
            <ul>
                {pazienti.map((paziente) => (
                    <li key={paziente.id}>{paziente.nome} {paziente.cognome}</li>
                ))}
            </ul>
            <p>{messaggio}</p>
        </div>
    )
}

export default ListaPazienti;