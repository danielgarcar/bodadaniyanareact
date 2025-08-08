import React, { useState } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const images = [
    { src: '/images/img_story1.jpg', alt: 'Nuestra historia 1', category: 'historia' },
    { src: '/images/img_story2.jpg', alt: 'Nuestra historia 2', category: 'historia' },
    { src: '/images/img_story3.jpg', alt: 'Nuestra historia 3', category: 'historia' },
    { src: '/images/img_story4.jpg', alt: 'Nuestra historia 4', category: 'historia' },
    { src: '/images/img_story5.jpg', alt: 'Nuestra historia 5', category: 'historia' }
  ];

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-container">
      <section className="gallery-hero">
        <div className="container">
          <h1 className="gallery-title fade-in">Galería de Fotos</h1>
          <p className="gallery-subtitle fade-in">
            Momentos especiales capturados en el tiempo
          </p>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <div className="gallery-grid">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="gallery-item fade-in"
                onClick={() => openModal(image)}
              >
                <img src={image.src} alt={image.alt} />
                <div className="gallery-overlay">
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.alt} />
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
