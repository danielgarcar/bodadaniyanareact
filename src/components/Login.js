import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const result = await onLogin(username, password);
      if (!result.success) {
        setError(result.message || 'Credenciales incorrectas');
        setIsLoading(false);
      }
      // Si el login es exitoso, el estado de loading se gestiona en App.js
    } catch (err) {
      setError('Error de autenticación.');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-background"></div>
      <div className="login-container">
        <div className="login-box glass">
          <div className="login-header">
            <img 
              src="/images/logo boda.png" 
              alt="Logo Dani y Ana" 
              className="login-logo"
            />
            <h1 className="login-title">Dani & Ana</h1>
            <p className="login-subtitle">8 de Agosto, 2026</p>
            <div className="login-divider"></div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="login-input"
                autoComplete="username"
              />
            </div>

            <div className="input-group">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="login-input"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`login-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Verificando...
                </>
              ) : (
                <>
                  <i className="fas fa-heart"></i>
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-hint">
              💝 Usa tus credenciales de invitación
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
