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

const leggiUtente = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  return JSON.parse(atob(token.split(".")[1]));
}

function App() {
  const [autenticato, setAutenticato] = useState(localStorage.getItem("token") !== null);
  const [aggiornamento, setAggiornamento] = useState(0);
  const [sezione, setSezione] = useState("pazienti");
  const [messaggio, setMessaggio] = useState("");
  const [utente, setUtente] = useState(leggiUtente());
  const titoloSezione = {
    pazienti: "Pazienti",
    medici: "Medici",
    appuntamenti: "Appuntamenti",
    utenti: "Utenti"
  }

  const eseguiLogout = () => {
    localStorage.removeItem("token");
    setAutenticato(false);
    setUtente(null);
    setSezione("pazienti");
  }

  const gestioneLogin = () => {
    setAutenticato(true);
    setUtente(leggiUtente());
  }

  const gestionePazienteCreato = () => {
    setAggiornamento(aggiornamento + 1);
  }

  const gestioneSessioneScaduta = () => {
    localStorage.removeItem("token");
    setAutenticato(false);
    setMessaggio("Sessione scaduta, effettuare nuovamente il login");
    setSezione("pazienti");
    setUtente(null);
  }

  return (
    <div className="app">
      {autenticato ? (
        <div className="app-layout">
          <aside className="barra-laterale">
            <span className="barra-titolo">Gestionale Poliambulatorio</span>

            <nav className="navigazione">
              <button className="nav-voce" onClick={() => setSezione("pazienti")} disabled={sezione === "pazienti"}>Pazienti</button>
              <button className="nav-voce" onClick={() => setSezione("medici")} disabled={sezione === "medici"}>Medici</button>
              <button className="nav-voce" onClick={() => setSezione("appuntamenti")} disabled={sezione === "appuntamenti"}>Appuntamenti</button>
              {utente?.ruolo === "Admin" && (
                <button className="nav-voce" onClick={() => setSezione("utenti")} disabled={sezione === "utenti"}>Utenti</button>
              )}
            </nav>
          </aside>

          <div className="area-principale">
            <div className="intestazione">
              <span className="titolo-sezione">{titoloSezione[sezione]}</span>
              <div className="barra-destra">
                <span className="barra-utente">{utente?.nome} {utente?.cognome} · {utente?.ruolo}</span>
                <button className="bottone-esci" onClick={eseguiLogout}>Esci</button>
              </div>
            </div>


            <div className="contenuto">
              {sezione === "pazienti" && (
                <div>
                  <ListaPazienti aggiornamento={aggiornamento} ruolo={utente?.ruolo} onSessioneScaduta={gestioneSessioneScaduta} />
                  {(utente?.ruolo === "Admin" || utente?.ruolo === "Segreteria") && <NuovoPaziente onPazienteCreato={gestionePazienteCreato} onSessioneScaduta={gestioneSessioneScaduta} />}
                </div>
              )}

              {sezione === "medici" && (
                <div>
                  <ListaMedici aggiornamento={aggiornamento} ruolo={utente?.ruolo} onSessioneScaduta={gestioneSessioneScaduta} />
                  {utente?.ruolo === "Admin" && <NuovoMedico onMedicoCreato={gestionePazienteCreato} onSessioneScaduta={gestioneSessioneScaduta} />}
                </div>
              )}

              {sezione === "appuntamenti" && (
                <div>
                  <ListaAppuntamenti aggiornamento={aggiornamento} ruolo={utente?.ruolo} onSessioneScaduta={gestioneSessioneScaduta} />
                  {(utente?.ruolo === "Admin" || utente?.ruolo === "Segreteria") && <NuovoAppuntamento onAppuntamentoCreato={gestionePazienteCreato} onSessioneScaduta={gestioneSessioneScaduta} />}
                </div>
              )}

              {sezione === "utenti" && utente?.ruolo === "Admin" && (
                <div>
                  <ListaUtenti aggiornamento={aggiornamento} ruolo={utente?.ruolo} onSessioneScaduta={gestioneSessioneScaduta} />
                  <NuovoUtente onUtenteCreato={gestionePazienteCreato} onSessioneScaduta={gestioneSessioneScaduta} />
                </div>
              )}
            </div>
          </div>  
        </div>
      ) : (
        <Login onLoginRiuscito={gestioneLogin} />
      )}
    </div>
  )
}

export default App