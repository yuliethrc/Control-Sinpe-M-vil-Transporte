import React from 'react';
import { generatePendientesPDF } from '../utils/pdfGenerator';

function PendientesSection({ sinpes, onToggleState }) {
  const pendientes = sinpes.filter(s => s.state === 'No confirmado');
  
  if (pendientes.length === 0) return null;

  return (
    <div className="pending-alert fade-in">
      <div style={{ flex: 1 }}>
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
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          className="btn" 
          style={{ 
            backgroundColor: 'white', 
            color: '#92400e', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            fontWeight: 'bold',
            border: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onClick={() => generatePendientesPDF(pendientes)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Descargar PDF
        </button>

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
