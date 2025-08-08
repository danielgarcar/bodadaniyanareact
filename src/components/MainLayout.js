import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = ({ children, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  // Modo oscuro y estado de scroll
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const isActive = (path) => location.pathname === path || (path === '/' && location.pathname === '/home');

  const menuItems = [
    { path: '/', label: 'Inicio', icon: 'fas fa-home' },
    { path: '/story', label: 'Nuestra Historia', icon: 'fas fa-heart' },
    { path: '/details', label: 'Detalles', icon: 'fas fa-calendar' },
    { path: '/gallery', label: 'Galería', icon: 'fas fa-images' },
    { path: '/accommodation', label: 'Alojamiento', icon: 'fas fa-bed' },
    { path: '/rsvp', label: 'Confirmar Asistencia', icon: 'fas fa-envelope' },
    { path: '/trivial', label: 'Trivial', icon: 'fas fa-star' },
    { path: '/game', label: 'Juego', icon: 'fas fa-gamepad' },
    { path: '/faq', label: 'FAQs', icon: 'fas fa-question-circle' },
    { path: '/admin', label: 'Admin', icon: 'fas fa-user-shield' }
  ];

  useEffect(() => {
    // Bloquear scroll en la ruta del juego
    const preventDefault = (e) => e.preventDefault();
    const preventKeys = (e) => {
      const keys = ['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];
      if (keys.includes(e.code)) e.preventDefault();
    };

    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.documentElement.style.overscrollBehavior;

    if (location.pathname === '/game') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
      window.addEventListener('keydown', preventKeys, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('keydown', preventKeys);
      document.body.style.overflow = prevOverflow || '';
      document.documentElement.style.overscrollBehavior = prevOverscroll || '';
    };
  }, [location.pathname]);

  return (
    <div className="main-layout">
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo-section">
            <Link to="/" className="logo-link" onClick={closeMenu}>
              <img 
                src="/images/logo boda.png" 
                alt="Dani & Ana" 
                className="header-logo"
              />
              <div className="logo-text">
                <span className="logo-names">Dani & Ana</span>
                <span className="logo-date">08.08.2026</span>
              </div>
            </Link>
          </div>

          {/* Único botón de menú */}
          <div className="header-actions">
            <button onClick={toggleMenu} className={`single-menu-btn ${isMenuOpen ? 'active' : ''}`} aria-label="Abrir menú">
              <i className="fas fa-bars"></i>
              <span>Menú</span>
            </button>
          </div>
        </div>
      </header>

      {/* Panel lateral */}
      <nav className={`side-panel ${isMenuOpen ? 'open' : ''}`}>
        <div className="side-overlay" onClick={closeMenu}></div>
        <div className="side-content">
          <div className="side-header">
            <h3>Menú</h3>
            <button onClick={closeMenu} className="close-btn" aria-label="Cerrar menú">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="side-links">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`side-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <i className={item.icon}></i>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="side-actions">
            <button onClick={toggleTheme} className="side-action-btn" aria-label="Cambiar tema">
              <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
              {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            </button>
            <button onClick={onLogout} className="side-action-btn danger">
              <i className="fas fa-sign-out-alt"></i>
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Dani & Ana</h4>
            <p>8 de Agosto, 2026</p>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>📧danigarcia.anamvilas@gmail.com</p>
            <p>📱 +34 633432205</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Dani & Ana. Con mucho cariño para nuestros invitados.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
