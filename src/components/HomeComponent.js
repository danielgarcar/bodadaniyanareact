import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    '/images/img_story1.jpg',
    '/images/img_story2.jpg',
    '/images/img_story3.jpg',
    '/images/img_story4.jpg',
    '/images/img_story5.jpg'
  ];

  const weddingDate = new Date('2026-08-08T17:00:00');

  // Countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Background image rotation
  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 8000);

    return () => clearInterval(imageTimer);
  }, []);

  const scrollToNextSection = () => {
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
      welcomeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section with rotating background */}
      <section 
        className="hero-section"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImages[currentImageIndex]})` }}
      >
        <div className="hero-content">
          <h1 className="hero-title fade-in">
            <span className="name">Dani</span>
            <span className="ampersand">&</span>
            <span className="name">Ana</span>
          </h1>
          <p className="hero-subtitle fade-in">
            "Dos corazones, una historia, un futuro juntos"
          </p>
          <div className="wedding-date fade-in">8 de Agosto, 2026</div>
          
          <div className="countdown-section fade-in">
            <div className="countdown-label">FALTAN</div>
            <div className="countdown-container">
              <div className="countdown-item">
                <div className="countdown-number">{countdown.days}</div>
                <div className="countdown-unit">Días</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-number">{countdown.hours}</div>
                <div className="countdown-unit">Horas</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-number">{countdown.minutes}</div>
                <div className="countdown-unit">Minutos</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-number">{countdown.seconds}</div>
                <div className="countdown-unit">Segundos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Image indicators */}
        <div className="image-indicator">
          {backgroundImages.map((_, index) => (
            <div
              key={index}
              className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator" onClick={scrollToNextSection}>
          <i className="fas fa-chevron-down scroll-arrow"></i>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="container">
          <div className="welcome-content fade-in">
            <h2>¡Bienvenidos a nuestra boda!</h2>
            <p className="welcome-text">
              Queremos compartir con vosotros uno de los días más especiales de nuestras vidas. 
              Aquí encontraréis toda la información necesaria para acompañarnos en esta 
              celebración llena de amor, alegría y buenos momentos.
            </p>
            
            <div className="cta-buttons">
              <Link to="/rsvp" className="btn btn-primary">
                <i className="fas fa-envelope"></i>
                Confirmar Asistencia
              </Link>
              <Link to="/details" className="btn btn-secondary">
                <i className="fas fa-calendar"></i>
                Ver Detalles
              </Link>
            </div>

            {/* Quick Links */}
            <div className="quick-links">
              <h3>Información útil</h3>
              <div className="quick-links-grid">
                <Link to="/accommodation" className="quick-link">
                  <i className="fas fa-bed"></i>
                  <span>Dónde alojarse</span>
                </Link>
                <Link to="/faq" className="quick-link">
                  <i className="fas fa-question-circle"></i>
                  <span>Preguntas frecuentes</span>
                </Link>
                <Link to="/gallery" className="quick-link">
                  <i className="fas fa-images"></i>
                  <span>Galería de fotos</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="quick-info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card fade-in">
              <span className="info-icon">🕐</span>
              <h3>Cuándo</h3>
              <p>8 de Agosto, 2026<br />17:00 horas</p>
            </div>
            <div className="info-card fade-in">
              <span className="info-icon">📍</span>
              <h3>Dónde</h3>
              <p>Hotel Mondariz Balneario<br />Mondariz, Pontevedra</p>
            </div>
            <div className="info-card fade-in">
              <span className="info-icon">👗</span>
              <h3>Dress Code</h3>
              <p>Formal / Cocktail<br />Evitar blanco y negro</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <div className="container">
          <div className="quote-content fade-in">
            <blockquote>
              El amor no es mirarse el uno al otro, sino mirar juntos en la misma dirección
            </blockquote>
            <cite>— Antoine de Saint-Exupéry</cite>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
