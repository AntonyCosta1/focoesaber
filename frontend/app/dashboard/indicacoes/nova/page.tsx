"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, ClipboardPlus } from "lucide-react";

type Aluno = {
  id_aluno: number;
  nome: string;
};

type Usuario = {
  id_usuario: number;
  nome: string;
  tipo_usuario: string;
};

export default function NovaIndicacaoPage() {
  const router = useRouter();

  const [idAluno, setIdAluno] = useState("");
  const [idProfessor, setIdProfessor] = useState("");
  const [observacao, setObservacao] = useState("");

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [professores, setProfessores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function carregarDados() {
      try {
        const [resAlunos, resUsuarios] = await Promise.all([
          fetch("http://localhost:8000/alunos/"),
          fetch("http://localhost:8000/users/"),
        ]);

        const dataAlunos = await resAlunos.json();
        const dataUsuarios = await resUsuarios.json();

        setAlunos(dataAlunos);
        setProfessores(
          dataUsuarios.filter((usuario: Usuario) => usuario.tipo_usuario === "professor")
        );
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    carregarDados();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!idAluno || !idProfessor) {
      alert("Selecione aluno e professor.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://focoesaber.onrender.com/indicacoes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_aluno: Number(idAluno),
          id_professor: Number(idProfessor),
          observacao,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Erro ao criar indicação");
        setLoading(false);
        return;
      }

      alert("Indicação criada com sucesso!");
      router.push("/dashboard/indicacoes");
    } catch (error) {
      console.error("Erro ao criar indicação:", error);
      alert("Não foi possível conectar ao backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <button
            onClick={() => router.push("/dashboard/indicacoes")}
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Voltar para indicações
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-green-100 p-3 text-green-700">
              <ClipboardPlus size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">Nova indicação</h1>
              <p className="mt-1 text-slate-600">
                Registre uma nova indicação de aluno para o projeto.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Aluno
              </label>
              <select
                value={idAluno}
                onChange={(e) => setIdAluno(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
              >
                <option value="">Selecione um aluno</option>
                {alunos.map((aluno) => (
                  <option key={aluno.id_aluno} value={aluno.id_aluno}>
                    {aluno.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Professor
              </label>
              <select
                value={idProfessor}
                onChange={(e) => setIdProfessor(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
              >
                <option value="">Selecione um professor</option>
                {professores.map((professor) => (
                  <option key={professor.id_usuario} value={professor.id_usuario}>
                    {professor.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Observação
              </label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Descreva o motivo da indicação"
                rows={5}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-white shadow-sm hover:bg-green-600 transition disabled:opacity-60"
              >
                <Save size={18} />
                {loading ? "Salvando..." : "Criar indicação"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}