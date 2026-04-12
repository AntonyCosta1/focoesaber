"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, ClipboardList, TrendingUp } from "lucide-react";
import { cp } from "fs";

type ProgressoAluno = {
    aluno: {
        id_aluno: number;
        nome: string;
        matricula: string;
        id_escola: number;
        id_responsavel: number;
    };
    inscricao: {
        id_inscricao: number;
        id_atividade: number;
        status_inscricao: string;
    };
    frequencias: {
        id_frequencia: number;
        data_aula: string;
        tipo_aula: string;
        presente: boolean;
    }[];
    desempenhos: {
        id_desempenho: number;
        data_registro: string;
        descricao: string;
        observacao?: string;
        validado: boolean;
    }[];
};

export default function ProgressoAlunoPage() {
    const router = useRouter();
    const params = useParams();
    const idAluno = params.id as string;

    const [progresso, setProgresso] = useState<ProgressoAluno | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        async function carregarProgresso() {
            try {
                const response = await fetch(`http://localhost:8000/progresso/aluno/${idAluno}`);
                const data = await response.json();

                if (!response.ok) {
                    alert(data.detail || "Erro ao carregar progresso do aluno");
                    return;
                }

                setProgresso(data);
            } catch (error) {
                console.error("Erro ao carregar progresso do aluno:", error);
                alert("não foi possivel conectar ao banco de dados");
            }
            finally {
                setLoading(false);
            }
        }

        carregarProgresso();
    }, [idAluno, router]);


    return (
        <div className="min-h-screen bg-slate-100 p-8 text-slate-900">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <button
                        onClick={() => router.push("/dashboard/alunos")}
                        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft size={16} />
                        Voltar para alunos
                    </button>

                    <h1 className="text-3xl font-bold tracking-tight">Progresso do aluno</h1>
                    <p className="mt-1 text-slate-600">
                        Acompanhe frequência, inscrição e desempenho acadêmico.
                    </p>
                </header>

                {loading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p>Carregando progresso...</p>
                    </div>
                ) : !progresso ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p>Nenhum dado encontrado.</p>
                    </div>
                ) : (
                    <>
                        <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-3 inline-flex rounded-xl bg-blue-100 p-3 text-blue-700">
                                    <User size={20} />
                                </div>
                                <p className="text-sm text-slate-500">Aluno</p>
                                <h2 className="mt-2 text-xl font-bold">{progresso.aluno.nome}</h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    Matrícula: {progresso.aluno.matricula}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-3 inline-flex rounded-xl bg-green-100 p-3 text-green-700">
                                    <ClipboardList size={20} />
                                </div>
                                <p className="text-sm text-slate-500">Inscrição</p>
                                <h2 className="mt-2 text-xl font-bold">
                                    #{progresso.inscricao.id_inscricao}
                                </h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    Status: {progresso.inscricao.status_inscricao}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-3 inline-flex rounded-xl bg-purple-100 p-3 text-purple-700">
                                    <TrendingUp size={20} />
                                </div>
                                <p className="text-sm text-slate-500">Desempenhos</p>
                                <h2 className="mt-2 text-xl font-bold">
                                    {progresso.desempenhos.length}
                                </h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    Registros lançados
                                </p>
                            </div>
                        </section>

                        <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="border-b border-slate-200 px-6 py-4">
                                <h3 className="text-lg font-semibold">Frequências</h3>
                            </div>

                            {progresso.frequencias.length === 0 ? (
                                <div className="p-6">
                                    <p className="text-slate-600">Nenhuma frequência registrada.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left">
                                        <thead className="bg-slate-50 text-sm text-slate-600">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">Data</th>
                                                <th className="px-6 py-4 font-semibold">Tipo</th>
                                                <th className="px-6 py-4 font-semibold">Presença</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-200 text-sm">
                                            {progresso.frequencias.map((frequencia) => (
                                                <tr key={frequencia.id_frequencia} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4">{frequencia.data_aula}</td>
                                                    <td className="px-6 py-4">{frequencia.tipo_aula}</td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-medium ${frequencia.presente
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {frequencia.presente ? "Presente" : "Falta"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="border-b border-slate-200 px-6 py-4">
                                <h3 className="text-lg font-semibold">Desempenhos</h3>
                            </div>

                            {progresso.desempenhos.length === 0 ? (
                                <div className="p-6">
                                    <p className="text-slate-600">Nenhum desempenho registrado.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-200">
                                    {progresso.desempenhos.map((desempenho) => (
                                        <div key={desempenho.id_desempenho} className="p-6">
                                            <div className="flex items-center justify-between gap-4">
                                                <h4 className="font-semibold">{desempenho.descricao}</h4>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${desempenho.validado
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {desempenho.validado ? "Validado" : "Pendente"}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm text-slate-600">
                                                {desempenho.observacao || "Sem observações."}
                                            </p>

                                            <p className="mt-3 text-xs text-slate-500">
                                                Data: {desempenho.data_registro}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}