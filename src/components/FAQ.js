import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  // FAQs minimizadas y actualizadas
  const faqs = [
    {
      category: "Ceremonia & Recepción",
      icon: "fas fa-church",
      questions: [
        {
          question: "¿Dónde y cuándo es la ceremonia?",
          answer: "La ceremonia será el 8 de agosto a las 17:00h en la Iglesia de San Miguel (Mondariz). Por favor, llega 30 minutos antes. Será una ceremonia religiosa rápida y no queremos que te pierdas ni un momento."
        },
        {
          question: "¿Dónde es la recepción y fiesta?",
          answer: "La recepción, banquete y fiesta serán en el Hotel Balneario Mondariz, a pocos minutos de la iglesia."
        },
        {
          question: "¿Qué hora es el banquete?",
          answer: "El banquete comenzará aproximadamente a las 20:00h en el Hotel Balneario Mondariz."
        }
      ]
    },
    {
      category: "Vestuario",
      icon: "fas fa-tshirt",
      questions: [
        {
          question: "¿Cuál es el dress code?",
          answer: "El principal dresscode es que tú estés cómodo.  Aunque se recomeinda Formal/elegante. Hombres: traje con corbata o pajarita. Mujeres: vestido o conjunto formal. Evitar el blanco."
        },
        {
          question: "¿Puedo usar zapatos cómodos?",
          answer: "Sí, trae el calzado que prefieras para disfrutar. El coctel será en el jardín por lo que no recomendamos zapato muy alto."
        }
      ]
    },

    {
      category: "Regalos & Detalles",
      icon: "fas fa-tshirt",
      questions: [
        {
          question: "¿Hay lista de bodas?",
          answer: "No hemos creado una lista de bodas. Tu presencia es el mejor regalo que puedes hacernos. Si deseas hacer un regalo, te agradeceriamos que lo hicieras en efectivo o a través de una transferencia bancaria, con unos días de antelación."
        },
      ]
    },

    {
      category: "Logística",
      icon: "fas fa-bus",
      questions: [
        {
          question: "¿Hay transporte para invitados?",
          answer: "Puedes acudir en coche o compartir vehículo con otros invitados.Mo dudes en preguntar a otros invitados si necesitan compartir coche."
        },
        {
          question: "¿Hay servicio de cuidado de niños?",
          answer: "No habrá servicio de cuidado de niños. Si vienen peques, indícalo en el RSVP para prever menús."
        }
      ]
    }
  ];

  const toggleAccordion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      {/* Header */}
      <div className="faq-header">
        <div className="container">
          <h1 className="faq-title">
            <i className="fas fa-question-circle"></i>
            Preguntas Frecuentes
          </h1>
          <p className="faq-subtitle">
            Resolvemos las dudas esenciales para que disfrutes al máximo.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="faq-content">
        <div className="container">
          {/* FAQ Categories */}
          <div className="faq-categories">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="faq-category">
                <div className="category-header">
                  <i className={category.icon}></i>
                  <h2>{category.category}</h2>
                </div>
                
                <div className="questions-container">
                  {category.questions.map((item, questionIndex) => {
                    const isActive = activeIndex === `${categoryIndex}-${questionIndex}`;
                    return (
                      <div key={questionIndex} className={`faq-item ${isActive ? 'active' : ''}`}>
                        <button
                          className="faq-question"
                          onClick={() => toggleAccordion(categoryIndex, questionIndex)}
                        >
                          <span>{item.question}</span>
                          <i className={`fas fa-chevron-${isActive ? 'up' : 'down'}`}></i>
                        </button>
                        <div className={`faq-answer ${isActive ? 'show' : ''}`}>
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="faq-contact">
            <div className="contact-card">
              <h3><i className="fas fa-comments"></i> ¿Dudas? Estamos aquí para ayudarte</h3>
              <p>Si necesitas más información, escríbenos.</p>
              <div className="contact-options">
                <a href="https://wa.me/34123456789" className="contact-btn whatsapp" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp"></i>
                  WhatsApp
                </a>
                <a href="mailto:dani.ana.boda@example.com" className="contact-btn email">
                  <i className="fas fa-envelope"></i>
                  Email
                </a>
              </div>
            </div>
          </div>

          {/* Tips Section (opcional, se puede eliminar si prefieres aún más minimalismo) */}
          {/* <div className="tips-section"> ... </div> */}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
