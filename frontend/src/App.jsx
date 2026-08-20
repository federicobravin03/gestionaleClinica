import { useState, useEffect } from "react";
import Login from "./components/Login";
import ListaPazienti from "./components/ListaPazienti";
import NuovoPaziente from "./components/NuovoPaziente";

function App() {
  const [autenticato, setAutenticato] = useState(localStorage.getItem("token") !== null);
  const [aggiornamento, setAggiornamento] = useState(0);

  const eseguiLogout = () => {
    localStorage.removeItem("token");
    setAutenticato(false);
  }

  const gestioneLogin = () => {
    setAutenticato(true);
  }

  const gestionePazienteCreato = () => {
    setAggiornamento(aggiornamento+1);
  }

  return (
    <div>
      <h1>Gestionale Poliambulatorio</h1>

      {autenticato ? (
        <div>
          <ListaPazienti aggiornamento={aggiornamento}/>
          <NuovoPaziente onPazienteCreato={gestionePazienteCreato}/>
          <button onClick={eseguiLogout}>Logout</button>
        </div>
      ) : (
          <Login onLoginRiuscito={gestioneLogin} />
      )}
    </div>
  )
}

export default App