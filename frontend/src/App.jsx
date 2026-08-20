import { useState, useEffect } from "react";
import Login from "./components/Login";
import ListaPazienti from "./components/ListaPazienti";

function App() {
  const [autenticato, setAutenticato] = useState(localStorage.getItem("token") !== null)

  const eseguiLogout = () => {
    localStorage.removeItem("token");
    setAutenticato(false);
  }

  const gestioneLogin = () => {
    setAutenticato(true);
  }

  return (
    <div>
      <h1>Gestionale Poliambulatorio</h1>

      {autenticato ? (
        <div>
          <ListaPazienti />
          <button onClick={eseguiLogout}>Logout</button>
        </div>
      ) : (
          <Login onLoginRiuscito={gestioneLogin} />
      )}
    </div>
  )
}

export default App