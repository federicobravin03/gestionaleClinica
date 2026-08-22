import { useEffect, useState } from "react";

function ListaMedici({aggiornamento, onSessioneScaduta}) {
    const [medici, setMedici] = useState([]);
    const [messaggio, setMessaggio] = useState("");

    const caricaMedici = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch("http://localhost:8000/medici", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const dati = await risposta.json();

        if(risposta.ok) {
            setMedici(dati);
        } else if(risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante il caricamento");
        }
    }

    const eliminaMedico = async (id) => {
        const token = localStorage.getItem("token");

        if(!confirm("Eliminare il medico?")) {
            return;
        }

        const risposta = await fetch(`http://localhost:8000/medici/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if(risposta.ok) {
            caricaMedici();
        } else if(risposta.status === 401) {
            onSessioneScaduta();
        } else {
            setMessaggio("Errore durante l'eliminazione");
        }
    }

    useEffect(() => {
        caricaMedici();
    }, [aggiornamento])

    return(
        <div>
            <ul>
                {medici.map((medico) => (
                    <li key={medico.id}>
                        {medico.utente.nome} {medico.utente.cognome} - {medico.specializzazione} (Numero albo: {medico.numeroAlbo})
                        <button onClick={() => eliminaMedico(medico.id)}>Elimina</button>
                    </li>
                ))}
            </ul>
            <p>{messaggio}</p>
        </div>
    )
} 

export default ListaMedici;