import React, { useState } from 'react';
import './GiftList.css';

const GiftList = () => {
  const [activeCategory, setActiveCategory] = useState('home');

  const giftCategories = {
    home: {
      name: "Para el hogar",
      icon: "fas fa-home",
      color: "#2c3e50",
      gifts: [
        {
          id: 1,
          name: "Juego de Sábanas Premium",
          description: "Sábanas de algodón egipcio 400 hilos, super suaves",
          price: "€89",
          image: "/images/img_story1.jpg",
          store: "El Corte Inglés",
          priority: "high"
        },
        {
          id: 2,
          name: "Cafetera Espresso",
          description: "Cafetera automática con molinillo integrado",
          price: "€299",
          image: "/images/img_story2.jpg",
          store: "MediaMarkt",
          priority: "high"
        },
        {
          id: 3,
          name: "Juego de Toallas",
          description: "Set de 6 toallas de bambú ultra absorbentes",
          price: "€65",
          image: "/images/img_story3.jpg",
          store: "Zara Home",
          priority: "medium"
        },
        {
          id: 4,
          name: "Aspiradora Robot",
          description: "Aspiradora inteligente con mapeo láser",
          price: "€399",
          image: "/images/img_story4.jpg",
          store: "Amazon",
          priority: "high"
        }
      ]
    },
    kitchen: {
      name: "Cocina",
      icon: "fas fa-utensils",
      color: "#e74c3c",
      gifts: [
        {
          id: 5,
          name: "Batidora KitchenAid",
          description: "Batidora amasadora profesional, varios colores",
          price: "€449",
          image: "/images/img_story5.jpg",
          store: "El Corte Inglés",
          priority: "high"
        },
        {
          id: 6,
          name: "Juego de Cuchillos",
          description: "Set profesional de cuchillos japoneses con soporte",
          price: "€199",
          image: "/images/img_story1.jpg",
          store: "Cuchillería Simón",
          priority: "medium"
        },
        {
          id: 7,
          name: "Thermomix",
          description: "Robot de cocina multifunción última generación",
          price: "€1,359",
          image: "/images/img_story2.jpg",
          store: "Tienda Oficial",
          priority: "high"
        },
        {
          id: 8,
          name: "Vajilla Completa",
          description: "Servicio de mesa para 8 personas, porcelana fina",
          price: "€159",
          image: "/images/img_story3.jpg",
          store: "Villeroy & Boch",
          priority: "medium"
        }
      ]
    },
    tech: {
      name: "Tecnología",
      icon: "fas fa-tv",
      color: "#3498db",
      gifts: [
        {
          id: 9,
          name: "Smart TV 55\"",
          description: "Televisor OLED 4K con sistema operativo smart",
          price: "€899",
          image: "/images/img_story4.jpg",
          store: "MediaMarkt",
          priority: "high"
        },
        {
          id: 10,
          name: "Sistema de Sonido",
          description: "Altavoces bluetooth de alta calidad para toda la casa",
          price: "€299",
          image: "/images/img_story5.jpg",
          store: "Fnac",
          priority: "medium"
        },
        {
          id: 11,
          name: "Tablet para Cocina",
          description: "Tablet resistente al agua para recetas y entretenimiento",
          price: "€249",
          image: "/images/img_story1.jpg",
          store: "Apple Store",
          priority: "low"
        }
      ]
    },
    experience: {
      name: "Experiencias",
      icon: "fas fa-heart",
      color: "#d4af37",
      gifts: [
        {
          id: 12,
          name: "Fin de Semana Romántico",
          description: "Escapada a hotel rural con spa y cenas incluidas",
          price: "€299",
          image: "/images/img_story2.jpg",
          store: "Smartbox",
          priority: "high"
        },
        {
          id: 13,
          name: "Curso de Cocina para Parejas",
          description: "Clases de cocina internacional con chef profesional",
          price: "€179",
          image: "/images/img_story3.jpg",
          store: "Escuela de Cocina",
          priority: "medium"
        },
        {
          id: 14,
          name: "Sesión de Fotos",
          description: "Sesión fotográfica profesional en exteriores",
          price: "€199",
          image: "/images/img_story4.jpg",
          store: "Fotógrafo local",
          priority: "medium"
        }
      ]
    }
  };

  const handleGiftPurchase = (gift) => {
    const message = `Hola! Me gustaría contribuir al regalo "${gift.name}" de la lista de boda de Dani y Ana (8 de Agosto, 2026).`;
    const whatsapp = `https://wa.me/34123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsapp, '_blank');
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { text: "Prioritario", class: "priority-high" },
      medium: { text: "Deseado", class: "priority-medium" },
      low: { text: "Opcional", class: "priority-low" }
    };
    return badges[priority];
  };

  return (
    <div className="gift-list-page">
      {/* Header */}
      <div className="gift-list-header">
        <div className="container">
          <h1 className="gift-list-title">
            <i className="fas fa-gift"></i>
            Lista de Regalos
          </h1>
          <p className="gift-list-subtitle">
            Ayúdanos a comenzar nuestra nueva vida juntos con estos regalos especiales
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="gift-list-content">
        <div className="container">
          
          {/* Information Section */}
          <div className="gift-info-section">
            <div className="gift-info-card glass">
              <h3><i className="fas fa-info-circle"></i> Cómo funciona nuestra lista</h3>
              <div className="info-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Elige tu regalo</h4>
                    <p>Navega por las categorías y encuentra el regalo perfecto</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Contacta con nosotros</h4>
                    <p>Haz clic en "Regalar" y te ayudaremos con la compra</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>¡Listo!</h4>
                    <p>Nosotros gestionamos la entrega y actualización de la lista</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="category-nav">
            {Object.entries(giftCategories).map(([key, category]) => (
              <button
                key={key}
                className={`category-btn ${activeCategory === key ? 'active' : ''}`}
                onClick={() => setActiveCategory(key)}
                style={{ borderColor: activeCategory === key ? category.color : 'transparent' }}
              >
                <i className={category.icon} style={{ color: category.color }}></i>
                {category.name}
              </button>
            ))}
          </div>

          {/* Gifts Grid */}
          <div className="gifts-section">
            <h2 className="category-title" style={{ color: giftCategories[activeCategory].color }}>
              <i className={giftCategories[activeCategory].icon}></i>
              {giftCategories[activeCategory].name}
            </h2>
            
            <div className="gifts-grid">
              {giftCategories[activeCategory].gifts.map(gift => {
                const priority = getPriorityBadge(gift.priority);
                return (
                  <div key={gift.id} className="gift-card glass">
                    <div className="gift-image">
                      <img src={gift.image} alt={gift.name} />
                      <div className={`priority-badge ${priority.class}`}>
                        {priority.text}
                      </div>
                    </div>
                    
                    <div className="gift-content">
                      <h3 className="gift-name">{gift.name}</h3>
                      <p className="gift-description">{gift.description}</p>
                      
                      <div className="gift-details">
                        <div className="gift-price">{gift.price}</div>
                        <div className="gift-store">
                          <i className="fas fa-store"></i>
                          {gift.store}
                        </div>
                      </div>

                      <button 
                        className="gift-btn"
                        onClick={() => handleGiftPurchase(gift)}
                        style={{ background: `linear-gradient(135deg, ${giftCategories[activeCategory].color}, #34495e)` }}
                      >
                        <i className="fas fa-gift"></i>
                        Regalar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alternative Options */}
          <div className="alternative-options">
            <h2 className="section-title">💝 Otras formas de contribuir</h2>
            <div className="options-grid">
              <div className="option-card glass">
                <i className="fas fa-plane"></i>
                <h3>Luna de Miel</h3>
                <p>Contribuye a nuestro viaje de luna de miel a Japón. Cada aportación nos ayudará a crear recuerdos inolvidables.</p>
                <div className="honeymoon-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <span className="progress-text">€1,950 / €3,000</span>
                </div>
                <button className="contribute-btn">
                  <i className="fas fa-heart"></i>
                  Contribuir a la luna de miel
                </button>
              </div>
              
              <div className="option-card glass">
                <i className="fas fa-home"></i>
                <h3>Nuestro nuevo hogar</h3>
                <p>Ayúdanos a amueblar y decorar nuestro primer hogar juntos. Cualquier contribución será muy apreciada.</p>
                <button className="contribute-btn">
                  <i className="fas fa-hand-holding-heart"></i>
                  Contribuir al hogar
                </button>
              </div>
              
              <div className="option-card glass">
                <i className="fas fa-surprise"></i>
                <h3>Sorpréndenos</h3>
                <p>Si prefieres hacer algo diferente, ¡sorpréndenos! Sabemos que cualquier cosa que elijas vendrá del corazón.</p>
                <button className="contribute-btn">
                  <i className="fas fa-magic"></i>
                  Crear sorpresa
                </button>
              </div>
            </div>
          </div>

          {/* Thank You Section */}
          <div className="thank-you-section">
            <div className="thank-you-card glass">
              <h3>💕 ¡Gracias por celebrar con nosotros!</h3>
              <p>
                Vuestra presencia en nuestro día especial es el mejor regalo que podríamos pedir. 
                Esta lista es solo una forma de ayudarnos a comenzar nuestra nueva vida juntos, 
                pero lo más importante para nosotros es teneros a nuestro lado celebrando nuestro amor.
              </p>
              <div className="signature">
                <span className="names">Con todo nuestro amor,</span>
                <span className="couple-names">Dani & Ana 💕</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftList;
