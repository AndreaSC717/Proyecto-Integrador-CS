import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import NavbarPrincipal from "../components/NavbarPrincipal";
import { menuPorRol } from "../config/menu";
import { useAuth } from "../hooks/useAuth";

export default function MainLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { usuario } = useAuth();
  const { pathname } = useLocation();
  const opciones = menuPorRol(usuario?.rol);
  const titulo = useMemo(() => {
    if (pathname === "/dashboard") return "Panel de Gestión";
    return opciones.find((opcion) => opcion.ruta === pathname)?.titulo || "Mi cuenta";
  }, [opciones, pathname]);

  return (
    <div className="skya-app">
      <NavbarPrincipal
        menuAbierto={menuAbierto}
        alternarMenu={() => setMenuAbierto((abierto) => !abierto)}
        cerrarMenu={() => setMenuAbierto(false)}
      />
      <div className="skya-pagebar">
        <div><strong>{titulo}</strong><small>Sistema Integral de Gestión de Soporte Técnico</small></div>
        <div className="skya-breadcrumb"><span>Inicio</span><span>/</span><strong>{pathname === "/dashboard" ? "Panel de control" : titulo}</strong></div>
      </div>
      <main className="skya-content">
        <Outlet />
      </main>
    </div>
  );
}
