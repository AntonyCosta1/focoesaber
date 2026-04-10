"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const router = useRouter();


    async function handleLogin() {
        const response = await fetch("http://127.0.0.1:8000/login/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Data:", data);

        if (!response.ok) {
            alert("Login falhou: " + (data.detail || "Erro ao fazer login"));
            return;
        }

        localStorage.setItem("token", data.access_token);
        console.log("Token salvo");

        router.push("/dashboard");
        console.log("Redirecionando para dashboard");


    }
    
    return (
        <div style={{ padding: 40}}>
            <h1>Login</h1>
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br /><br />
            <input
                placeholder="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />
            <button onClick={handleLogin}>Entrar</button>
        </div>
    );
}