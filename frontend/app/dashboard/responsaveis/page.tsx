"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Search, Users } from "lucide-react";

type Usuario = {
    id_usuario: number;
    nome: string;
    email: string;
    telefone?: string;
    tipo_usuario: string;
};

export default function ResponsaveisPage() {
    const router = useRouter();
    const [responsaveis, setResponsaveis] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        async function carregarResponsaveis() {
            try {
                const response = await fetch("http://localhost:8000/usuarios/");
                const data = await response.json();

                const filtrados = data.filter(
                    (usuario: Usuario) => usuario.tipo_usuario === "responsavel"
                );

                setResponsaveis(filtrados);
            } catch (error) {
                console.error("Erro ao carregar responsáveis:", error);
            } finally {
                setLoading(false);
            }
        }

        carregarResponsaveis();
    }, [router]);

    const responsaveisFiltrados = responsaveis.filter((responsavel) =>
        responsavel.nome.toLowerCase().includes(busca.toLowerCase()) ||
        responsavel.email.toLowerCase().includes(busca.toLowerCase())
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

                        <h1 className="text-3xl font-bold tracking-tight">Responsáveis</h1>
                        <p className="mt-1 text-slate-600">
                            Gerencie os responsáveis cadastrados no sistema.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/dashboard/responsaveis/novo")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-white shadow-sm hover:bg-green-600 transition"
                    >
                        <Plus size={18} />
                        Novo responsável
                    </button>
                </header>

                <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Total de responsáveis</p>
                        <h2 className="mt-2 text-3xl font-bold">{responsaveis.length}</h2>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Responsáveis exibidos</p>
                        <h2 className="mt-2 text-3xl font-bold">{responsaveisFiltrados.length}</h2>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Módulo</p>
                        <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-blue-700">
                            <Users size={18} />
                            Cadastro e consulta
                        </div>
                    </div>
                </section>

                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="relative max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-green-500"
                        />
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {loading ? (
                        <div className="p-6">
                            <p className="text-slate-600">Carregando responsáveis...</p>
                        </div>
                    ) : responsaveisFiltrados.length === 0 ? (
                        <div className="p-6">
                            <p className="text-slate-600">Nenhum responsável encontrado.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead className="bg-slate-50 text-sm text-slate-600">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">ID</th>
                                        <th className="px-6 py-4 font-semibold">Nome</th>
                                        <th className="px-6 py-4 font-semibold">Email</th>
                                        <th className="px-6 py-4 font-semibold">Telefone</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200 text-sm">
                                    {responsaveisFiltrados.map((responsavel) => (
                                        <tr key={responsavel.id_usuario} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">{responsavel.id_usuario}</td>
                                            <td className="px-6 py-4 font-medium">{responsavel.nome}</td>
                                            <td className="px-6 py-4">{responsavel.email}</td>
                                            <td className="px-6 py-4">{responsavel.telefone || "-"}</td>
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