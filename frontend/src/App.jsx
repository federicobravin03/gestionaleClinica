import { useState, useEffect } from "react";
import Login from "./components/Login";
import ListaPazienti from "./components/ListaPazienti";
import NuovoPaziente from "./components/NuovoPaziente";
import ListaAppuntamenti from "./components/ListaAppuntamenti";
import NuovoAppuntamento from "./components/NuovoAppuntamento";
import ListaMedici from "./components/ListaMedici";
import NuovoMedico from "./components/NuovoMedico";

function App() {
  const [autenticato, setAutenticato] = useState(localStorage.getItem("token") !== null);
  const [aggiornamento, setAggiornamento] = useState(0);
  const [sezione, setSezione] = useState("pazienti");
  const [messaggio, setMessaggio] = useState("");

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

  const gestioneSessioneScaduta = () => {
    localStorage.removeItem("token");
    setAutenticato(false);
    setMessaggio("Sessione scaduta, effettuare nuovamente il login");
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
              <ListaPazienti aggiornamento={aggiornamento} onSessioneScaduta={gestioneSessioneScaduta} />
              <NuovoPaziente onPazienteCreato={gestionePazienteCreato} onSessioneScaduta={gestioneSessioneScaduta} />
            </div>
          )}

          {sezione === "medici" && (
            <div>
              <ListaMedici aggiornamento={aggiornamento} onSessioneScaduta={gestioneSessioneScaduta} />
              <NuovoMedico onMedicoCreato={gestionePazienteCreato} onSessioneScaduta={gestioneSessioneScaduta} />
            </div>
          )}

          {sezione === "appuntamenti" && (
            <div>
              <ListaAppuntamenti aggiornamento={aggiornamento} onSessioneScaduta={gestioneSessioneScaduta} />
              <NuovoAppuntamento onAppuntamentoCreato={gestionePazienteCreato} onSessioneScaduta={gestioneSessioneScaduta} />
            </div>
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