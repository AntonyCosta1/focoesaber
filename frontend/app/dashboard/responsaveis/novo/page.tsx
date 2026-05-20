"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { API_URL } from "@/lib/api";

type Usuario = {
  id_usuario: number;
  nome: string;
  tipo_usuario: "admin" | "professor" | "responsavel";
};

export default function NovoResponsavelPage() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [telefone, setTelefone] = useState("");
    const [loading, setLoading] = useState(false);
    const [verificando, setVerificando] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      async function verificarPermissao() {
        try {
          const resMe = await fetch(`${API_URL}/usuarios/me`, { headers });

          if (!resMe.ok) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }

          const usuario: Usuario = await resMe.json();

          // Apenas admin e professor podem criar responsáveis
          if (usuario.tipo_usuario !== "admin" && usuario.tipo_usuario !== "professor") {
            alert("Você não tem permissão para criar responsáveis");
            router.push("/dashboard");
            return;
          }

          setVerificando(false);
        } catch (error) {
          console.error("Erro ao verificar permissão:", error);
          router.push("/login");
        }
      }

      verificarPermissao();
    }, [router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!nome || !email || !senha) {
            alert("Preencha nome, email e senha.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
              router.push("/login");
              return;
            }

            const response = await fetch(`${API_URL}/usuarios/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    telefone,
                    tipo_usuario: "responsavel",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403) {
                    alert("Você não tem permissão para criar responsáveis");
                    router.push("/dashboard");
                } else {
                    alert(data.detail || "Erro ao cadastrar responsável");
                }
                setLoading(false);
                return;
            }

            alert("Responsável cadastrado com sucesso!");
            router.push("/dashboard/responsaveis");
        } catch (error) {
            console.error("Erro ao cadastrar responsável:", error);
            alert("Não foi possível conectar ao backend.");
        } finally {
            setLoading(false);
        }
    }

    if (verificando) {
        return (
            <div className="min-h-screen bg-slate-100 p-8 text-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-600">Verificando permissões...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-8 text-slate-900">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <button
                        onClick={() => router.push("/dashboard/responsaveis")}
                        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft size={16} />
                        Voltar para responsáveis
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-green-100 p-3 text-green-700">
                            <UserPlus size={22} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Novo responsável</h1>
                            <p className="mt-1 text-slate-600">
                                Cadastre um novo responsável no sistema.
                            </p>
                        </div>
                    </div>
                </header>

                <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Nome completo
                            </label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Digite o nome do responsável"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="responsavel@email.com"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Telefone
                            </label>
                            <input
                                type="text"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                placeholder="(47) 99999-9999"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Digite uma senha"
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
                                {loading ? "Salvando..." : "Cadastrar responsável"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}