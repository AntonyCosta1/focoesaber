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
import { API_URL } from "@/lib/api";

type Usuario = {
  id_usuario: number;
  nome: string;
  email: string;
  tipo_usuario: "admin" | "professor" | "responsavel";
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

  const [usuario, setUsuario] = useState<Usuario | null>(null);
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

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    async function carregarDashboard() {
      try {
        const resMe = await fetch(`${API_URL}/usuarios/me`, { headers });

        if (!resMe.ok) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const usuarioLogado: Usuario = await resMe.json();
        setUsuario(usuarioLogado);

        const resAlunos = await fetch(`${API_URL}/alunos/`, { headers });
        const alunosData: Aluno[] = resAlunos.ok ? await resAlunos.json() : [];
        setTotalAlunos(alunosData.length);

        if (usuarioLogado.tipo_usuario === "admin") {
          const resUsers = await fetch(`${API_URL}/usuarios/`, { headers });
          const usersData: Usuario[] = resUsers.ok ? await resUsers.json() : [];

          setTotalResponsaveis(
            usersData.filter((u) => u.tipo_usuario === "responsavel").length
          );

          setTotalProfessores(
            usersData.filter((u) => u.tipo_usuario === "professor").length
          );
        }

        if (
          usuarioLogado.tipo_usuario === "admin" ||
          usuarioLogado.tipo_usuario === "professor"
        ) {
          const resRisco = await fetch(`${API_URL}/relatorios/alunos-risco`, {
            headers,
          });

          const riscoData: AlunoRisco[] = resRisco.ok
            ? await resRisco.json()
            : [];

          setTotalRisco(riscoData.length);
        }
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

  function nomePerfil(tipo?: string) {
    if (tipo === "admin") return "Administrador";
    if (tipo === "professor") return "Professor";
    if (tipo === "responsavel") return "Responsável";
    return "Carregando...";
  }

  const tipoUsuario = usuario?.tipo_usuario;

  const acoes = [
    {
      titulo: "Cadastrar aluno",
      descricao: "Inicie um novo cadastro no projeto.",
      icone: <UserPlus size={22} />,
      rota: "/dashboard/alunos/novo_aluno",
      perfis: ["admin", "professor"],
    },
    {
      titulo: "Pesquisar aluno",
      descricao: "Consulte progresso, frequência e situação.",
      icone: <Search size={22} />,
      rota: "/dashboard/alunos",
      perfis: ["admin", "professor"],
    },
    {
      titulo: "Meus alunos",
      descricao: "Acompanhe frequência, desempenho e progresso.",
      icone: <Search size={22} />,
      rota: "/dashboard/alunos",
      perfis: ["responsavel"],
    },
    {
      titulo: "Gerenciar atividades",
      descricao: "Cadastre e organize atividades recreativas.",
      icone: <PlusCircle size={22} />,
      rota: "/dashboard/atividades",
      perfis: ["admin"],
    },
    {
      titulo: "Ver relatórios",
      descricao: "Acompanhe frequência, risco e status.",
      icone: <BarChart3 size={22} />,
      rota: "/dashboard/relatorios",
      perfis: ["admin", "professor"],
    },
  ];

  const acoesFiltradas = acoes.filter(
    (acao) => tipoUsuario && acao.perfis.includes(tipoUsuario)
  );

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
                Painel do sistema
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

              {tipoUsuario === "admin" && (
                <>
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
                    onClick={() => router.push("/dashboard/atividades")}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
                  >
                    <Dumbbell size={18} />
                    Atividades
                  </button>
                </>
              )}

              {(tipoUsuario === "admin" || tipoUsuario === "professor") && (
                <>
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
                    onClick={() => router.push("/dashboard/relatorios")}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
                  >
                    <FileBarChart2 size={18} />
                    Relatórios
                  </button>
                </>
              )}

              {tipoUsuario === "responsavel" && (
                <button
                  onClick={() => router.push("/dashboard/alunos")}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
                >
                  <Users size={18} />
                  Meus alunos
                </button>
              )}
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
              <p className="font-semibold">{nomePerfil(tipoUsuario)}</p>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">
                {tipoUsuario === "responsavel"
                  ? "Meus alunos"
                  : "Alunos cadastrados"}
              </p>
              <h3 className="text-3xl font-bold mt-2">{totalAlunos}</h3>
            </div>

            {tipoUsuario === "admin" && (
              <>
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                  <p className="text-sm text-slate-500">Responsáveis</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {totalResponsaveis}
                  </h3>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                  <p className="text-sm text-slate-500">Professores</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {totalProfessores}
                  </h3>
                </div>
              </>
            )}

            {(tipoUsuario === "admin" || tipoUsuario === "professor") && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <p className="text-sm text-slate-500">Alunos em risco</p>
                <h3 className="text-3xl font-bold mt-2">{totalRisco}</h3>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Ações rápidas</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {acoesFiltradas.map((acao) => (
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