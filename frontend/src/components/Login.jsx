import { useState } from "react";

function Login({ onLoginRiuscito }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [messaggio, setMessaggio] = useState("");

    const eseguiLogin = async () => {
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
    }

    return (
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
            
            <p>{messaggio}</p>
        </div>
    )
}

export default Login;