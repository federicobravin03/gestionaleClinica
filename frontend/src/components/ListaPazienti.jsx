import { useEffect, useState } from "react";

function ListaPazienti({ aggiornamento }) {
    const [pazienti, setPazienti] = useState([]);
    const [messaggio, setMessaggio] = useState("");
    const [inModifica, setInModifica] = useState(null);

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

    const eliminaPaziente = async (id) => {
        const token = localStorage.getItem("token");

        if (!confirm("Eliminare il paziente?")) {
            return;
        }

        const risposta = await fetch(`http://localhost:8000/pazienti/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (risposta.ok) {
            caricaPazienti();
        } else {
            setMessaggio("Errore durante l'eliminazione");
        }
    }

    const salvaModifica = async () => {
        const token = localStorage.getItem("token");

        const risposta = await fetch(`http://localhost:8000/pazienti/${inModifica.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(inModifica)
        });

        if (risposta.ok) {
            setInModifica(null);
            caricaPazienti();
        } else {
            setMessaggio("Errore durante la modifica");
        }
    }

    const aggiornaCampoModifica = (campo, valore) => {
        setInModifica({ ...inModifica, [campo]: valore });
    }

    useEffect(() => {
        caricaPazienti();
    }, [aggiornamento])

    return (
        <div>
            <ul>
                {pazienti.map((paziente) => (
                    <li key={paziente.id}>
                        {paziente.nome} {paziente.cognome}

                        {inModifica && inModifica.id === paziente.id ? (
                            <span>
                                <input
                                    type="text"
                                    value={inModifica.telefono}
                                    onChange={(e) => aggiornaCampoModifica("telefono", e.target.value)}
                                />
                                <input
                                    type="text"
                                    value={inModifica.email || ""}
                                    onChange={(e) => aggiornaCampoModifica("email", e.target.value)}
                                />
                                <input
                                    type="text"
                                    value={inModifica.indirizzo}
                                    onChange={(e) => aggiornaCampoModifica("indirizzo", e.target.value)}
                                />

                                <button onClick={salvaModifica}>Salva</button>
                                <button onClick={() => setInModifica(null)}>Annulla</button>
                            </span>
                        ) : (
                            <span>
                                <button onClick={() => eliminaPaziente(paziente.id)}>Elimina</button>
                                <button onClick={() => setInModifica(paziente)}>Modifica</button>
                            </span>    
                        )}

                    </li>
                ))}
            </ul>
            <p>{messaggio}</p>
        </div>
    )
}

export default ListaPazienti;