import React, { useState } from 'react';
import './Accommodation.css';

const Accommodation = () => {
  const [openAmenities, setOpenAmenities] = useState({});
  const toggleAmenities = (id) => setOpenAmenities((prev) => ({ ...prev, [id]: !prev[id] }));

  const getPriceLevel = (priceStr) => {
    const num = Number((priceStr || '').replace(/[^0-9.]/g, '')) || 0;
    if (num >= 120) return '€€€';
    if (num >= 80) return '€€';
    return '€';
  };

  const isNear = (distanceStr) => (distanceStr || '').toLowerCase().includes('mismo lugar');

  const hotels = [
    {
      id: 1,
      name: "Hotel Mondariz Balneario",
      category: "⭐⭐⭐⭐⭐ RECOMENDADO",
      description: "Lujoso balneario con aguas termales, spa y todos los servicios. ¡El lugar perfecto para relajarse antes y después de la boda!",
      amenities: [
        "Spa con aguas termales",
        "Piscina climatizada",
        "Parking gratuito",
        "WiFi de alta velocidad",
        "Desayuno incluido",
        "Precio especial para invitados"
      ],
      distance: "Mismo lugar de la celebración",
      price: "Desde 150€/noche",
      phone: "+34 986 656 156",
      website: "https://www.balneariomondariz.es/",
      image: "/images/accommodations/mondariz.jpg",
      discount: "🎁 Código descuento: BODADANIANA2026"
    },
    {
      id: 2,
      name: "Hotel Villa Termal Caldas",
      category: "⭐⭐⭐⭐",
      description: "Hotel con encanto en Caldas de Reis, perfecto para una estancia relajante con aguas termales naturales.",
      amenities: [
        "Aguas termales naturales",
        "Parking gratuito",
        "WiFi gratuito",
        "Restaurante local",
        "Ambiente tranquilo"
      ],
      distance: "20 min del lugar (18 km)",
      price: "Desde 80€/noche",
      phone: "+34 986 540 000",
      website: "",
      image: "/images/accommodations/caldas.jpg",
      discount: ""
    },
    {
      id: 3,
      name: "Parador de Pontevedra",
      category: "⭐⭐⭐⭐",
      description: "Parador histórico en el casco histórico de Pontevedra, ideal para conocer la ciudad y su patrimonio.",
      amenities: [
        "Edificio histórico restaurado",
        "Restaurante gourmet",
        "Parking disponible",
        "WiFi gratuito",
        "Centro histórico"
      ],
      distance: "30 min del lugar (25 km)",
      price: "Desde 95€/noche",
      phone: "+34 986 855 800",
      website: "www.parador.es/es/paradores/parador-de-pontevedra",
      image: "/images/accommodations/parador.jpg",
      discount: ""
    },
    {
      id: 4,
      name: "Casas Rurales",
      category: "⭐⭐⭐",
      description: "Opciones más económicas en casas rurales y pensiones de la zona. Perfectas para grupos y familias.",
      amenities: [
        "Ambiente rural auténtico",
        "Ideal para grupos",
        "Precios económicos",
        "Cocina disponible",
        "Entorno natural"
      ],
      distance: "Varios (15-25 km)",
      price: "Desde 45€/noche",
      phone: "",
      website: "https://www.airbnb.es/s/Mondariz-Balneario",
      image: "/images/accommodations/rural.jpg",
      discount: ""
    }
  ];

  const handleReservation = (hotel) => {
    const message = `Hola, me gustaría hacer una reserva para la boda de Dani y Ana (8 de Agosto, 2026) en ${hotel.name}. Por favor, apliquen el descuento especial.`;
    const whatsapp = `https://wa.me/34123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsapp, '_blank');
  };

  return (
    <div className="accommodation-page">
      {/* Header */}
      <div className="accommodation-header">
        <div className="container">
          <h1 className="accommodation-title">
            <i className="fas fa-bed"></i>
            Alojamiento
          </h1>
          <p className="accommodation-subtitle">
            Encuentra el lugar perfecto para quedarte durante nuestra celebración
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="accommodation-content">
        <div className="container">
          
          {/* Información general */}
          <div className="info-section">
            <div className="info-card glass">
              <h3>
                <i className="fas fa-info-circle"></i> Información Importante
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <i className="fas fa-calendar-alt"></i>
                  <div>
                    <strong>Fechas recomendadas</strong>
                    <p>7-9 de Agosto, 2026</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <strong>Reserva pronto</strong>
                    <p>Los hoteles se llenan rápido en temporada alta</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="fas fa-tag"></i>
                  <div>
                    <strong>Descuentos especiales</strong>
                    <p>Menciona "Boda Dani&Ana" al reservar</p>
                  </div>
                </div>
              </div>

              {/* Distancias al lugar del banquete */}
              <div className="banquet-distances">
                <h3>
                  <i className="fas fa-map-marker-alt"></i> Distancias al lugar del banquete
                </h3>
                <div className="distances-grid">
                  <div className="distance-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <strong>Pontevedra</strong>
                      <p>25 km</p>
                    </div>
                  </div>
                  <div className="distance-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <strong>Vigo</strong>
                      <p>35 km</p>
                    </div>
                  </div>
                  <div className="distance-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <strong>Santiago de Compostela</strong>
                      <p>60 km</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Lista de hoteles */}
          <div className="hotels-section">
            <h2 className="section-title">Hoteles Recomendados</h2>
            <div className="hotels-grid">
              {hotels.map(hotel => (
                <div key={hotel.id} className="hotel-card glass">
                  <div className="hotel-image">
                    <img src={hotel.image} alt={hotel.name} />
                    <div className="hotel-category">{hotel.category}</div>
                    <div className="hotel-distance">
                      <i className="fas fa-route"></i>
                      <span>{hotel.distance}</span>
                    </div>
                  </div>
                  
                  <div className="hotel-content">
                    <h3 className="hotel-name">{hotel.name}</h3>

                    {/* Chips meta */}
                    <div className="hotel-meta-chips">
                      <span className="chip chip--price" title="Rango de precio">{getPriceLevel(hotel.price)}</span>
                      {isNear(hotel.distance) && (
                        <span className="chip chip--near" title="Muy cerca">
                          <i className="fas fa-walking"></i> Cerca
                        </span>
                      )}
                      {hotel.discount && (
                        <span className="chip chip--discount" title="Descuento disponible">
                          <i className="fas fa-gift"></i> Descuento
                        </span>
                      )}
                    </div>

                    <p className="hotel-description">{hotel.description}</p>
                    
                    <div className="hotel-details">
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{hotel.distance}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-euro-sign"></i>
                        <span>{hotel.price}</span>
                      </div>
                    </div>

                    {/* Servicios colapsables */}
                    <div className={`amenities ${openAmenities[hotel.id] ? 'open' : ''}`}>
                      <div className="amenities-header">
                        <h4>Servicios incluidos</h4>
                        <button
                          className="amenities-toggle"
                          onClick={() => toggleAmenities(hotel.id)}
                          aria-expanded={!!openAmenities[hotel.id]}
                          aria-controls={`amenities-${hotel.id}`}
                        >
                          {openAmenities[hotel.id] ? 'Ocultar' : 'Ver'}
                        </button>
                      </div>
                      <ul id={`amenities-${hotel.id}`} className="amenities-list">
                        {hotel.amenities.map((amenity, index) => (
                          <li key={index} className="amenity-pill">
                            <i className="fas fa-check"></i>
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {hotel.discount && (
                      <div className="discount-banner">
                        <i className="fas fa-gift"></i>
                        {hotel.discount}
                      </div>
                    )}

                    <div className="hotel-actions">
                      <div className="contact-info">
                        {hotel.phone && (
                          <a href={`tel:${hotel.phone}`} className="phone-link">
                            <i className="fas fa-phone"></i>
                            {hotel.phone}
                          </a>
                        )}
                        {hotel.website && (
                          <a href={`https://${hotel.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="website-link">
                            <i className="fas fa-globe"></i>
                            Sitio web
                          </a>
                        )}
                      </div>
                      <button 
                        className="reserve-btn"
                        onClick={() => handleReservation(hotel)}
                      >
                        <i className="fas fa-calendar-check"></i>
                        Reservar ahora
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          
        </div>
      </div>
    </div>
  );
};

export default Accommodation;
