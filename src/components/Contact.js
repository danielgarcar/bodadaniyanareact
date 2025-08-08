import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-title fade-in">Contacto</h1>
          <p className="contact-subtitle fade-in">
            ¿Tienes alguna pregunta? ¡Estamos aquí para ayudarte!
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info slide-in-left">
              <h2>Información de Contacto</h2>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-details">
                  <h3>Teléfono</h3>
                  <p>Dani: +34 123 456 789</p>
                  <p>Ana: +34 987 654 321</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <h3>Email</h3>
                  <p>info@daniyanaswedding.com</p>
                  <p>bodadaniana2026@gmail.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="contact-details">
                  <h3>WhatsApp</h3>
                  <p>+34 123 456 789</p>
                  <a href="https://wa.me/34123456789" className="btn btn-secondary">
                    Enviar WhatsApp
                  </a>
                </div>
              </div>

              <div className="social-section">
                <h3>Síguenos</h3>
                <div className="social-links">
                  <a href="#" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                    @daniyanaswedding
                  </a>
                  <a href="#" aria-label="Facebook">
                    <i className="fab fa-facebook"></i>
                    Dani & Ana Wedding
                  </a>
                </div>
              </div>
            </div>

            <div className="faq-section slide-in-right">
              <h2>Preguntas Frecuentes</h2>
              
              <div className="faq-item">
                <h4>¿Hasta cuándo puedo confirmar mi asistencia?</h4>
                <p>Por favor, confirma tu asistencia antes del 1 de agosto de 2026.</p>
              </div>

              <div className="faq-item">
                <h4>¿Hay dress code?</h4>
                <p>Sí, el evento es formal/cocktail. Los hombres con traje y las mujeres con vestido elegante. Evitad el blanco y el negro, por favor.</p>
              </div>

              <div className="faq-item">
                <h4>¿Hay transporte disponible?</h4>
                <p>Sí, habrá autobuses desde Santiago de Compostela y Vigo. También hay parking gratuito disponible en el hotel.</p>
              </div>

              <div className="faq-item">
                <h4>¿Puedo traer acompañantes?</h4>
                <p>El número de acompañantes está especificado en tu invitación. Si tienes dudas, por favor contáctanos.</p>
              </div>

              <div className="faq-item">
                <h4>¿Hay alojamiento disponible?</h4>
                <p>Sí, el hotel ofrece habitaciones con tarifa especial para los invitados. Más información en la sección de hospedaje.</p>
              </div>

              <div className="faq-item">
                <h4>¿Qué pasa si llueve?</h4>
                <p>El hotel cuenta con espacios cubiertos elegantes. ¡La celebración continuará sin problemas!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="help-section">
        <div className="container">
          <div className="help-content fade-in">
            <h2>¿Necesitas Ayuda?</h2>
            <p>
              Si tienes alguna pregunta que no aparece aquí, no dudes en contactarnos. 
              Estamos disponibles para resolver cualquier duda que puedas tener sobre 
              nuestro gran día.
            </p>
            <div className="help-buttons">
              <a href="tel:+34123456789" className="btn btn-primary">
                <i className="fas fa-phone"></i>
                Llamar Ahora
              </a>
              <a href="mailto:info@daniyanaswedding.com" className="btn btn-secondary">
                <i className="fas fa-envelope"></i>
                Enviar Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
