import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { menuPorRol } from "../config/menu";
import CampanaNotificaciones from "./CampanaNotificaciones";

export default function NavbarPrincipal({ menuAbierto, alternarMenu, cerrarMenu }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const nombreCompleto = [usuario?.nombre, usuario?.apellido].filter(Boolean).join(" ") || "Usuario";
  const inicial = usuario?.nombre?.charAt(0)?.toUpperCase() || "U";
  const opciones = menuPorRol(usuario?.rol);

  function cerrarSesion() {
    sessionStorage.removeItem("skya_mostrar_bienvenida");
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="skya-topbar">
      <Link className="skya-topbar-brand" to="/dashboard" onClick={cerrarMenu} aria-label="SKYA, ir al panel de control">
        <span className="skya-topbar-logo"><img src="/image-removebg-preview.png" alt="" /></span>
        <span><strong>SKYA</strong><small>Sistema Integral de Gestión</small></span>
      </Link>

      <button className="skya-mobile-nav-toggle" type="button" onClick={alternarMenu} aria-expanded={menuAbierto} aria-label={menuAbierto ? "Cerrar navegación" : "Abrir navegación"}>
        <span /><span /><span />
      </button>

      <nav className={`skya-primary-nav ${menuAbierto ? "abierto" : ""}`} aria-label="Navegación principal">
        {opciones.map((opcion) => (
          <NavLink key={opcion.ruta} to={opcion.ruta} onClick={cerrarMenu} className={({ isActive }) => `skya-primary-link ${isActive ? "activo" : ""}`}>
            <span aria-hidden="true">{opcion.icono}</span>{opcion.titulo}
          </NavLink>
        ))}
      </nav>

      <div className="skya-topbar-actions">
        <CampanaNotificaciones />
        <span className="skya-topbar-divider" />
        <div className="dropdown">
          <button className="skya-account-menu" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span className="skya-avatar">{inicial}</span>
            <span className="skya-user-info"><strong>{nombreCompleto}</strong><small>{usuario?.rol}</small></span>
            <span className="skya-account-chevron" aria-hidden="true">⌄</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow border-0">
            <li><span className="dropdown-item-text small text-secondary">{usuario?.email}</span></li>
            <li><hr className="dropdown-divider" /></li>
            <li><Link className="dropdown-item" to="/cambiar-password">Cambiar contraseña</Link></li>
            <li><button type="button" className="dropdown-item text-danger" onClick={cerrarSesion}>Cerrar sesión</button></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
