import React from 'react';
import './Horarios.css';

const horarios = [
  {
    time: '17:00',
    title: 'Ceremonia Religiosa',
    place: 'Iglesia Santa Baia de Mondariz',
    details: 'El momento más esperado: nuestra boda en la iglesia de Mondariz.'
  },
  {
    time: '18:00',
    title: 'Cóctel de Bienvenida',
    place: 'Hotel Balneario Mondariz',
    details: 'Disfruta de un cóctel especial en los jardines del hotel.'
  },
  {
    time: '20:00',
    title: 'Banquete Nupcial',
    place: 'Salón principal',
    details: 'Un menú variado y delicioso para todos los invitados.'
  },
  {
    time: '22:30',
    title: 'Primer Baile',
    place: 'Pista de baile',
    details: 'El primer baile de los novios, ¡no te lo pierdas!'
  },
  {
    time: '23:00',
    title: 'Fiesta y Baile',
    place: 'Salón privado del hotel',
    details: 'Música, barra libre y diversión hasta el amanecer.'
  },
  {
    time: '03:00',
    title: 'After Party',
    place: 'Sala privada del hotel',
    details: 'Para los más fiesteros, seguimos con la after party.'
  }
];

const Horarios = () => (
  <div className="horarios-container">
    <h2 className="horarios-title">Horarios del Día Especial</h2>
    <p className="horarios-subtitle">Aquí tienes todos los detalles del cronograma de nuestra boda. ¡No te pierdas ni un momento de la celebración!</p>
    <div className="horarios-timeline">
      {horarios.map((item, idx) => (
        <div key={idx} className="horario-item">
          <div className="horario-time">{item.time}</div>
          <div className="horario-content">
            <h3>{item.title}</h3>
            <p className="horario-place">{item.place}</p>
            <p className="horario-details">{item.details}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Horarios;
