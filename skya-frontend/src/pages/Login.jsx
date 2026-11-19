import { useState } from "react";
import { useNavigate } from "react-router-dom";

import EstadoBackend from "../components/EstadoBackend";
import { useAuth } from "../hooks/useAuth";

function LogoSkya({ grande = false }) {
  return (
    <div className={`login-brand-mark ${grande ? "login-brand-mark-large" : ""}`} aria-hidden="true">
      <img src="/image-removebg-preview.png" alt="" />
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function manejarLogin(evento) {
    evento.preventDefault();
    setError("");
    setCargando(true);
    sessionStorage.removeItem("skya_mostrar_bienvenida");
    try {
      const perfil = await login(email, password);
      if (perfil.debeCambiarPassword || perfil.debe_cambiar_password) {
        navigate("/cambiar-password", { replace: true });
      } else {
        sessionStorage.setItem("skya_mostrar_bienvenida", "1");
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-intro" aria-label="Acerca de SKYA">
          <div className="login-hero-brand">
            <LogoSkya grande />
            <div className="login-wordmark">SKYA</div>
          </div>
          <p className="login-tagline">Sistema Integral de Gestión<br />de Soporte Técnico</p>
          <div className="login-rule" />
          <p className="login-slogan">Conectamos soluciones,<br />brindamos <strong>soporte</strong></p>
        </section>

        <section className="login-card" aria-labelledby="login-title">
          <LogoSkya />
          <h1 id="login-title">Bienvenido a SKYA</h1>
          <div className="login-subtitle"><span />Inicia sesión para continuar<span /></div>

          {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

          <form onSubmit={manejarLogin}>
            <label className="login-input-wrap" htmlFor="email">
              <span className="login-field-icon" aria-hidden="true">✉</span>
              <input id="email" type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
            </label>
            <div className="login-input-wrap">
              <span className="login-field-icon login-lock" aria-hidden="true">♙</span>
              <input id="password" type={mostrarPassword ? "text" : "password"} placeholder="Contraseña" aria-label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
              <button className="login-show-password" type="button" onClick={() => setMostrarPassword((actual) => !actual)} aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>{mostrarPassword ? "◉" : "◎"}</button>
            </div>
            <button className="login-submit" type="submit" disabled={cargando}>
              <span>{cargando ? "Validando..." : "Iniciar sesión"}</span><span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="login-api-status"><EstadoBackend /></div>
          <div className="login-authorized"><span aria-hidden="true">♢</span>Acceso autorizado a SKYA</div>
        </section>
      </div>
    </main>
  );
}
