
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { menuPorRol } from "../config/menu";

export default function Sidebar({ abierto, cerrar }) {
  const { usuario } = useAuth();
  const opciones = menuPorRol(usuario?.rol);

  return (
    <>
      {abierto && (
        <button
          type="button"
          className="skya-overlay"
          onClick={cerrar}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={`skya-sidebar ${abierto ? "abierto" : ""}`}
        aria-label="Navegación principal"
      >
        <div className="skya-sidebar-brand">
          <span className="skya-brand-icon">
            <img src="/image-removebg-preview.png" alt="" />
          </span>
          <div>
            <strong>SKYA</strong>
            <small>Sistema Integral de Gestión</small>
          </div>
        </div>

        <div className="skya-sidebar-label">
          MENÚ PRINCIPAL
        </div>

        <nav className="skya-sidebar-nav">
          {opciones.map((opcion) => (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              onClick={cerrar}
              className={({ isActive }) =>
                `skya-nav-link ${isActive ? "activo" : ""}`
              }
            >
              <span className="skya-nav-icon">
                {opcion.icono}
              </span>
              <span>{opcion.titulo}</span>
            </NavLink>
          ))}
        </nav>

        <div className="skya-sidebar-footer">
          <span className="skya-online-dot" />
          Sistema de soporte
          <small>Helpdesk Organizacional para empresas</small>
        </div>
      </aside>
    </>
  );
}
