"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, CheckCircle2, XCircle } from "lucide-react";

type Indicacao = {
  id_indicacao: number;
  id_aluno: number;
  id_professor: number;
  status_aprovacao: string;
  observacao?: string;
};

type Usuario = {
  id_usuario: number;
  nome: string;
  tipo_usuario: string;
};
type Inscricao = {
  id_inscricao: number;
  id_indicacao: number;
  id_aluno: number;
  id_atividade: number;
  status_inscricao: string;
};

export default function IndicacoesPage() {
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>([]);
  const [loading, setLoading] = useState(true);

  const [idResponsavel, setIdResponsavel] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [responsaveis, setResponsaveis] = useState<Usuario[]>([]);
  const [buscandoResponsavel, setBuscandoResponsavel] = useState(false);

  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);

  const router = useRouter();

  async function carregarIndicacoes() {
    try {
      const [resIndicacoes, resInscricoes] = await Promise.all([
        fetch("https://focoesaber.onrender.com/indicacoes/"),
        fetch("https://focoesaber.onrender.com/inscricoes/"),
      ]);

      const dataIndicacoes = await resIndicacoes.json();
      const dataInscricoes = await resInscricoes.json();

      setIndicacoes(dataIndicacoes);
      setInscricoes(dataInscricoes);
    } catch (error) {
      console.error("Erro ao carregar indicações:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarIndicacoes();
  }, []);

  async function buscarResponsavelPorNome(nome: string) {
    if (!nome.trim()) {
      setResponsaveis([]);
      setIdResponsavel("");
      return;
    }

    setBuscandoResponsavel(true);

    try {
      const response = await fetch(
        `https://focoesaber.onrender.com/usuarios/buscar/${encodeURIComponent(nome)}`
      );

      if (!response.ok) {
        setResponsaveis([]);
        return;
      }

      const data = await response.json();

      const somenteResponsaveis = data.filter(
        (usuario: Usuario) => usuario.tipo_usuario === "responsavel"
      );

      setResponsaveis(somenteResponsaveis);
    } catch (error) {
      console.error("Erro ao buscar responsável:", error);
      setResponsaveis([]);
    } finally {
      setBuscandoResponsavel(false);
    }
  }

  async function aprovarIndicacao(id_indicacao: number) {
    if (!idResponsavel) {
      alert("Selecione um responsável pelo nome antes de aprovar a indicação.");
      return;
    }

    try {
      const response = await fetch(
        `https://focoesaber.onrender.com/indicacoes/${id_indicacao}/aprovar/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_responsavel: Number(idResponsavel),
            observacao: "Aprovado pelo responsável",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Erro ao aprovar indicação");
        return;
      }

      alert("Indicação aprovada com sucesso!");
      carregarIndicacoes();
    } catch (error) {
      console.error("Erro ao aprovar indicação:", error);
      alert("Não foi possível conectar ao backend.");
    }
  }

  async function recusarIndicacao(id_indicacao: number) {
    if (!idResponsavel) {
      alert("Selecione um responsável pelo nome antes de recusar a indicação.");
      return;
    }

    try {
      const response = await fetch(
        `https://focoesaber.onrender.com/indicacoes/${id_indicacao}/recusar/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_responsavel: Number(idResponsavel),
            observacao: "Recusado pelo responsável",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Erro ao recusar indicação");
        return;
      }

      alert("Indicação recusada com sucesso!");
      carregarIndicacoes();
    } catch (error) {
      console.error("Erro ao recusar indicação:", error);
      alert("Não foi possível conectar ao backend.");
    }
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

            <h1 className="text-3xl font-bold tracking-tight">Indicações</h1>
            <p className="mt-1 text-slate-600">
              Visualize e gerencie as indicações registradas no sistema.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard/indicacoes/nova")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-green-600"
          >
            <Plus size={18} />
            Nova indicação
          </button>
        </header>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Buscar responsável pelo nome
          </label>

          <input
            type="text"
            value={nomeResponsavel}
            onChange={(e) => {
              const valor = e.target.value;
              setNomeResponsavel(valor);
              setIdResponsavel("");
              buscarResponsavelPorNome(valor);
            }}
            placeholder="Digite o nome do responsável"
            className="max-w-sm w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
          />

          {buscandoResponsavel && (
            <p className="mt-2 text-sm text-slate-500">Buscando responsável...</p>
          )}

          {!buscandoResponsavel &&
            nomeResponsavel.trim() !== "" &&
            responsaveis.length > 0 && (
              <div className="mt-3 max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {responsaveis.map((responsavel) => (
                  <button
                    key={responsavel.id_usuario}
                    type="button"
                    onClick={() => {
                      setIdResponsavel(String(responsavel.id_usuario));
                      setNomeResponsavel(responsavel.nome);
                      setResponsaveis([]);
                    }}
                    className="block w-full border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                  >
                    {responsavel.nome}
                  </button>
                ))}
              </div>
            )}

          {!buscandoResponsavel &&
            nomeResponsavel.trim() !== "" &&
            responsaveis.length === 0 && (
              <p className="mt-2 text-sm text-red-500">
                Nenhum responsável encontrado.
              </p>
            )}

          {idResponsavel && (
            <p className="mt-2 text-sm text-green-600">
              Responsável selecionado: {nomeResponsavel} (ID: {idResponsavel})
            </p>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-6">
              <p className="text-slate-600">Carregando indicações...</p>
            </div>
          ) : indicacoes.length === 0 ? (
            <div className="p-6">
              <p className="text-slate-600">Nenhuma indicação encontrada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Aluno</th>
                    <th className="px-6 py-4 font-semibold">Professor</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Observação</th>
                    <th className="px-6 py-4 font-semibold">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-sm">
                  {indicacoes.map((indicacao) => (
                    <tr key={indicacao.id_indicacao} className="hover:bg-slate-50">
                      <td className="px-6 py-4">{indicacao.id_indicacao}</td>
                      <td className="px-6 py-4">{indicacao.id_aluno}</td>
                      <td className="px-6 py-4">{indicacao.id_professor}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${indicacao.status_aprovacao === "aprovado"
                              ? "bg-green-100 text-green-700"
                              : indicacao.status_aprovacao === "recusado"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {indicacao.status_aprovacao}
                        </span>
                      </td>
                      <td className="px-6 py-4">{indicacao.observacao || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {indicacao.status_aprovacao === "pendente" && (
                            <>
                              <button
                                onClick={() => aprovarIndicacao(indicacao.id_indicacao)}
                                className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-600"
                              >
                                <CheckCircle2 size={14} />
                                Aprovar
                              </button>

                              <button
                                onClick={() => recusarIndicacao(indicacao.id_indicacao)}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-600"
                              >
                                <XCircle size={14} />
                                Recusar
                              </button>
                            </>
                          )}

                          {indicacao.status_aprovacao === "aprovado" && (
                            <button
                              onClick={() =>
                                router.push(`/dashboard/inscricoes/${indicacao.id_indicacao}`)
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-600"
                            >
                              Finalizar inscrição
                            </button>
                          )}

                          {indicacao.status_aprovacao === "aprovado" && (
                            <span className="text-slate-500">Sem ações</span>
                          )}

                          {indicacao.status_aprovacao === "recusado" && (
                            <span className="text-slate-500">Sem ações</span>
                          )}
                        </div>
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