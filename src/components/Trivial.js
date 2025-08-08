import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Trivial.css';

const questions = [
  {
    question: '¿Dónde se conocieron Dani y Ana?',
    options: ['En la universidad', 'En una boda', 'En el trabajo', 'En un viaje'],
    answer: 0
  },
  {
    question: '¿Cuál es el destino favorito de la pareja?',
    options: ['Japón', 'París', 'Roma', 'Nueva York'],
    answer: 1
  },
  {
    question: '¿Qué día es la boda?',
    options: ['8 de Agosto, 2026', '15 de Julio, 2026', '1 de Septiembre, 2026', '25 de Diciembre, 2026'],
    answer: 0
  },
  {
    question: '¿Quién pidió matrimonio?',
    options: ['Dani', 'Ana', 'Ambos', 'Nadie'],
    answer: 0
  },
  {
    question: '¿Cuál es el plato favorito de Ana?',
    options: ['Sushi', 'Pizza', 'Ensalada', 'Tarta de queso'],
    answer: 2
  },
  {
    question: '¿En qué ciudad fue el primer viaje juntos?',
    options: ['Lisboa', 'Madrid', 'Barcelona', 'Oporto'],
    answer: 3
  },
  {
    question: '¿Qué mascota tienen?',
    options: ['Perro', 'Gato', 'Conejo', 'Ninguna'],
    answer: 0
  },
  {
    question: '¿Cuál es el color favorito de Dani?',
    options: ['Azul', 'Rojo', 'Verde', 'Negro'],
    answer: 3
  }
];

const Trivial = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState('');
  const [finished, setFinished] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [questionTime, setQuestionTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);
  // Nuevos estados para robustecer UX
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchRanking();
  }, [finished]);

  useEffect(() => {
    setQuestionTime(Date.now());
  }, [step]);

  const fetchRanking = async () => {
    // Manejo de errores y desempate por tiempo ascendente
    const { data, error } = await supabase
      .from('trivial_scores')
      .select('*')
      .order('score', { ascending: false })
      .order('time', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error al cargar ranking:', error);
      setErrorMsg('No se pudo cargar el ranking.');
    }
    setRanking(data || []);
  };

  const handleAnswer = () => {
    let points = 0;
    const now = Date.now();
    if (selected === questions[step].answer) {
      // Puntuación según tiempo de respuesta
      const elapsed = (now - questionTime) / 1000; // segundos
      if (elapsed <= 3) points = 3;
      else if (elapsed <= 7) points = 2;
      else points = 1;
      setScore(score + points);
    }
    if (step === questions.length - 1) {
      // Guardar como número para facilitar ordenación en SQL
      const now = Date.now();
      setTotalTime(Number(((now - startTime) / 1000).toFixed(2)));
    }
    setSelected(null);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const handleSaveScore = async () => {
    if (!name.trim() || saving || saved) return;
    setSaving(true);
    setErrorMsg('');

    const { error } = await supabase.from('trivial_scores').insert([
      { name: name.trim(), score, time: totalTime }
    ]);

    if (error) {
      console.error('Error al guardar puntuación:', error);
      setErrorMsg('No se pudo guardar la puntuación.');
    } else {
      setSaved(true);
      fetchRanking();
    }

    setSaving(false);
  };

  if (!finished) {
    const progressPct = Math.round(((step + 1) / questions.length) * 100);
    return (
      <div className="trivial-container">
        <h2 className="trivial-title">Trivial: Nuestra Historia</h2>
        <div className="trivial-question">
          <h3>{questions[step].question}</h3>
          <ul>
            {questions[step].options.map((opt, idx) => (
              <li key={idx}>
                <button
                  className={selected === idx ? 'selected' : ''}
                  onClick={() => setSelected(idx)}
                  disabled={selected !== null}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
          {selected !== null && (
            <button className="next-btn" onClick={handleAnswer}>Siguiente</button>
          )}
          <div className="trivial-timer">
            <span>Responde rápido para más puntos</span>
          </div>
        </div>
        <div className="trivial-progress" aria-label={`Progreso ${progressPct}%`}>
          <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPct}>
            <div className="progress-bar" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="progress-text">Pregunta {step + 1} de {questions.length}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="trivial-container">
      <h2>¡Trivial completado!</h2>
      <p>Tu puntuación: <strong>{score}</strong> puntos de máximo {questions.length * 3}</p>
      <p>Tiempo empleado: <strong>{totalTime}</strong> segundos</p>
      <input
        type="text"
        placeholder="Tu nombre para el ranking"
        value={name}
        onChange={e => setName(e.target.value)}
        className="trivial-input"
        disabled={saved}
      />
      <button
        className="save-btn"
        onClick={handleSaveScore}
        disabled={saving || saved || !name.trim()}
      >
        {saved ? 'Guardado' : saving ? 'Guardando…' : 'Guardar puntuación'}
      </button>
      {errorMsg && <p className="trivial-error">{errorMsg}</p>}
      <h3>Ranking</h3>
      <ul className="ranking-list">
        {ranking.map((r, i) => (
          <li key={r.id}>
            <span>{i + 1}. {r.name}</span>
            <span>{r.score} pts</span>
            <span>{r.time ? `${r.time} s` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Trivial;
