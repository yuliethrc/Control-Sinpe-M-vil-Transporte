import React, { useState, useEffect } from 'react';
import { api } from '../api';

const RECEIVERS = ['Jared', 'Jafet', 'Marcos', 'Gilberth', 'Karol', 'Yuli', 'Otro'];

function SinpeForm({ onSave, editData, onCancel, sinpes }) {
  const [formData, setFormData] = useState({
    date: '',
    guide_number: '',
    client_name: '',
    amount: '',
    received_by: '',
    state: 'No confirmado'
  });
  const [error, setError] = useState('');

  // Extraer nombres únicos para autocompletado
  const uniqueClients = [...new Set((sinpes || []).map(s => s.client_name))].sort();

  // Función utilitaria para fecha dd/mm/yyyy
  const getTodayFormatted = () => {
    const d = new Date();
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const parseToDDMMYYYY = (isoDate) => {
    if (!isoDate) return '';
    const part = isoDate.split('T')[0];
    const [year, month, day] = part.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        date: parseToDDMMYYYY(editData.date),
      });
    } else {
      setFormData({
        date: getTodayFormatted(),
        guide_number: '',
        client_name: '',
        amount: '',
        received_by: '',
        state: 'No confirmado'
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      let val = value.replace(/\D/g, ''); // keep only numbers
      if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2);
      if (val.length >= 6) val = val.substring(0, 5) + '/' + val.substring(5, 9);
      setFormData(prev => ({ ...prev, [name]: val }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guide_number || parseInt(formData.guide_number) <= 0) {
      setError("El número de guía debe ser válido.");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("El monto debe ser mayor a 0.");
      return;
    }

    try {
      // Formatear correctamente la fecha y hora si está especificada
      let payloadDate = undefined;
      if (formData.date && formData.date.length === 10) {
        const [day, month, year] = formData.date.split('/');
        payloadDate = new Date(`${year}-${month}-${day}T12:00:00`).toISOString();
      }
      
      if (editData) {
        await api.updateSinpe(editData.id, { ...formData, date: payloadDate });
      } else {
        await api.createSinpe({ ...formData, date: payloadDate });
      }
      
      // Limpiar formulario tras guardar
      if (!editData) {
        setFormData({
          date: getTodayFormatted(),
          guide_number: '',
          client_name: '',
          amount: '',
          received_by: '',
          state: 'No confirmado'
        });
      }
      onSave();
    } catch (err) {
      console.error(err);
      setError("Error al guardar el registro. Revisa tu conexión.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: "var(--danger)", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}
      
      <div className="form-group">
        <label>Fecha (Día/Mes/Año)</label>
        <input 
          type="text" 
          name="date" 
          className="form-control" 
          placeholder="DD/MM/YYYY"
          maxLength="10"
          value={formData.date}
          onChange={handleChange} 
          required
        />
      </div>

      <div className="form-group">
        <label>Número de guía</label>
        <input 
          type="number" 
          name="guide_number" 
          className="form-control" 
          placeholder="Ej: 12345"
          value={formData.guide_number}
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Nombre del cliente</label>
        <input 
          type="text" 
          name="client_name" 
          className="form-control" 
          placeholder="Nombre completo"
          value={formData.client_name}
          onChange={handleChange} 
          list="client-names"
          required 
        />
        <datalist id="client-names">
          {uniqueClients.map(client => (
            <option key={client} value={client} />
          ))}
        </datalist>
      </div>

      <div className="form-group">
        <label>Monto</label>
        <input 
          type="number" 
          name="amount" 
          className="form-control" 
          placeholder="0.00"
          step="0.01"
          value={formData.amount}
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group" style={{ marginBottom: formData.state === 'Confirmado' ? '1rem' : '1.5rem' }}>
        <label>Estado Inicial</label>
        <select 
          name="state" 
          className="form-control" 
          value={formData.state}
          onChange={handleChange}
        >
          <option value="No confirmado">No confirmado</option>
          <option value="Confirmado">Confirmado</option>
        </select>
      </div>

      {formData.state === 'Confirmado' && (
        <div className="form-group" style={{ marginBottom: "1.5rem", animation: "fadeIn 0.3s" }}>
          <label>Recibido por</label>
          <select 
            name="received_by" 
            className="form-control" 
            value={formData.received_by}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona --</option>
            {RECEIVERS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex-actions">
        <button type="submit" className="btn btn-primary btn-block">
          {editData ? 'Actualizar Registro' : 'Guardar SINPE'}
        </button>
        {editData && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} style={{ width: "100%" }}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default SinpeForm;
