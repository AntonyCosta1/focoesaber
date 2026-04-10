"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    function sair(){
        localStorage.removeItem("token");
        router.push("/login");
    }

    return (
        <div style={{ padding: 40}}>
            <h1>Pagina Inicial - Foco é Saber</h1>
            <p>Bem-vindo ao Sistema!</p>

            <div style={{
                marginTop: "30px",
                display: "flex", 
                gap: "10px", 
                flexWrap: "wrap" 
            }}>
            <button onClick={() => router.push("/dashboard/alunos")}>Alunos</button>
            <button onClick={() => router.push("/dashboard/indicacoes")}>Indicações</button>
            <button onClick={() => router.push("/dashboard/atividades")}>Atividades</button>
            <button onClick={() => router.push("/dashboard/relatorios")}>Relatórios</button>
            <button onClick={sair}>Sair</button>
        </div>
        </div>
    );
}