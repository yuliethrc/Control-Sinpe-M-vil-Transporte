import React, { useState, useEffect } from 'react';
import SinpeForm from './components/SinpeForm';
import SinpeTable from './components/SinpeTable';
import PendientesSection from './components/PendientesSection';
import DeudoresSummary from './components/DeudoresSummary';
import { api } from './api';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('sinpe_auth') === 'true'
  );
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [sinpes, setSinpes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [activeTab, setActiveTab] = useState('historial'); // 'historial' o 'deudores'

  const fetchSinpes = async () => {
    try {
      const data = await api.getSinpes();
      setSinpes(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSinpes();
  }, []);

  const handleEdit = (sinpe) => {
    setEditingId(sinpe.id);
    setEditingData(sinpe);
  };

  const handleSave = async () => {
    setEditingId(null);
    setEditingData(null);
    await fetchSinpes();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUser === 'transporte' && loginPass === 'zarcereños2026') {
      localStorage.setItem('sinpe_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sinpe_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem', background: 'var(--bg-color)' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
          <img src="/logo.png" alt="Logo" style={{ maxWidth: '200px', marginBottom: '1.5rem', marginTop: '1rem', objectFit: 'contain' }} />
          <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: '800' }}>Acceso Restringido</h2>
          <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>Control SINPE Móvil</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Usuario</label>
              <input 
                type="text" 
                className="form-control" 
                value={loginUser} 
                onChange={e => setLoginUser(e.target.value)} 
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Contraseña</label>
              <input 
                type="password" 
                className="form-control" 
                value={loginPass} 
                onChange={e => setLoginPass(e.target.value)} 
                required
              />
            </div>
            {loginError && <div style={{ color: 'var(--danger)', fontSize: '0.95rem', textAlign: 'center' }}>{loginError}</div>}
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.8rem' }}>Entrar al Sistema</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container fade-in">
      <header className="header">
        <img src="/logo.png" alt="Transportes Los Zarcereños Logo" className="app-logo" />
        <div className="header-title-container">
          <h1>Control SINPE MÓVIL</h1>
          <p>TRANSPORTES LOS ZARCEREÑOS</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#bfdbfe', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Cerrar sesión
        </button>
      </header>

      <PendientesSection 
        sinpes={sinpes} 
        onToggleState={async (id) => { 
          await api.toggleState(id); 
          await fetchSinpes(); 
        }} 
      />

      <div className="main-content">
        <aside>
          <div className="card">
            <h2 className="card-title">
              {editingId ? "Editar Registro" : "Nuevo Registro"}
            </h2>
            <SinpeForm 
              onSave={handleSave} 
              editData={editingData} 
              onCancel={() => { setEditingId(null); setEditingData(null); }} 
              sinpes={sinpes}
            />
          </div>
        </aside>

        <section>
          {/* Tabs mejoradas para mayor visibilidad */}
          <div className="tabs-container" style={{ 
            marginBottom: '2rem', 
            display: 'flex', 
            gap: '0.8rem', 
            background: 'rgba(0,0,0,0.03)', 
            padding: '0.5rem', 
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <button 
              className={`tab-btn ${activeTab === 'historial' ? 'active' : ''}`}
              onClick={() => setActiveTab('historial')}
              style={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                border: 'none', 
                padding: '1rem', 
                cursor: 'pointer', 
                borderRadius: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: activeTab === 'historial' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'historial' ? 'white' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '1rem',
                boxShadow: activeTab === 'historial' ? '0 4px 12px rgba(30, 58, 138, 0.3)' : 'none'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Historial de Transacciones
            </button>
            <button 
              className={`tab-btn ${activeTab === 'deudores' ? 'active' : ''}`}
              onClick={() => setActiveTab('deudores')}
              style={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                border: 'none', 
                padding: '1rem', 
                cursor: 'pointer', 
                borderRadius: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: activeTab === 'deudores' ? 'var(--danger)' : 'transparent',
                color: activeTab === 'deudores' ? 'white' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '1rem',
                boxShadow: activeTab === 'deudores' ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Resumen de Deudores
            </button>
          </div>

          {activeTab === 'historial' ? (
            <div className="card fade-in">
              <h2 className="card-title">Historial de Transacciones</h2>
              <SinpeTable 
                sinpes={sinpes} 
                onRefresh={fetchSinpes}
                onEdit={handleEdit}
              />
            </div>
          ) : (
            <DeudoresSummary sinpes={sinpes} />
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
