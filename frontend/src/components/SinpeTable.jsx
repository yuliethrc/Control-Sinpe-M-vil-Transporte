import React, { useState } from 'react';
import { api } from '../api';

function SinpeTable({ sinpes, onRefresh, onEdit }) {
  const [filterName, setFilterName] = useState('');
  const [filterGuide, setFilterGuide] = useState('');
  const [filterState, setFilterState] = useState('');

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const datePart = isoString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      try {
        await api.deleteSinpe(id);
        onRefresh();
      } catch (err) {
        console.error(err);
        alert("Error al eliminar");
      }
    }
  };

  const handleToggleState = async (id) => {
    try {
      await api.toggleState(id);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Error al cambiar estado");
    }
  };

  const filteredSinpes = sinpes.filter(s => {
    const matchName = s.client_name.toLowerCase().includes(filterName.toLowerCase());
    const matchGuide = s.guide_number.includes(filterGuide);
    const matchState = filterState ? s.state === filterState : true;
    return matchName && matchGuide && matchState;
  });

  return (
    <div>
      <div className="filters-bar">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Buscar por cliente..." 
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
        />
        <input 
          type="text" 
          className="form-control" 
          placeholder="Buscar por guía..." 
          value={filterGuide}
          onChange={e => setFilterGuide(e.target.value)}
        />
        <select 
          className="form-control"
          value={filterState}
          onChange={e => setFilterState(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Confirmado">Confirmado</option>
          <option value="No confirmado">No confirmado</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Guía</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Recibido por</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSinpes.length > 0 ? (
              filteredSinpes.map(s => (
                <tr key={s.id}>
                  <td>{formatDate(s.date)}</td>
                  <td>{s.guide_number}</td>
                  <td>{s.client_name}</td>
                  <td>₡ {parseFloat(s.amount).toLocaleString('es-CR', { minimumFractionDigits: 2 })}</td>
                  <td>{s.received_by}</td>
                  <td>
                    <span 
                      className={`badge ${s.state === 'Confirmado' ? 'badge-success' : 'badge-warning'}`}
                      onClick={() => handleToggleState(s.id)}
                      title="Haz clic para cambiar estado"
                    >
                      {s.state}
                    </span>
                  </td>
                  <td>
                    <div className="flex-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => onEdit(s)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: "2rem", color: "var(--text-muted)" }}>
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SinpeTable;
