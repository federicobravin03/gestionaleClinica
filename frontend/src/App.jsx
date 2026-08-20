import { useState, useEffect } from "react";
import Login from "./components/Login";
import ListaPazienti from "./components/ListaPazienti";
import NuovoPaziente from "./components/NuovoPaziente";

function App() {
  const [autenticato, setAutenticato] = useState(localStorage.getItem("token") !== null);
  const [aggiornamento, setAggiornamento] = useState(0);
  const [sezione, setSezione] = useState("pazienti");

  const eseguiLogout = () => {
    localStorage.removeItem("token");
    setAutenticato(false);
  }

  const gestioneLogin = () => {
    setAutenticato(true);
  }

  const gestionePazienteCreato = () => {
    setAggiornamento(aggiornamento + 1);
  }

  return (
    <div>
      <h1>Gestionale Poliambulatorio</h1>

      {autenticato ? (
        <div>
          <nav>
            <button onClick={() => setSezione("pazienti")} disabled={sezione === "pazienti"}>Pazienti</button>
            <button onClick={() => setSezione("medici")} disabled={sezione === "medici"}>Medici</button>
            <button onClick={() => setSezione("appuntamenti")} disabled={sezione === "appuntamenti"}>Appuntamenti</button>
          </nav>

          {sezione === "pazienti" && (
            <div>
              <ListaPazienti aggiornamento={aggiornamento} />
              <NuovoPaziente onPazienteCreato={gestionePazienteCreato} />
            </div>
          )}

          {sezione === "medici" && (
            <p>Sezione medici da realizzare</p>
          )}

          {sezione === "appuntamenti" && (
            <p>Sezione appuntamenti da realizzare</p>
          )}

          <button onClick={eseguiLogout}>Logout</button>
        </div>
      ) : (
        <Login onLoginRiuscito={gestioneLogin} />
      )}
    </div>
  )
}

export default App