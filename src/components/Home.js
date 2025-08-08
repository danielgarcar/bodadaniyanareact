import React, { useState, useEffect, useRef } from 'react';
import './Home.css';

const Home = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroRef = useRef(null);
  const weddingDate = new Date('2026-08-08T18:30:00');
  const images = [
    '/images/img_story1.jpg',
    '/images/img_story2.jpg',
    '/images/img_story3.jpg',
    '/images/img_story4.jpg',
    '/images/img_story5.jpg'
  ];

  // Countdown timer
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
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);
    return () => clearInterval(imageTimer);
  }, []);

  // Parallax decor movement
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    heroRef.current.style.setProperty('--mx', x.toFixed(2));
    heroRef.current.style.setProperty('--my', y.toFixed(2));
  };

  return (
    <div className="home-container">
      {/* Hero Section with dynamic background */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(44, 62, 80, 0.4), rgba(52, 73, 94, 0.3)), url(${images[currentImageIndex]})`
        }}
      >
        {/* Decorative floating blobs */}
        <div className="hero-decor" aria-hidden="true">
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
        </div>

        <div className="hero-content">
          <div className="hero-text fade-in">
            <h1 className="hero-title">
              <span className="name gradient-text">DANI</span>
              <span className="ampersand">&</span>
              <span className="name gradient-text">ANA</span>
            </h1>
            <p className="hero-subtitle">Únete a nuestra celebración de amor</p>
            <div className="wedding-date">8 de Agosto de 2026 • Hotel Balneario Mondariz</div>
            <div className="hero-cta">
              <a href="/rsvp" className="cta-btn primary">
                <i className="fas fa-heart"></i>
                Confirmar Asistencia
              </a>
              <a href="/faq" className="cta-btn secondary">
                <i className="fas fa-info-circle"></i>
                Toda la Información
              </a>
            </div>
          </div>

          <div className="countdown-section slide-in-left">
            <h2 className="countdown-label">¡Ya queda menos!</h2>
            <div className="countdown-container">
              <div className="countdown-item">
                <span className="countdown-number">{countdown.days}</span>
                <span className="countdown-unit">días</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.hours}</span>
                <span className="countdown-unit">hrs</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.minutes}</span>
                <span className="countdown-unit">min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image carousel dots */}
        <div className="image-dots" role="tablist" aria-label="Cambiar imagen de fondo">
          {images.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === currentImageIndex}
              aria-label={`Imagen ${idx + 1}`}
              className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(idx)}
            />
          ))}
        </div>

        {/* Scroll cue */}
        <div className="scroll-cue" aria-hidden="true">
          <span className="chev"></span>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="quick-actions">
        <div className="container">
          <div className="actions-grid">
            <a href="/rsvp" className="action-card primary">
              <i className="fas fa-heart"></i>
              <h3>Confirma tu Asistencia</h3>
              <p>Tu confirmación antes del 1 de julio</p>
              <span className="action-arrow">→</span>
            </a>
            <a href="/accommodation" className="action-card">
              <i className="fas fa-bed"></i>
              <h3>Reserva tu Hotel</h3>
              <p>Descuentos especiales disponibles</p>
              <span className="action-arrow">→</span>
            </a>
            <a href="/faq" className="action-card">
              <i className="fas fa-info-circle"></i>
              <h3>Toda la Información</h3>
              <p>Horarios, dress code y consejos</p>
              <span className="action-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Love Quote Section */}
      <section className="quote-section">
        <div className="container">
          <div className="quote-content fade-in">
            <blockquote>"El amor verdadero no tiene final"</blockquote>
            <cite>— Dani & Ana</cite>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
