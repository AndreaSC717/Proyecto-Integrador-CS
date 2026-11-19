import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function CambiarPassword() {
  const { usuario, cambiarPassword, logout } = useAuth();
  const navigate = useNavigate();
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const debeCambiar = Boolean(usuario?.debeCambiarPassword || usuario?.debe_cambiar_password);

  async function enviar(evento) {
    evento.preventDefault();
    setError("");
    if (nueva.length < 12 || nueva.length > 128) {
      setError("La contraseña debe tener entre 12 y 128 caracteres.");
      return;
    }
    if (nueva !== confirmacion) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (actual === nueva) {
      setError("La contraseña nueva debe ser diferente.");
      return;
    }

    setCargando(true);
    try {
      await cambiarPassword(actual, nueva);
      logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "No fue posible cambiar la contraseña.");
    } finally {
      setCargando(false);
    }
  }

  function cerrarSesion() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="password-page">
      <div className="password-wave password-wave-back" aria-hidden="true" />
      <div className="password-wave password-wave-front" aria-hidden="true" />
      <Link className="password-brand" to={debeCambiar ? "/cambiar-password" : "/dashboard"} aria-label="SKYA">
        <img src="/image-removebg-preview.png" alt="" />
        <span>SKYA</span>
      </Link>

      <section className="password-card" aria-labelledby="password-title">
        {!debeCambiar && (
          <div className="password-back-row">
            <Link to="/dashboard" className="password-back-link">← Volver al panel</Link>
          </div>
        )}
        <div className="password-card-heading">
          <span className="password-heading-icon" aria-hidden="true">⌑</span>
          <div>
            <span className="password-kicker">SEGURIDAD DE LA CUENTA</span>
            <h1 id="password-title">Actualizar contraseña</h1>
          </div>
        </div>
        <p className="password-account">Cuenta: <strong>{usuario?.email}</strong></p>

        {debeCambiar && (
          <div className="alert password-required-alert" role="status">
            Debes cambiar tu contraseña antes de utilizar SKYA.
          </div>
        )}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <form onSubmit={enviar} className="password-form">
          <label className="form-label" htmlFor="actual">Contraseña actual</label>
          <input className="form-control" id="actual" type="password" autoComplete="current-password" value={actual} onChange={(e) => setActual(e.target.value)} required />

          <label className="form-label" htmlFor="nueva">Nueva contraseña <span>(12 a 128 caracteres)</span></label>
          <input className="form-control" id="nueva" type="password" minLength={12} maxLength={128} autoComplete="new-password" value={nueva} onChange={(e) => setNueva(e.target.value)} required />

          <label className="form-label" htmlFor="confirmacion">Confirmar nueva contraseña</label>
          <input className="form-control" id="confirmacion" type="password" autoComplete="new-password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} required />

          <button className="btn btn-primary password-submit" type="submit" disabled={cargando}>
            {cargando ? "Actualizando..." : "Cambiar contraseña"}<span aria-hidden="true">→</span>
          </button>
        </form>

        <div className="password-card-footer">
          <span>Tu seguridad es importante para nosotros.</span>
          <button className="btn btn-link" type="button" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </section>
    </main>
  );
}
