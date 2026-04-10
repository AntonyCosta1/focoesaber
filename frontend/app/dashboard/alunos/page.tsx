"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


type Aluno = {
  id_aluno: number;
  nome: string;
  matricula: string;
  id_escola: number;
  id_responsavel: number;
};

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const response = await fetch("http://localhost:8000/alunos/");
        const data = await response.json();
        setAlunos(data);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarAlunos();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Alunos</h1>
      <Link href="/dashboard">Voltar</Link>

      {loading ? (
        <p>Carregando..</p>
      ) : alunos.length === 0 ? (
        <p>Nenhum aluno encontrado.</p>
      ) : (
        <ul style={{ marginTop: "20px" }}>
          {alunos.map((aluno) => (
            <li key={aluno.id_aluno} style={{ marginBottom: "10px" }}>
              <strong>{aluno.nome}</strong> - Matrícula: {aluno.matricula}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}