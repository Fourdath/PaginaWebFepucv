import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const { signInWithPassword, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithPassword(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "No se pudo iniciar sesión.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-fepucv-surface flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-fepucv shadow-2xl border border-fepucv-border max-w-md w-full">
        <h1 className="text-2xl font-bold text-fepucv-secondary text-center mb-2">
          Iniciar sesión
        </h1>
        <p className="text-fepucv-textSecondary text-sm text-center mb-6">
          Acceso exclusivo equipo FEPUCV
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-fepucv-text mb-2">
              Correo
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-fepucv-border rounded-fepucv focus:ring-2 focus:ring-fepucv-primary outline-none"
              placeholder="nombre@pucv.cl"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-fepucv-text mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-fepucv-border rounded-fepucv focus:ring-2 focus:ring-fepucv-primary outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-fepucv-accent text-xs font-bold text-center">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full bg-fepucv-primary text-white font-bold py-3 rounded-fepucv hover:bg-fepucv-light transition-all disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

// 👇 esto evita problemas si lo importas como default o como named
export default LoginPage;
