import { useState } from "react"

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [pazienti, setPazienti] = useState([]);

  const eseguiLogin = async () => {
    const risposta = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password})
    });

    const dati = await risposta.json();

    if (risposta.ok) {
      localStorage.setItem("token", dati.access_token);
      setMessaggio("Login effettuato");
    } else {
      setMessaggio("Credenziali non valide")
    }
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
      console.log(dati);
    } else {
      setMessaggio("Errore durante il caricamento")
    }
  }

  return (
    <div>
      <h1>Gestionale Poliambulatorio</h1>
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
      <button onClick={caricaPazienti}>Carica pazienti</button>
      <p>{messaggio}</p>
    </div>
  )
}

export default App