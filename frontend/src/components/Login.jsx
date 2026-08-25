import { useState } from "react";
import "./Login.css";

function Login({ onLoginRiuscito }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [messaggio, setMessaggio] = useState("");
    const [caricamento, setCariamento] = useState(false);

    const eseguiLogin = async () => {
        setCariamento(true);

        const risposta = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password })
        });

        const dati = await risposta.json();

        if(risposta.ok) {
            localStorage.setItem("token", dati.access_token);
            onLoginRiuscito();
        } else {
            setMessaggio("Credenziali non valide");
        }

        setCariamento(false);
    }

    return (
        <div className="login-pagina">
        <div className="login-scheda">
            <h1 className="login-titolo">Gestionale Poliambulatorio</h1>
            <p className="login-sottotitolo">Accedi per gestire agende e pazienti</p>

            <div className="campo">
                <label>Nome utente</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {if(e.key === "Enter") eseguiLogin();}}
                />
            </div>

            <div className="campo">
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {if(e.key === "Enter") eseguiLogin();}}
                />
            </div>

            <button className="bottone-primario" onClick={eseguiLogin} disabled={caricamento}>Accedi</button>

            {messaggio && <p className="messaggio-errore">{messaggio}</p>}
        </div>
    </div>
    )
}

export default Login;