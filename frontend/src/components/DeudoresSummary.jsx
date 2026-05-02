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

  const totalDeudaGeneral = deudoresList.reduce((sum, d) => sum + d.total, 0);

  if (deudoresList.length === 0) {
    return (
      <div className="card fade-in" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1.1rem' }}>No hay cuentas pendientes por cobrar en este momento. ✨</p>
      </div>
    );
  }

  const handleCopySummary = (deudor) => {
    const text = `RESUMEN PENDIENTE - ${deudor.name.toUpperCase()}\n---------------------------\nMonto total: ₡ ${deudor.total.toLocaleString('es-CR', { minimumFractionDigits: 2 })}\nRegistros: ${deudor.count}\n---------------------------`;
    navigator.clipboard.writeText(text);
    alert('Resumen copiado para enviar');
  };

  return (
    <div className="card fade-in" style={{ borderTop: '4px solid var(--danger)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="card-title" style={{ margin: 0, border: 'none', padding: 0 }}>
          Resumen de Cuentas por Cobrar
        </h2>
        <div style={{ padding: '0.6rem 1.2rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--danger)', fontWeight: '600', display: 'block' }}>DEUDA TOTAL GENERAL</span>
          <span style={{ fontSize: '1.4rem', color: 'var(--danger)', fontWeight: '800' }}>
            ₡ {totalDeudaGeneral.toLocaleString('es-CR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre del Cliente</th>
              <th style={{ textAlign: 'center' }}>Transacciones</th>
              <th style={{ textAlign: 'right' }}>Monto Adeudado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {deudoresList.map((deudor, index) => (
              <tr key={index}>
                <td style={{ fontWeight: '700', fontSize: '1rem' }}>{deudor.name}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className="status-badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                    {deudor.count} {deudor.count === 1 ? 'pendiente' : 'pendientes'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--danger)', fontSize: '1.1rem' }}>
                  ₡ {deudor.total.toLocaleString('es-CR', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    className="btn btn-sm btn-secondary" 
                    onClick={() => handleCopySummary(deudor)}
                    title="Copiar para WhatsApp"
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
