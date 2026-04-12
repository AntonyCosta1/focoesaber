"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UserPlus } from "lucide-react";

type Escola = {
  id_escola: number;
  nome: string;
};

type Usuario = {
  id_usuario: number;
  nome: string;
  tipo_usuario: string;
};

export default function NovoAlunoPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [matricula, setMatricula] = useState("");
  const [idEscola, setIdEscola] = useState("");
  const [idResponsavel, setIdResponsavel] = useState("");

  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [responsaveis, setResponsaveis] = useState<Usuario[]>([]);
  const [buscaResponsavel, setBuscaResponsavel] = useState("");
  const [loading, setLoading] = useState(false);
  const [buscandoResponsavel, setBuscandoResponsavel] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function carregarDados() {
      try {
        const resEscolas = await fetch("https://focoesaber.onrender.com/escolas/");

        if (!resEscolas.ok) {
          throw new Error("Erro ao carregar escolas");
        }

        const dataEscolas = await resEscolas.json();
        setEscolas(dataEscolas);
      } catch (error) {
        console.error("Erro ao carregar dados do formulário:", error);
      }
    }

    carregarDados();
  }, [router]);

  async function buscarResponsavelPorNome(nomeBusca: string) {
    if (!nomeBusca.trim()) {
      setResponsaveis([]);
      return;
    }

    setBuscandoResponsavel(true);

    try {
      const response = await fetch(
        `https://focoesaber.onrender.com/usuarios/buscar/${encodeURIComponent(nomeBusca)}`
      );

      if (!response.ok) {
        setResponsaveis([]);
        return;
      }

      const data = await response.json();

      setResponsaveis(
        data.filter((usuario: Usuario) => usuario.tipo_usuario === "responsavel")
      );
    } catch (error) {
      console.error("Erro ao buscar responsável:", error);
      setResponsaveis([]);
    } finally {
      setBuscandoResponsavel(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !dataNascimento || !matricula || !idEscola || !idResponsavel) {
      alert("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://focoesaber.onrender.com/alunos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          data_nascimento: dataNascimento,
          matricula,
          id_escola: Number(idEscola),
          id_responsavel: Number(idResponsavel),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Erro ao cadastrar aluno");
        setLoading(false);
        return;
      }

      alert("Aluno cadastrado com sucesso!");
      router.push("/dashboard/alunos");
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
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
            onClick={() => router.push("/dashboard/alunos")}
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Voltar para alunos
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-green-100 p-3 text-green-700">
              <UserPlus size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">Novo aluno</h1>
              <p className="mt-1 text-slate-600">
                Preencha os dados para cadastrar um novo aluno no sistema.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nome do aluno
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome completo"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Data de nascimento
              </label>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Matrícula
              </label>
              <input
                type="text"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Ex.: MAT2026001"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Escola
              </label>
              <select
                value={idEscola}
                onChange={(e) => setIdEscola(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
              >
                <option value="">Selecione uma escola</option>
                {escolas.map((escola) => (
                  <option key={escola.id_escola} value={escola.id_escola}>
                    {escola.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Responsável
              </label>

              <input
                type="text"
                value={buscaResponsavel}
                onChange={(e) => {
                  const valor = e.target.value;
                  setBuscaResponsavel(valor);
                  setIdResponsavel("");
                  buscarResponsavelPorNome(valor);
                }}
                placeholder="Digite o nome do responsável"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
              />

              {buscandoResponsavel && (
                <p className="mt-2 text-sm text-slate-500">Buscando responsável...</p>
              )}

              {!buscandoResponsavel &&
                buscaResponsavel.trim() !== "" &&
                responsaveis.length > 0 && (
                  <div className="absolute z-10 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                    {responsaveis.map((responsavel) => (
                      <button
                        type="button"
                        key={responsavel.id_usuario}
                        onClick={() => {
                          setIdResponsavel(String(responsavel.id_usuario));
                          setBuscaResponsavel(responsavel.nome);
                          setResponsaveis([]);
                        }}
                        className="block w-full px-4 py-3 text-left hover:bg-slate-100"
                      >
                        {responsavel.nome}
                      </button>
                    ))}
                  </div>
                )}

              {!buscandoResponsavel &&
                buscaResponsavel.trim() !== "" &&
                responsaveis.length === 0 && (
                  <p className="mt-2 text-sm text-red-500">
                    Nenhum responsável encontrado.
                  </p>
                )}

              {idResponsavel && (
                <p className="mt-2 text-sm text-green-600">
                  Responsável selecionado com ID: {idResponsavel}
                </p>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-green-600 disabled:opacity-60"
              >
                <Save size={18} />
                {loading ? "Salvando..." : "Cadastrar aluno"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}