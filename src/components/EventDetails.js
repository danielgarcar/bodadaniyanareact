import React, { useState } from 'react';
import './EventDetails.css';

const EventDetails = () => {
  const schedule = [
    { time: '17:00', event: 'Ceremonia religiosa', location: 'Iglesia Santa Baia de Mondariz', icon: '⛪' },
    { time: '18:00', event: 'Cóctel de bienvenida', location: 'Hotel Balneario Mondariz', icon: '🥂' },
    { time: '20:00', event: 'Banquete nupcial', location: 'Salón principal (Hotel)', icon: '🍽️' },
    { time: '22:30', event: 'Primer baile', location: 'Pista de baile (Hotel)', icon: '💃' },
    { time: '23:00', event: 'Fiesta y baile', location: 'Salón privado (Hotel)', icon: '🎉' },
    { time: '03:00', event: 'After Party', location: 'Sala privada (Hotel)', icon: '🌙' }
  ];

  // Datos de ubicaciones
  const ceremony = {
    name: 'Iglesia Santa Baia de Mondariz',
    address: 'Praza de San Miguel, 1, 36870 Mondariz, Pontevedra',
    lat: 42.2339,
    lng: -8.4692,
    mapsQuery: 'Iglesia Santa Baia de Mondariz'
  };
  const reception = {
    name: 'Hotel Balneario de Mondariz',
    address: 'Av. Enrique Peinador s/n, 36890 Mondariz-Balneario, Pontevedra',
    lat: 42.2319,
    lng: -8.4639,
    mapsQuery: 'Hotel Balneario Mondariz'
  };

  const [activePlace, setActivePlace] = useState('ceremony');
  const place = activePlace === 'ceremony' ? ceremony : reception;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${place.name} - ${place.address}`);
      alert('Dirección copiada');
    } catch (_) {
      alert('No se pudo copiar la dirección');
    }
  };

  const googleCalendarUrl = () => {
    // 8 agosto 2026 17:00-23:00 (España, UTC+2) => 15:00-21:00Z
    const text = encodeURIComponent('Boda Dani & Ana');
    const dates = '20260808T150000Z/20260808T210000Z';
    const details = encodeURIComponent('Ceremonia: Iglesia Santa Baia de Mondariz. Recepción: Hotel Balneario de Mondariz.');
    const location = encodeURIComponent(`${reception.name}, ${reception.address}`);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <div className="event-details-container">
      {/* Hero */}
      <section className="details-hero">
        <div className="container">
          <h1 className="details-title fade-in">Detalles del Evento</h1>
          <p className="details-subtitle fade-in">
            Toda la información que necesitas para disfrutar al máximo de nuestro gran día.
          </p>

          {/* Datos rápidos */}
          <div className="quick-facts">
            <div className="qf-card">
              <div className="qf-icon">📅</div>
              <div>
                <h3>Fecha</h3>
                <p>8 de agosto de 2026</p>
              </div>
            </div>
            <div className="qf-card">
              <div className="qf-icon">🕔</div>
              <div>
                <h3>Hora</h3>
                <p>17:00 (Inicio ceremonia)</p>
              </div>
            </div>
            <div className="qf-card">
              <div className="qf-icon">⛪</div>
              <div>
                <h3>Ceremonia</h3>
                <p>{ceremony.name}</p>
              </div>
            </div>
            <div className="qf-card">
              <div className="qf-icon">🏨</div>
              <div>
                <h3>Recepción</h3>
                <p>{reception.name}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline del día */}
      <section className="schedule-section">
        <div className="container">
          <h2 className="section-title">Programa del día</h2>
          <div className="modern-timeline">
            {schedule.map((item, idx) => (
              <div key={idx} className="mt-item">
                <div className="mt-time">{item.time}</div>
                <div className="mt-dot" aria-hidden="true"></div>
                <div className="mt-card">
                  <div className="mt-icon" aria-hidden="true">{item.icon}</div>
                  <div className="mt-content">
                    <h3>{item.event}</h3>
                    <p>{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ubicaciones y mapa con pestañas */}
      <section className="venue-section">
        <div className="container">
          <div className="tabs">
            <button className={`tab ${activePlace === 'ceremony' ? 'active' : ''}`} onClick={() => setActivePlace('ceremony')}>Iglesia</button>
            <button className={`tab ${activePlace === 'reception' ? 'active' : ''}`} onClick={() => setActivePlace('reception')}>Hotel</button>
          </div>

          <div className="venue-grid">
            <div className="venue-info slide-in-left">
              <h2>{place.name}</h2>
              <p>{place.address}</p>

              <div className="venue-details">
                <div className="detail-item"><i className="fas fa-map-marker-alt"></i><span>Mondariz (Pontevedra)</span></div>
                <div className="detail-item"><i className="fas fa-parking"></i><span>Parking gratuito disponible</span></div>
                <div className="detail-item"><i className="fas fa-clock"></i><span>Llegar 15 min antes</span></div>
              </div>

              <div className="location-actions">
                <a className="map-btn" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapsQuery)}`} target="_blank" rel="noopener noreferrer">🗺️ Ver en Google Maps</a>
                <a className="map-btn" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.mapsQuery)}`} target="_blank" rel="noopener noreferrer">🚗 Cómo llegar</a>
                <button className="map-btn" onClick={copyAddress}>📋 Copiar dirección</button>
              </div>
            </div>

            <div className="venue-image slide-in-right">
              <iframe
                title={`Mapa ${place.name}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.lng-0.02}%2C${place.lat-0.02}%2C${place.lng+0.02}%2C${place.lat+0.02}&layer=mapnik&marker=${place.lat}%2C${place.lng}`}
                width="100%"
                height="420"
                style={{ border: '1px solid #ccc', borderRadius: '12px' }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetails;
