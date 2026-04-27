"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Search, Trash2 } from "lucide-react";

type Atividade = {
  id_atividade: number;
  nome: string;
  descricao?: string;
  id_escola: number;
};

type Escola = {
  id_escola: number;
  nome: string;
};

const API_URL = "https://focoesaber.onrender.com";

export default function AtividadesPage() {
  const router = useRouter();

  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [idEscola, setIdEscola] = useState("");
  const [salvando, setSalvando] = useState(false);

  function getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return null;
    }
    return token;
  }

  async function carregarDados() {
    const token = getToken();
    if (!token) return;

    try {
      // CORRIGIDO: atividades e escolas precisam de Authorization
      const headers = { Authorization: `Bearer ${token}` };
      const [resAtividades, resEscolas] = await Promise.all([
        fetch(`${API_URL}/atividades/`, { headers }),
        fetch(`${API_URL}/escolas/`),
      ]);

      const dataAtividades = await resAtividades.json();
      const dataEscolas = await resEscolas.json();

      setAtividades(dataAtividades);
      setEscolas(dataEscolas);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function criarAtividade(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !idEscola) {
      alert("Preencha o nome e a escola.");
      return;
    }

    const token = getToken();
    if (!token) return;

    setSalvando(true);

    try {
      // CORRIGIDO: adicionado Authorization header
      const response = await fetch(`${API_URL}/atividades/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          descricao,
          id_escola: Number(idEscola),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Erro ao criar atividade");
        setSalvando(false);
        return;
      }

      alert("Atividade criada com sucesso!");
      setNome("");
      setDescricao("");
      setIdEscola("");
      carregarDados();
    } catch (error) {
      console.error("Erro ao criar atividade:", error);
      alert("Não foi possível conectar ao backend.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirAtividade(idAtividade: number) {
    const confirmar = confirm("Deseja realmente excluir esta atividade?");
    if (!confirmar) return;

    const token = getToken();
    if (!token) return;

    try {
      // CORRIGIDO: adicionado Authorization header
      const response = await fetch(`${API_URL}/atividades/${idAtividade}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Erro ao excluir atividade");
        return;
      }

      alert("Atividade excluída com sucesso!");
      carregarDados();
    } catch (error) {
      console.error("Erro ao excluir atividade:", error);
      alert("Não foi possível conectar ao backend.");
    }
  }

  const atividadesFiltradas = atividades.filter(
    (atividade) =>
      atividade.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (atividade.descricao || "").toLowerCase().includes(busca.toLowerCase())
  );

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

            <h1 className="text-3xl font-bold tracking-tight">Atividades</h1>
            <p className="mt-1 text-slate-600">
              Cadastre e gerencie as atividades recreativas do sistema.
            </p>
          </div>
        </header>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Nova atividade</h2>

          <form onSubmit={criarAtividade} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nome da atividade"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
            />

            <select
              value={idEscola}
              onChange={(e) => setIdEscola(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
            >
              <option value="">Selecione a escola</option>
              {escolas.map((escola) => (
                <option key={escola.id_escola} value={escola.id_escola}>
                  {escola.nome}
                </option>
              ))}
            </select>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={salvando}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-white shadow-sm hover:bg-green-600 transition disabled:opacity-60"
              >
                <Plus size={18} />
                {salvando ? "Salvando..." : "Criar atividade"}
              </button>
            </div>
          </form>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Buscar atividade por nome ou descrição"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-green-500"
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-6">
              <p className="text-slate-600">Carregando atividades...</p>
            </div>
          ) : atividadesFiltradas.length === 0 ? (
            <div className="p-6">
              <p className="text-slate-600">Nenhuma atividade encontrada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Nome</th>
                    <th className="px-6 py-4 font-semibold">Descrição</th>
                    <th className="px-6 py-4 font-semibold">Escola</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-sm">
                  {atividadesFiltradas.map((atividade) => (
                    <tr key={atividade.id_atividade} className="hover:bg-slate-50">
                      <td className="px-6 py-4">{atividade.id_atividade}</td>
                      <td className="px-6 py-4 font-medium">{atividade.nome}</td>
                      <td className="px-6 py-4">{atividade.descricao || "-"}</td>
                      <td className="px-6 py-4">{atividade.id_escola}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Ativa
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => excluirAtividade(atividade.id_atividade)}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600 transition"
                        >
                          <Trash2 size={14} />
                          Excluir
                        </button>
                      </td>
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
