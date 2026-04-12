"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

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
};

type Usuario = {
    id_usuario: number;
    nome: string;
    tipo_usuario: string;
};

export default function RegistrarProgressoPage() {
    const router = useRouter();
    const params = useParams();
    const idAluno = params.id as string;

    const [progresso, setProgresso] = useState<ProgressoAluno | null>(null);
    const [professores, setProfessores] = useState<Usuario[]>([]);

    const [dataAula, setDataAula] = useState("");
    const [tipoAula, setTipoAula] = useState("reforco");
    const [presente, setPresente] = useState("true");

    const [idProfessor, setIdProfessor] = useState("");
    const [descricao, setDescricao] = useState("");
    const [observacao, setObservacao] = useState("");

    const [loading, setLoading] = useState(true);
    const [salvandoFrequencia, setSalvandoFrequencia] = useState(false);
    const [salvandoDesempenho, setSalvandoDesempenho] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        async function carregarDados() {
            try {
                const [resProgresso, resUsers] = await Promise.all([
                    fetch(`https://focoesaber.onrender.com/progresso/aluno/${idAluno}`),
                    fetch("https://focoesaber.onrender.com/usuarios/"),
                ]);

                const dataProgresso = await resProgresso.json();
                const dataUsers = await resUsers.json();

                if (!resProgresso.ok) {
                    alert(dataProgresso.detail || "Erro ao carregar progresso do aluno");
                    router.push("/dashboard/alunos");
                    return;
                }

                setProgresso(dataProgresso);
                setProfessores(
                    dataUsers.filter((user: Usuario) => user.tipo_usuario === "professor")
                );
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                alert("Não foi possível carregar os dados.");
            } finally {
                setLoading(false);
            }
        }

        carregarDados();
    }, [idAluno, router]);

    async function registrarFrequencia(e: React.FormEvent) {
        e.preventDefault();

        if (!progresso?.inscricao?.id_inscricao) {
            alert("Inscrição do aluno não encontrada.");
            return;
        }

        if (!dataAula) {
            alert("Informe a data da aula.");
            return;
        }

        setSalvandoFrequencia(true);

        try {
            const response = await fetch("https://focoesaber.onrender.com/frequencias/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_inscricao: progresso.inscricao.id_inscricao,
                    data_aula: dataAula,
                    tipo_aula: tipoAula,
                    presente: presente === "true",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || "Erro ao registrar frequência");
                return;
            }

            alert("Frequência registrada com sucesso!");
            setDataAula("");
            setTipoAula("reforco");
            setPresente("true");
        } catch (error) {
            console.error("Erro ao registrar frequência:", error);
            alert("Não foi possível registrar a frequência.");
        } finally {
            setSalvandoFrequencia(false);
        }
    }

    async function registrarDesempenho(e: React.FormEvent) {
        e.preventDefault();

        if (!progresso?.inscricao?.id_inscricao) {
            alert("Inscrição do aluno não encontrada.");
            return;
        }

        if (!idProfessor || !descricao) {
            alert("Selecione o professor e preencha a descrição.");
            return;
        }

        setSalvandoDesempenho(true);

        try {
            const response = await fetch("https://focoesaber.onrender.com/desempenhos/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_inscricao: progresso.inscricao.id_inscricao,
                    id_professor: Number(idProfessor),
                    descricao,
                    observacao,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || "Erro ao registrar desempenho");
                return;
            }

            alert("Desempenho registrado com sucesso!");
            setIdProfessor("");
            setDescricao("");
            setObservacao("");
        } catch (error) {
            console.error("Erro ao registrar desempenho:", error);
            alert("Não foi possível registrar o desempenho.");
        } finally {
            setSalvandoDesempenho(false);
        }
    }

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    Carregando...
                </div>
            </div>
        );
    }

    if (!progresso) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    Nenhum dado encontrado.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-8 text-slate-900">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8">
                    <button
                        onClick={() => router.push(`/dashboard/alunos/${idAluno}`)}
                        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft size={16} />
                        Voltar para progresso do aluno
                    </button>

                    <h1 className="text-3xl font-bold tracking-tight">Registrar progresso</h1>
                    <p className="mt-1 text-slate-600">
                        Lance frequência e desempenho do aluno <strong>{progresso.aluno.nome}</strong>.
                    </p>
                </header>

                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Informações do aluno</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500">Aluno</p>
                            <p className="font-medium">{progresso.aluno.nome}</p>
                        </div>

                        <div>
                            <p className="text-slate-500">Matrícula</p>
                            <p className="font-medium">{progresso.aluno.matricula}</p>
                        </div>

                        <div>
                            <p className="text-slate-500">Inscrição</p>
                            <p className="font-medium">#{progresso.inscricao.id_inscricao}</p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Registrar frequência</h2>

                        <form onSubmit={registrarFrequencia} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Data da aula
                                </label>
                                <input
                                    type="date"
                                    value={dataAula}
                                    onChange={(e) => setDataAula(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Tipo da aula
                                </label>
                                <select
                                    value={tipoAula}
                                    onChange={(e) => setTipoAula(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                                >
                                    <option value="reforco">Reforço</option>
                                    <option value="recreativa">Recreativa</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Presença
                                </label>
                                <select
                                    value={presente}
                                    onChange={(e) => setPresente(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                                >
                                    <option value="true">Presente</option>
                                    <option value="false">Falta</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={salvandoFrequencia}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-white hover:bg-green-600 transition disabled:opacity-60"
                            >
                                <Save size={18} />
                                {salvandoFrequencia ? "Salvando..." : "Salvar frequência"}
                            </button>
                        </form>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Registrar desempenho</h2>

                        <form onSubmit={registrarDesempenho} className="space-y-4">
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

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Descrição
                                </label>
                                <input
                                    type="text"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Ex.: Melhorou em matemática"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Observação
                                </label>
                                <textarea
                                    value={observacao}
                                    onChange={(e) => setObservacao(e.target.value)}
                                    placeholder="Detalhes sobre a evolução do aluno"
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={salvandoDesempenho}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-medium text-white hover:bg-blue-600 transition disabled:opacity-60"
                            >
                                <Save size={18} />
                                {salvandoDesempenho ? "Salvando..." : "Salvar desempenho"}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}