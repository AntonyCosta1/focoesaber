"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, ClipboardCheck } from "lucide-react";

type Atividade = {
    id_atividade: number;
    nome: string;
    descricao?: string;
    id_escola: number;
};

export default function finalizarInscricaoPage() {
    const router = useRouter();
    const params = useParams();
    const idIndicacao = params.id as string;

    const [idAtividade, setIdAtividade] = useState("");
    const [atividades, setAtividades] = useState<Atividade[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        async function carregarAtividades() {
            try {
                const response = await fetch("https://focoesaber.onrender.com/atividades/");
                const data = await response.json();
                setAtividades(data);
            } catch (error) {
                console.error("Erro ao carregar atividades:", error);
            }
        }
        carregarAtividades();
    }, [router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!idAtividade) {
            alert("Selecione uma atividade para finalizar a inscrição.");
            return;

        }

        setLoading(true);

        try {
            const response = await fetch("https://focoesaber.onrender.com/inscricoes/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_indicacao: Number(idIndicacao),
                    id_atividade: Number(idAtividade),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || "Erro ao finalizar inscrição");
                return;
            }

            alert("Inscrição finalizada com sucesso!");
            router.push("/dashboard/indicacoes");
        } catch (error) {
            console.error("Erro ao finalizar inscrição:", error);
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
                        <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                            <ClipboardCheck size={22} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Finalizar inscrição
                            </h1>
                            <p className="mt-1 text-slate-600">
                                Escolha a atividade para concluir a inscrição da indicação #{idIndicacao}.
                            </p>
                        </div>
                    </div>
                </header>

                <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Atividade recreativa
                            </label>
                            <select
                                value={idAtividade}
                                onChange={(e) => setIdAtividade(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                            >
                                <option value="">Selecione uma atividade</option>
                                {atividades.map((atividade) => (
                                    <option key={atividade.id_atividade} value={atividade.id_atividade}>
                                        {atividade.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-medium text-white shadow-sm hover:bg-blue-600 transition disabled:opacity-60"
                            >
                                <Save size={18} />
                                {loading ? "Salvando..." : "Finalizar inscrição"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}