"use client";

import { useEffect, useState } from "react";

type Indicacao = {
  id_indicacao: number;
  id_aluno: number;
  id_professor: number;
  status_aprovacao: string;
  observacao?: string;
};

export default function IndicacoesPage() {
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>([]);

  useEffect(() => {
    async function carregarIndicacoes() {
      try {
        const response = await fetch("http://localhost:8000/indicacoes/");
        const data = await response.json();
        setIndicacoes(data);
      } catch (error) {
        console.error("Erro ao carregar indicações:", error);
      }
    }

    carregarIndicacoes();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Indicações</h1>

      {indicacoes.length === 0 ? (
        <p>Nenhuma indicação encontrada.</p>
      ) : (
        <ul>
          {indicacoes.map((indicacao) => (
            <li key={indicacao.id_indicacao}>
              Indicação #{indicacao.id_indicacao} - Aluno {indicacao.id_aluno} - Status: {indicacao.status_aprovacao}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}