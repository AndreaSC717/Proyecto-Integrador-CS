const ESTADOS = [
  ["abierto", "Abiertos", "#087d7a"],
  ["asignado", "Asignados", "#20aaa0"],
  ["en_proceso", "En proceso", "#7bcfc5"],
  ["resuelto", "Resueltos", "#2eaa75"],
  ["cerrado", "Cerrados", "#b7e8e2"],
  ["reabierto", "Reabiertos", "#397d91"],
];

export default function GraficasDashboard({ tickets }) {
  const conteos = ESTADOS.map(([clave, nombre, color]) => ({
    clave,
    nombre,
    color,
    total: tickets.filter((ticket) => ticket.estado === clave).length,
  }));
  const total = conteos.reduce((suma, estado) => suma + estado.total, 0);
  const radio = 53;
  const circunferencia = 2 * Math.PI * radio;
  let desplazamiento = 0;
  const ahora = Date.now();
  const semanas = [3, 2, 1, 0].map((semanasAtras) => {
    const inicio = ahora - (semanasAtras + 1) * 7 * 86400000;
    const fin = ahora - semanasAtras * 7 * 86400000;
    return tickets.filter((ticket) => {
      const fecha = new Date(ticket.fecha_creacion || ticket.created_at || ticket.fechaCreacion).getTime();
      return Number.isFinite(fecha) && fecha >= inicio && fecha < fin;
    }).length;
  });
  const maximo = Math.max(1, ...semanas);
  const puntos = semanas.map((valor, indice) => ({ x: 45 + indice * 165, y: 128 - (valor / maximo) * 82, valor }));
  const linea = puntos.map((punto, indice) => `${indice ? "L" : "M"} ${punto.x} ${punto.y}`).join(" ");

  return (
    <div className="row g-3 skya-dashboard-charts">
      <div className="col-12 col-xl-5">
        <section className="card skya-chart-card h-100" aria-label="Tickets por estado">
          <div className="card-body p-4">
            <h3 className="h6 fw-bold mb-3"><span className="skya-chart-heading-icon">▥</span>Tickets por estado</h3>
            <div className="skya-donut-layout">
              <svg className="skya-donut" viewBox="0 0 140 140" role="img" aria-label={`Distribución de ${total} tickets`}>
                <circle cx="70" cy="70" r={radio} fill="none" stroke="#e8f1f1" strokeWidth="19" />
                {conteos.map((estado) => {
                  const largo = total ? (estado.total / total) * circunferencia : 0;
                  const offset = desplazamiento;
                  desplazamiento += largo;
                  return total > 0 && estado.total > 0 ? <circle key={estado.clave} cx="70" cy="70" r={radio} fill="none" stroke={estado.color} strokeWidth="19" strokeDasharray={`${largo} ${circunferencia - largo}`} strokeDashoffset={-offset} transform="rotate(-90 70 70)" /> : null;
                })}
                <text x="70" y="67" textAnchor="middle" className="skya-donut-value">{total}</text>
                <text x="70" y="84" textAnchor="middle" className="skya-donut-caption">tickets</text>
              </svg>
              <div className="skya-chart-legend">{conteos.map((estado) => <div className="skya-legend-row" key={estado.clave}><span className="skya-legend-dot" style={{ background: estado.color }} /><span>{estado.nombre}</span><strong>{estado.total}</strong></div>)}</div>
            </div>
          </div>
        </section>
      </div>
      <div className="col-12 col-xl-7">
        <section className="card skya-chart-card h-100" aria-label="Actividad reciente">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-2"><div><h3 className="h6 fw-bold mb-1"><span className="skya-chart-heading-icon">⌁</span>Actividad reciente</h3><p className="small text-secondary mb-0">Tickets creados en las últimas cuatro semanas</p></div><span className="skya-chart-chip">Último mes</span></div>
            <div className="skya-line-chart-wrap">
              <svg className="skya-line-chart" viewBox="0 0 600 180" role="img" aria-label="Tickets creados cada semana durante el último mes" preserveAspectRatio="none">
                <defs><linearGradient id="skya-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#20aaa0" stopOpacity=".25" /><stop offset="1" stopColor="#20aaa0" stopOpacity="0" /></linearGradient></defs>
                {[46, 88, 130].map((y) => <g key={y}><line x1="40" x2="565" y1={y} y2={y} className="skya-chart-grid" /><text x="29" y={y + 4} textAnchor="end" className="skya-chart-axis">{Math.round(((130 - y) / 82) * maximo)}</text></g>)}
                <path d={`${linea} L ${puntos.at(-1).x} 142 L ${puntos[0].x} 142 Z`} fill="url(#skya-chart-fill)" />
                <path d={linea} fill="none" className="skya-line-path" />
                {puntos.map((punto, indice) => <g key={indice}><line x1={punto.x} x2={punto.x} y1={punto.y} y2="142" className="skya-chart-guide" /><circle cx={punto.x} cy={punto.y} r="5.5" className="skya-line-point" /><text x={punto.x} y="166" textAnchor="middle" className="skya-chart-axis">Semana {indice + 1}</text></g>)}
              </svg>
            </div>
            <div className="skya-priority-strip">{[["Alta", "alta", "#d36b66"], ["Media", "media", "#d9952f"], ["Baja", "baja", "#2eaa75"]].map(([nombre, clave, color]) => <div className="skya-priority-item" key={clave}><span className="skya-legend-dot" style={{ background: color }} /><span>{nombre}</span><strong>{tickets.filter((ticket) => ticket.prioridad === clave).length}</strong></div>)}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
