import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './GuestList.css';

const ACCESS_PASSWORD = 'dana210916';

const GuestList = () => {
  const [input, setInput] = useState('');
  const [access, setAccess] = useState(false);
  const [guests, setGuests] = useState([]);
  const [error, setError] = useState('');

  const handleAccess = async (e) => {
    e.preventDefault();
    if (input === ACCESS_PASSWORD) {
      setAccess(true);
      setError('');
      // Obtener lista de confirmados
      const { data } = await supabase
        .from('rsvp')
        .select('*, users(users)')
        .eq('status', 'confirmado');
      setGuests(data || []);
    } else {
      setError('Contraseña incorrecta');
    }
  };

  if (!access) {
    return (
      <div className="guestlist-container">
        <h2>Acceso a la Lista de Invitados</h2>
        <form onSubmit={handleAccess} className="guestlist-form">
          <input
            type="password"
            placeholder="Contraseña de acceso"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="guestlist-input"
          />
          <button type="submit" className="guestlist-btn">Entrar</button>
        </form>
        {error && <div className="guestlist-error">{error}</div>}
      </div>
    );
  }

  return (
    <div className="guestlist-container">
      <h2>Invitados que han confirmado asistencia</h2>
      <table className="guestlist-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acompañantes</th>
            <th>Mensaje</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {guests.length === 0 && (
            <tr><td colSpan="4">No hay confirmaciones aún.</td></tr>
          )}
          {guests.map((g, i) => (
            <tr key={i}>
              <td>{g.users ? g.users.users : 'Invitado'}</td>
              <td>{g.guests_count > 1 ? g.guests_count - 1 : 0}</td>
              <td>{g.message || '-'}</td>
              <td>{g.created_at ? new Date(g.created_at).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuestList;
