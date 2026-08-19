import { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [pazienti, setPazienti] = useState([]);
  const [autenticato, setAutenticato] = useState(localStorage.getItem("token") !== null)

  const eseguiLogin = async () => {
    const risposta = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password })
    });

    const dati = await risposta.json();

    if (risposta.ok) {
      localStorage.setItem("token", dati.access_token);
      setAutenticato(true);
      setMessaggio("Login effettuato");
    } else {
      setMessaggio("Credenziali non valide");
    }
  }

  const eseguiLogout = () => {
    localStorage.removeItem("token");
    setAutenticato(false);
    setPazienti([]);
    setMessaggio("");
  }

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
    if(autenticato) {
      caricaPazienti();
    }
  }, [autenticato])

  return (
    <div>
      <h1>Gestionale Poliambulatorio</h1>

      {autenticato ? (
        <div>
          <ul>
            {pazienti.map((paziente) => (
              <li key={paziente.id}>{paziente.nome} {paziente.cognome}</li>
            ))}
          </ul>

          <button onClick = {eseguiLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={eseguiLogin}>Accedi</button>
        </div>
      )}

      <p>{messaggio}</p>

    </div>
  )
}

export default App