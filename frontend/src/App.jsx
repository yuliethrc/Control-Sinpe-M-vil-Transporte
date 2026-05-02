import React, { useState, useEffect } from 'react';
import SinpeForm from './components/SinpeForm';
import SinpeTable from './components/SinpeTable';
import PendientesSection from './components/PendientesSection';
import DeudoresSummary from './components/DeudoresSummary';
import { api } from './api';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
      if (error.status === 401 || error.status === 403) {
        setIsAuthenticated(false);
      }
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const session = await api.getSession();
      if (session) {
        setIsAuthenticated(true);
        fetchSinpes();
      }
    };
    checkSession();
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoginError('');
      await api.login(loginUser, loginPass);
      setIsAuthenticated(true);
      fetchSinpes();
    } catch (error) {
      setLoginError('Credenciales inválidas o error de conexión');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setIsAuthenticated(false);
      setSinpes([]);
    } catch (error) {
      console.error(error);
    }
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Correo Electrónico</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="ejemplo@correo.com"
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
          <div className="tabs-container">
            <button 
              className={`tab-btn ${activeTab === 'historial' ? 'active-historial' : ''}`}
              onClick={() => setActiveTab('historial')}
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
              className={`tab-btn ${activeTab === 'deudores' ? 'active-deudores' : ''}`}
              onClick={() => setActiveTab('deudores')}
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
