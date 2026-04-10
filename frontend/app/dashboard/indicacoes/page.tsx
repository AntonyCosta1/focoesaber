"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Indicacao = {
  id_indicacao: number;
  id_aluno: number;
  id_professor: number;
  status_aprovacao: string;
  observacao?: string;
};

export default function IndicacoesPage() {
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarIndicacoes() {
      try {
        const response = await fetch("http://localhost:8000/indicacoes/");
        const data = await response.json();
        setIndicacoes(data);
      } catch (error) {
        console.error("Erro ao carregar indicações:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarIndicacoes();
  }, []);

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Indicações</h1>

      <div style={{ marginBottom: "20px" }}>
        <Link href="/dashboard">Voltar</Link>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : indicacoes.length === 0 ? (
        <p>Nenhuma indicação encontrada.</p>
      ) : (
        <ul>
          {indicacoes.map((indicacao) => (
            <li key={indicacao.id_indicacao} style={{ marginBottom: "12px" }}>
              <strong>Indicação #{indicacao.id_indicacao}</strong> — 
              Aluno: {indicacao.id_aluno} — 
              Professor: {indicacao.id_professor} — 
              Status: {indicacao.status_aprovacao}
              {indicacao.observacao ? ` — Obs: ${indicacao.observacao}` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}