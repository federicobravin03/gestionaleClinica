import { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login";
import ListaPazienti from "./components/ListaPazienti";
import NuovoPaziente from "./components/NuovoPaziente";
import ListaAppuntamenti from "./components/ListaAppuntamenti";
import NuovoAppuntamento from "./components/NuovoAppuntamento";
import ListaMedici from "./components/ListaMedici";
import NuovoMedico from "./components/NuovoMedico";
import ListaUtenti from "./components/ListaUtenti";
import NuovoUtente from "./components/NuovoUtente";

const leggiRuolo = () => {
  const token = localStorage.getItem("token");
  if(!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.ruolo;
}

function App() {
  const [autenticato, setAutenticato] = useState(localStorage.getItem("token") !== null);
  const [aggiornamento, setAggiornamento] = useState(0);
  const [sezione, setSezione] = useState("pazienti");
  const [messaggio, setMessaggio] = useState("");
  const [ruolo, setRuolo] = useState(leggiRuolo());

  const eseguiLogout = () => {
    localStorage.removeItem("token");
    setAutenticato(false);
    setRuolo(null);
    setSezione("pazienti");
  }

  const gestioneLogin = () => {
    setAutenticato(true);
    setRuolo(leggiRuolo());
  }

  const gestionePazienteCreato = () => {
    setAggiornamento(aggiornamento + 1);
  }

  const gestioneSessioneScaduta = () => {
    localStorage.removeItem("token");
    setAutenticato(false);
    setMessaggio("Sessione scaduta, effettuare nuovamente il login");
    setSezione("pazienti");
    setRuolo(null);
  }

  return (
    <div className="app">
      {autenticato ? (
        <div>
          <div className="barra-superiore">
            <span className="barra-titolo">Gestionale Poliambulatorio</span>
            <button className="bottone-esci" onClick={eseguiLogout}>Esci</button>
          </div>

          <nav className="navigazione">
            <button className="nav-voce" onClick={() => setSezione("pazienti")} disabled={sezione === "pazienti"}>Pazienti</button>
            <button className="nav-voce" onClick={() => setSezione("medici")} disabled={sezione === "medici"}>Medici</button>
            <button className="nav-voce" onClick={() => setSezione("appuntamenti")} disabled={sezione === "appuntamenti"}>Appuntamenti</button>
            {ruolo === "Admin" && (
              <button className="nav-voce" onClick={() => setSezione("utenti")} disabled={sezione === "utenti"}>Utenti</button>
            )}
          </nav>

          <div className="contenuto">
            {sezione === "pazienti" && (
              <div>
                <ListaPazienti aggiornamento={aggiornamento} ruolo={ruolo} onSessioneScaduta={gestioneSessioneScaduta} />
                {(ruolo === "Admin" || ruolo === "Segreteria") && <NuovoPaziente onPazienteCreato={gestionePazienteCreato} onSessioneScaduta={gestioneSessioneScaduta} />}
              </div>
            )}

            {sezione === "medici" && (
              <div>
                <ListaMedici aggiornamento={aggiornamento} ruolo={ruolo} onSessioneScaduta={gestioneSessioneScaduta} />
                {ruolo === "Admin" && <NuovoMedico onMedicoCreato={gestionePazienteCreato} onSessioneScaduta={gestioneSessioneScaduta} />}
              </div>
            )}

            {sezione === "appuntamenti" && (
              <div>
                <ListaAppuntamenti aggiornamento={aggiornamento} ruolo={ruolo} onSessioneScaduta={gestioneSessioneScaduta} />
                {(ruolo === "Admin" || ruolo === "Segreteria") && <NuovoAppuntamento onAppuntamentoCreato={gestionePazienteCreato} onSessioneScaduta={gestioneSessioneScaduta} />}
              </div>
            )}

            {sezione === "utenti" && ruolo === "Admin" && (
              <div>
                <ListaUtenti aggiornamento={aggiornamento} ruolo={ruolo} onSessioneScaduta={gestioneSessioneScaduta} />
                <NuovoUtente onUtenteCreato={gestionePazienteCreato} onSessioneScaduta={gestioneSessioneScaduta} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Login onLoginRiuscito={gestioneLogin} />
      )}
    </div>
  )
}

export default App