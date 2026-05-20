"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Lock, Mail } from "lucide-react";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();

  try {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", senha);

    const response = await fetch(
      `${API_URL}/login/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("Erro no login:", data);

      const mensagem =
        data.detail && typeof data.detail === "string"
          ? data.detail
          : "Erro ao fazer login. Verifique email e senha.";

      alert(mensagem);
      return;
    }

    localStorage.setItem("token", data.access_token);

    router.push("/dashboard");
  } catch (error) {
    console.error("Erro inesperado:", error);
    alert("Erro ao conectar com o servidor.");
  }
}

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <section className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-600 to-emerald-800 text-white p-16 flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
            <BookOpen size={24} />
            <span className="text-xl font-semibold">Foco é Saber</span>
          </div>

          <div className="mt-16 max-w-lg">
            <h1 className="text-5xl font-bold leading-tight">
              Acompanhamento escolar com foco em evolução real.
            </h1>
            <p className="mt-6 text-lg text-green-50/90">
              Gerencie alunos, indicações, atividades, frequência, desempenho e
              relatórios em um único sistema.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
          <p className="text-sm text-green-50/80">Plataforma educacional</p>
          <p className="mt-2 text-2xl font-semibold">
            Organização, acompanhamento e decisão em um só lugar.
          </p>
        </div>
      </section>

      <section className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="mb-8">
            <p className="text-sm font-medium text-green-600">Bem-vindo</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Entrar no sistema
            </h2>
            <p className="mt-2 text-slate-600">
              Informe suas credenciais para acessar o painel.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 focus-within:border-green-500">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Senha
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 focus-within:border-green-500">
                <Lock size={18} className="text-slate-400" />
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full rounded-2xl bg-green-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-600"
            >
              Entrar
            </button>
          </div>

          <div className="mt-6 text-center">
            <button className="text-sm text-slate-500 hover:text-slate-800">
              Esqueci minha senha
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}