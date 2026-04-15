import React from 'react';

function PendientesSection({ sinpes, onToggleState }) {
  const pendientes = sinpes.filter(s => s.state === 'No confirmado');
  
  if (pendientes.length === 0) return null;

  return (
    <div className="pending-alert fade-in">
      <div>
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          SINPE Móvil Pendientes
        </h3>
        <p style={{ marginTop: "0.5rem", opacity: 0.9 }}>
          Tienes transacciones marcadas como "No confirmado".
        </p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="pending-count">
          {pendientes.length} pendientes
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '130px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {pendientes.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
              <span><strong>Guía:</strong> {p.guide_number}</span>
              <span><strong>Monto:</strong> ₡ {parseFloat(p.amount).toLocaleString('es-CR', { minimumFractionDigits: 2 })}</span>
              <button 
                className="btn btn-sm" 
                style={{ backgroundColor: 'var(--success)', color: 'white', padding: '0.2rem 0.6rem', border: '1px solid rgba(255,255,255,0.2)' }} 
                onClick={() => onToggleState(p.id)}
                title="Cambiar estado a Confirmado"
              >
                ✔ Confirmar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PendientesSection;
