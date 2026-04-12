"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, BarChart3, Search } from "lucide-react";

type RelatorioFrequencia = {
  total_aulas: number;
  presencas: number;
  faltas: number;
  percentual_presenca: number;
};

type AlunoRisco = {
  id_aluno: number;
  nome: string;
  percentual: number;
};

type StatusAluno = {
  id_aluno: number;
  percentual: number;
  status: string;
};

type AlunoBusca = {
  id_aluno: number;
  nome: string;
  matricula: string;
};

export default function RelatoriosPage() {
  const router = useRouter();

  const [nomeAluno, setNomeAluno] = useState("");
  const [idAlunoSelecionado, setIdAlunoSelecionado] = useState<number | null>(null);
  const [nomeSelecionado, setNomeSelecionado] = useState("");

  const [alunosEncontrados, setAlunosEncontrados] = useState<AlunoBusca[]>([]);
  const [frequencia, setFrequencia] = useState<RelatorioFrequencia | null>(null);
  const [statusAluno, setStatusAluno] = useState<StatusAluno | null>(null);
  const [alunosRisco, setAlunosRisco] = useState<AlunoRisco[]>([]);

  async function buscarAlunoPorNome() {
    if (!nomeAluno.trim()) {
      alert("Digite o nome do aluno.");
      return;
    }

    try {
      const response = await fetch(
        `https://focoesaber.onrender.com/alunos/buscar/${encodeURIComponent(nomeAluno)}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Aluno não encontrado");
        setAlunosEncontrados([]);
        setIdAlunoSelecionado(null);
        setNomeSelecionado("");
        return;
      }

      setAlunosEncontrados(data);
      setFrequencia(null);
      setStatusAluno(null);
    } catch (error) {
      console.error("Erro ao buscar aluno:", error);
      alert("Não foi possível buscar o aluno.");
    }
  }

  async function buscarFrequencia() {
    if (!idAlunoSelecionado) {
      alert("Selecione um aluno antes de consultar a frequência.");
      return;
    }

    try {
      const response = await fetch(
        `https://focoesaber.onrender.com/relatorios/frequencia/${idAlunoSelecionado}`
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Erro ao buscar frequência");
        return;
      }

      setFrequencia(data);
    } catch (error) {
      console.error("Erro ao buscar frequência:", error);
    }
  }

  async function buscarStatus() {
    if (!idAlunoSelecionado) {
      alert("Selecione um aluno antes de consultar o status.");
      return;
    }

    try {
      const response = await fetch(
        `https://focoesaber.onrender.com/relatorios/status/${idAlunoSelecionado}`
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Erro ao buscar status");
        return;
      }

      setStatusAluno(data);
    } catch (error) {
      console.error("Erro ao buscar status:", error);
    }
  }

  async function buscarAlunosRisco() {
    try {
      const response = await fetch("https://focoesaber.onrender.com/relatorios/alunos-risco");
      const data = await response.json();
      setAlunosRisco(data);
    } catch (error) {
      console.error("Erro ao buscar alunos em risco:", error);
    }
  }

  function corStatus(status?: string) {
    if (status === "ativo") return "bg-green-100 text-green-700";
    if (status === "risco") return "bg-yellow-100 text-yellow-700";
    if (status === "critico") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => router.push("/dashboard")}
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Voltar ao dashboard
            </button>

            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="mt-1 text-slate-600">
              Consulte frequência, status e alunos em situação de risco.
            </p>
          </div>
        </header>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Consulta por aluno</h2>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative w-full md:max-w-xs">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Digite o nome do aluno"
                value={nomeAluno}
                onChange={(e) => setNomeAluno(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-green-500"
              />
            </div>

            <button
              onClick={buscarAlunoPorNome}
              className="rounded-xl bg-green-500 px-5 py-3 font-medium text-white hover:bg-green-600 transition"
            >
              Buscar aluno
            </button>

            <button
              onClick={buscarFrequencia}
              className="rounded-xl bg-blue-500 px-5 py-3 font-medium text-white hover:bg-blue-600 transition"
            >
              Ver frequência
            </button>

            <button
              onClick={buscarStatus}
              className="rounded-xl bg-indigo-500 px-5 py-3 font-medium text-white hover:bg-indigo-600 transition"
            >
              Ver status
            </button>

            <button
              onClick={buscarAlunosRisco}
              className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white hover:bg-red-600 transition"
            >
              Alunos em risco
            </button>
          </div>

          {alunosEncontrados.length > 0 && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-medium text-slate-700">
                Selecione o aluno encontrado:
              </p>

              <div className="flex flex-col gap-2">
                {alunosEncontrados.map((aluno) => (
                  <button
                    key={aluno.id_aluno}
                    onClick={() => {
                      setIdAlunoSelecionado(aluno.id_aluno);
                      setNomeSelecionado(aluno.nome);
                      setFrequencia(null);
                      setStatusAluno(null);
                    }}
                    className={`rounded-xl border px-4 py-3 text-left transition ${idAlunoSelecionado === aluno.id_aluno
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 bg-white hover:bg-slate-100"
                      }`}
                  >
                    <p className="font-medium text-slate-900">{aluno.nome}</p>
                    <p className="text-sm text-slate-500">
                      Matrícula: {aluno.matricula} | ID interno: {aluno.id_aluno}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {idAlunoSelecionado && (
            <div className="mt-4">
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Aluno selecionado: {nomeSelecionado} (ID {idAlunoSelecionado})
              </span>
            </div>
          )}
        </section>

        {frequencia && (
          <section className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total de aulas</p>
              <h3 className="mt-2 text-3xl font-bold">{frequencia.total_aulas}</h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Presenças</p>
              <h3 className="mt-2 text-3xl font-bold">{frequencia.presencas}</h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Faltas</p>
              <h3 className="mt-2 text-3xl font-bold">{frequencia.faltas}</h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Presença</p>
              <h3 className="mt-2 text-3xl font-bold">
                {frequencia.percentual_presenca}%
              </h3>
            </div>
          </section>
        )}

        {statusAluno && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold">Status do aluno</h2>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <p>
                <strong>ID do aluno:</strong> {statusAluno.id_aluno}
              </p>
              <p>
                <strong>Percentual:</strong> {statusAluno.percentual}%
              </p>
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${corStatus(
                    statusAluno.status
                  )}`}
                >
                  {statusAluno.status}
                </span>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
            <AlertTriangle className="text-red-600" size={20} />
            <h2 className="text-lg font-semibold">Alunos em risco</h2>
          </div>

          {alunosRisco.length === 0 ? (
            <div className="p-6">
              <p className="text-slate-600">Nenhum dado carregado ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Nome</th>
                    <th className="px-6 py-4 font-semibold">Percentual</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-sm">
                  {alunosRisco.map((aluno) => (
                    <tr key={aluno.id_aluno} className="hover:bg-slate-50">
                      <td className="px-6 py-4">{aluno.id_aluno}</td>
                      <td className="px-6 py-4 font-medium">{aluno.nome}</td>
                      <td className="px-6 py-4">{aluno.percentual}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}