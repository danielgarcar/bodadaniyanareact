// import GuestList from './components/GuestList';
import GuestList from './components/GuestList';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Home from './components/HomeComponent';
import Story from './components/Story';
import EventDetails from './components/EventDetails';
import Gallery from './components/Gallery';
import Accommodation from './components/Accommodation';
import RSVP from './components/RSVP';
import Trivial from './components/Trivial';
import FAQ from './components/FAQ';
import Admin from './components/Admin';
import Game from './components/Game';

// Estilos adicionales para la app
import './styles/App.css';

// Usuarios válidos
import { supabase } from './supabaseClient';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('wedding-auth');
      if (storedAuth === 'authenticated') {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    // Simular tiempo de carga
    setTimeout(checkAuth, 1000);
  }, []);

  const handleLogin = async (username, password) => {
    // Normalizar valores para evitar errores de espacios o mayúsculas
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('users', cleanUser)
      .eq('password', cleanPass);
    console.log('LOGIN DEBUG:', { cleanUser, cleanPass, data, error });
    if (data && data.length > 0) {
      setIsAuthenticated(true);
      localStorage.setItem('wedding-auth', 'authenticated');
      return { success: true };
    }
    return { success: false, message: 'Credenciales incorrectas' };
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('wedding-auth');
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>💒 Dani & Ana</h2>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <MainLayout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/story" element={<Story />} />
          <Route path="/details" element={<EventDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/rsvp" element={<RSVP />} />
          {/* <Route path="/guestlist" element={<GuestList />} /> */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/trivial" element={<Trivial />} />
          <Route path="/game" element={<Game />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
