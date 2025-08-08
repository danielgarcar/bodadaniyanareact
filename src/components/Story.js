import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Story.css';
import { supabase } from '../supabaseClient';

const Story = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  // Navegación y parallax
  const heroRef = useRef(null);
  const loveRef = useRef(null);
  const itemRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [parallax, setParallax] = useState([]);

  useEffect(() => {
    const fetchMilestones = async () => {
      const { data, error } = await supabase
        .from('story_milestones')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      if (!error) setMilestones(data || []);
      setLoading(false);
    };
    fetchMilestones();
  }, []);

  const defaultMilestones = [
    { year: '2016', title: 'Nos conocimos', description: 'Fue en una noche de verano cuando nuestros caminos se cruzaron por primera vez...', image_url: '/images/img_story1.jpg', icon: '💕' },
    { year: '2017', title: 'Nuestro primer viaje', description: 'Un viaje inolvidable que marcó el inicio de muchas aventuras juntos.', image_url: '/images/img_story1.jpg', icon: '💕' },
    { year: '2018', title: 'Nuestro primer aniversario', description: 'Celebramos nuestro primer año juntos con una cena romántica.', image_url: '/images/img_story1.jpg', icon: '💕' },
    { year: '2019', title: 'Primera casa juntos', description: 'Decidimos dar el paso de convivir y crear nuestro primer hogar.', image_url: '/images/img_story2.jpg', icon: '🏠' },
    { year: '2020', title: 'La propuesta', description: 'En un lugar muy especial para nosotros, llegó la pregunta más importante.', image_url: '/images/img_story3.jpg', icon: '💍' },
    { year: '2021', title: '¡Nos casamos!', description: 'Y aquí estamos, listos para celebrar nuestro amor con vosotros.', image_url: '/images/img_story4.jpg', icon: '🎊' },
    { year: '2022', title: 'Nuestro primer viaje juntos', description: 'Un viaje inolvidable que marcó el inicio de muchas aventuras juntos.', image_url: '/images/img_story5.jpg', icon: '✈️' },
    { year: '2023', title: 'Celebramos nuestro amor', description: 'Un año lleno de amor y felicidad, rodeados de nuestros seres queridos.', image_url: '/images/img_story6.jpg', icon: '🎉' },
    { year: '2024', title: 'Nos conocimos', description: 'Fue en una noche de verano cuando nuestros caminos se cruzaron por primera vez...', image_url: '/images/img_story1.jpg', icon: '💕' },

  ];

  // Año fijo de inicio
  const START_YEAR = 2016;

  const sections = useMemo(() => {
    const TOTAL_CARDS = 9; // 2016..2024
    const iconSet = ['💕','🏠','💍','🎊','📸','✈️','🎂','🌅','🌟'];
    const imageSet = [
      '/images/img_story1.jpg',
      '/images/img_story2.jpg',
      '/images/img_story3.jpg',
      '/images/img_story4.jpg',
      '/images/img_story5.jpg'
    ];
    const years = Array.from({ length: TOTAL_CARDS }, (_, i) => String(START_YEAR + i));
    const source = milestones.length ? milestones : defaultMilestones;
    const byYear = new Map(source.map((m) => [String(m.year), m]));
    return years.map((year, idx) => {
      const found = byYear.get(year);
      if (found) return found;
      return {
        year,
        title: `Año ${idx + 1} juntos`,
        description: 'Un año lleno de recuerdos y aventuras.',
        image_url: imageSet[idx % imageSet.length],
        icon: iconSet[idx % iconSet.length],
      };
    });
  }, [milestones]);

  // IntersectionObserver para activo + parallax con scroll del contenedor
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const allElems = [heroRef.current, ...sections.map((_, i) => itemRefs.current[i]), loveRef.current].filter(Boolean);

    const io = new IntersectionObserver(
      (entries) => {
        // Seleccionar la sección más visible
        let max = 0;
        let idx = 0;
        entries.forEach((entry) => {
          const i = allElems.indexOf(entry.target);
          if (i >= 0 && entry.intersectionRatio > max) {
            max = entry.intersectionRatio;
            idx = i;
          }
        });
        setActiveIndex((prev) => (max > 0 ? idx : prev));
      },
      { root, threshold: [0.3, 0.6, 0.9] }
    );

    allElems.forEach((el) => io.observe(el));

    const handleScroll = () => {
      const ch = root.clientHeight;
      const offsets = sections.map((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const rel = (ch / 2 - center); // distancia al centro
        const offset = Math.max(-30, Math.min(30, rel * 0.08)); // clamp +/-30px
        return offset;
      });
      setParallax(offsets);
    };

    root.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      io.disconnect();
      root.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  if (loading) {
    return (
      <div className="story-container story-loading">
        <div className="container">
          <h2>Cargando historia…</h2>
        </div>
      </div>
    );
  }

  const scrollToIndex = (i) => {
    const root = containerRef.current;
    if (!root) return;
    const total = sections.length + 2; // hero + items + love
    let targetEl = null;
    if (i === 0) targetEl = heroRef.current;
    else if (i === total - 1) targetEl = loveRef.current;
    else targetEl = itemRefs.current[i - 1];
    if (targetEl) {
      root.scrollTo({ top: targetEl.offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className="story-container fullpage" ref={containerRef}>
      <section className="story-hero fullpage-section" ref={heroRef}>
        <div className="container">
          <h1 className="story-title fade-in">Nuestra Historia</h1>
          <p className="story-subtitle fade-in">
            Cada historia de amor es única, y esta es la nuestra...
          </p>
        </div>
      </section>

      {sections.map((m, index) => (
        <section
          key={m.id || index}
          className={`timeline-full fullpage-section ${index % 2 === 0 ? 'left' : 'right'}`}
          ref={(el) => (itemRefs.current[index] = el)}
        >
          <div className="container">
            <div className={`timeline-full-content ${index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'}`}>
              <div className="timeline-image" style={{ transform: `translateY(${parallax[index] || 0}px)` }}>
                <img loading="lazy" src={m.image_url || m.image} alt={m.title} />
                {m.icon && <div className="timeline-icon">{m.icon}</div>}
              </div>
              <div className="timeline-text" style={{ transform: `translateY(${-(parallax[index] || 0) / 2}px)` }}>
                <div className="timeline-year">{m.year}</div>
                <h3>{m.title}</h3>
                <p>{m.description}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="love-message fullpage-section" ref={loveRef}>
        <div className="container">
          <div className="love-content fade-in">
            <h2>Nuestro Amor</h2>
            <p>
              Después de casi 10 años juntos, hemos aprendido que el amor verdadero 
              no es solo encontrar a la persona perfecta, sino ver la perfección en 
              una persona imperfecta. Hoy queremos celebrar con vosotros el inicio 
              de este nuevo capítulo en nuestras vidas.
            </p>
            <blockquote>
              "<i>Dani & Ana</i>"
            </blockquote>
          </div>
        </div>
      </section>

      {/* Navegación por puntos */}
      <nav className="dots-nav" aria-label="Secciones de la historia">
        {[...Array(sections.length + 2)].map((_, i) => (
          <button
            key={i}
            className={`dot ${activeIndex === i ? 'active' : ''}`}
            aria-label={`Ir a sección ${i + 1}`}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </nav>
    </div>
  );
};

export default Story;
