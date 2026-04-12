"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Dumbbell,
  FileBarChart2,
  LogOut,
  UserPlus,
  Search,
  PlusCircle,
  BarChart3,
  GraduationCap,
} from "lucide-react";

type Usuario = {
  id_usuario: number;
  tipo_usuario: string;
};

type Aluno = {
  id_aluno: number;
};

type AlunoRisco = {
  id_aluno: number;
  nome: string;
  percentual: number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalResponsaveis, setTotalResponsaveis] = useState(0);
  const [totalProfessores, setTotalProfessores] = useState(0);
  const [totalRisco, setTotalRisco] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function carregarDashboard() {
      try {
        const [resAlunos, resUsers, resRisco] = await Promise.all([
          fetch("http://localhost:8000/alunos/"),
          fetch("http://localhost:8000/usuarios/"),
          fetch("http://localhost:8000/relatorios/alunos-risco"),
        ]);

        const alunosData: Aluno[] = await resAlunos.json();
        const usersData: Usuario[] = await resUsers.json();
        const riscoData: AlunoRisco[] = await resRisco.json();

        setTotalAlunos(alunosData.length);
        setTotalResponsaveis(
          usersData.filter((u) => u.tipo_usuario === "responsavel").length
        );
        setTotalProfessores(
          usersData.filter((u) => u.tipo_usuario === "professor").length
        );
        setTotalRisco(riscoData.length);
      } catch (error) {
        console.error("Erro ao carregar métricas do dashboard:", error);
      }
    }

    carregarDashboard();
  }, [router]);

  function sair() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const acoes = [
    {
      titulo: "Cadastrar aluno",
      descricao: "Inicie um novo cadastro no projeto.",
      icone: <UserPlus size={22} />,
      rota: "/dashboard/alunos/novo",
    },
    {
      titulo: "Pesquisar aluno",
      descricao: "Consulte progresso, frequência e situação.",
      icone: <Search size={22} />,
      rota: "/dashboard/alunos",
    },
    {
      titulo: "Gerenciar atividades",
      descricao: "Cadastre e organize atividades recreativas.",
      icone: <PlusCircle size={22} />,
      rota: "/dashboard/atividades",
    },
    {
      titulo: "Ver relatórios",
      descricao: "Acompanhe frequência, risco e status.",
      icone: <BarChart3 size={22} />,
      rota: "/dashboard/relatorios",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-72 bg-slate-900 text-white px-6 py-8 flex flex-col justify-between">
          <div>
            <div className="mb-10">
              <h1 className="text-2xl font-bold tracking-tight text-green-400">
                Foco é Saber
              </h1>
              <p className="text-sm text-slate-300 mt-2">
                Painel administrativo do sistema
              </p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 bg-slate-800 hover:bg-slate-700 transition"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>

              <button
                onClick={() => router.push("/dashboard/responsaveis")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
              >
                <Users size={18} />
                Responsáveis
              </button>

              <button
                onClick={() => router.push("/dashboard/professores")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
              >
                <GraduationCap size={18} />
                Professores
              </button>

              <button
                onClick={() => router.push("/dashboard/alunos")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
              >
                <Users size={18} />
                Alunos
              </button>

              <button
                onClick={() => router.push("/dashboard/indicacoes")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
              >
                <ClipboardList size={18} />
                Indicações
              </button>

              <button
                onClick={() => router.push("/dashboard/atividades")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
              >
                <Dumbbell size={18} />
                Atividades
              </button>

              <button
                onClick={() => router.push("/dashboard/relatorios")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
              >
                <FileBarChart2 size={18} />
                Relatórios
              </button>
            </nav>
          </div>

          <button
            onClick={sair}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-medium hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            Sair
          </button>
        </aside>

        <main className="flex-1 p-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-slate-600 mt-1">
                Visão geral do sistema Foco é Saber.
              </p>
            </div>

            <div className="rounded-2xl bg-white px-5 py-3 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Perfil ativo</p>
              <p className="font-semibold">Administrador</p>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Alunos cadastrados</p>
              <h3 className="text-3xl font-bold mt-2">{totalAlunos}</h3>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Responsáveis</p>
              <h3 className="text-3xl font-bold mt-2">{totalResponsaveis}</h3>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Professores</p>
              <h3 className="text-3xl font-bold mt-2">{totalProfessores}</h3>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Alunos em risco</p>
              <h3 className="text-3xl font-bold mt-2">{totalRisco}</h3>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Ações rápidas</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {acoes.map((acao) => (
                <button
                  key={acao.titulo}
                  onClick={() => router.push(acao.rota)}
                  className="rounded-2xl bg-white border border-slate-200 p-6 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-green-100 p-3 text-green-700">
                    {acao.icone}
                  </div>

                  <h4 className="text-lg font-semibold">{acao.titulo}</h4>
                  <p className="text-slate-600 mt-2">{acao.descricao}</p>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}