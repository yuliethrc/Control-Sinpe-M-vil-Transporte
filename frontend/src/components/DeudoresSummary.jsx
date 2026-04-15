import React from 'react';

function DeudoresSummary({ sinpes }) {
  // Solo consideramos los que están "No confirmado" como deuda
  const pendientes = sinpes.filter(s => s.state === 'No confirmado');
  
  // Agrupar por nombre de cliente y sumar
  const deudoresMap = pendientes.reduce((acc, current) => {
    const name = current.client_name || 'Sin Nombre';
    if (!acc[name]) {
      acc[name] = { total: 0, count: 0 };
    }
    acc[name].total += parseFloat(current.amount || 0);
    acc[name].count += 1;
    return acc;
  }, {});

  // Convertir a array para mostrar
  const deudoresList = Object.keys(deudoresMap).map(name => ({
    name,
    total: deudoresMap[name].total,
    count: deudoresMap[name].count
  })).sort((a, b) => b.total - a.total); // Ordenar de mayor a menor deuda

  if (deudoresList.length === 0) {
    return (
      <div className="card fade-in" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>No hay deudores pendientes en este momento.</p>
      </div>
    );
  }

  const handleCopySummary = (deudor) => {
    const text = `${deudor.name}: ₡ ${deudor.total.toLocaleString('es-CR', { minimumFractionDigits: 2 })} (${deudor.count} registros pendientes)`;
    navigator.clipboard.writeText(text);
    alert('Resumen copiado al portapapeles');
  };

  return (
    <div className="card fade-in" style={{ marginBottom: '2rem', borderLeft: '5px solid var(--danger)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Resumen de Deudores
        </h2>
        <span className="badge" style={{ backgroundColor: 'var(--danger)', color: 'white' }}>
          Total Deuda: ₡ {deudoresList.reduce((sum, d) => sum + d.total, 0).toLocaleString('es-CR', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="sinpe-table">
          <thead>
            <tr>
              <th>Nombre del Cliente</th>
              <th style={{ textAlign: 'center' }}>Registros</th>
              <th style={{ textAlign: 'right' }}>Monto Total Adeudado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {deudoresList.map((deudor, index) => (
              <tr key={index}>
                <td style={{ fontWeight: '600' }}>{deudor.name}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className="status-badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                    {deudor.count} pendientes
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--danger)', fontSize: '1.1rem' }}>
                  ₡ {deudor.total.toLocaleString('es-CR', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    className="btn btn-sm" 
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    onClick={() => handleCopySummary(deudor)}
                    title="Copiar resumen para enviar"
                  >
                    📋 Copiar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeudoresSummary;
