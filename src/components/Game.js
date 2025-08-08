import React, { useEffect, useRef, useState } from 'react';

// Juego moderno: pareja camino a la iglesia, con narrativa cada 30s
export default function Game() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Estado principal
  const [status, setStatus] = useState('menu'); // menu | intro | playing | paused | win | gameover
  const [muted, setMuted] = useState(false);

  // Configuración de juego
  const GAME_DURATION = 300; // 5 min
  const SCORE = useRef(0);
  const TIMELEFT = useRef(GAME_DURATION);
  const INTRO_SHOWN = useRef(false);

  // Intro estilo Star Wars
  const INTRO = useRef({
    offset: 320,
    speed: 40, // más lento para una intro más larga
    lines: [
      'En una galaxia muy, muy cercana...',
      'Dos estrellas destinadas a unirse brillan con fuerza.',
      'El gran día ha llegado y todos esperan en la iglesia.',
      'Ayuda a la pareja a llegar a tiempo sorteando obstáculos...',
      'Controles: ↑ o ESPACIO para saltar, ↓ para agacharte o caer rápido.',
      'Pulsa P para pausar. R para reiniciar.',
      '¡Que la fuerza del amor te acompañe!'
    ]
  });

  // Momentos clave (cada 30s)
  const STORY_MOMENTS = useRef([
    { text: 'Ana y Dani en la Facultad de Derecho de la USC 🏛️', timeStart: 0 },
    { text: 'Ana preparando las oposiciones para Jueza ⚖️', timeStart: 30 },
    { text: 'Dani cursando el Máster de Abogacía 📖', timeStart: 60 },
    { text: 'Dani empezando a trabajar como abogado 💼', timeStart: 90 },
    { text: 'Dani trabajando en Porriño 🏢', timeStart: 120 },
    { text: 'Dani mudándose a Carballiño 🏠', timeStart: 150 },
    { text: 'Ana trabajando en Ponteareas 🏛️', timeStart: 180 },
    { text: 'Ana aprobando la oposición en Pontevedra 🎉', timeStart: 210 },
    { text: 'Ana y Dani viviendo juntos en Pontevedra 💕', timeStart: 240 },
    { text: 'La pedida en la Torre de Hércules 💍', timeStart: 270 },
    { text: '¡Y hoy... la boda! 👰💒🤵', timeStart: 300 }
  ]);

  // Narrativa actual con banner animado
  const STORY = useRef({ index: -1, bannerText: '', bannerAlpha: 0, bannerTimer: 0 });
  const [currentStoryMoment, setCurrentStoryMoment] = useState(null);

  // Mundo y física
  const WORLD = useRef({
    speed: 240,
    maxSpeed: 420,
    gravity: 1700,
    jumpV: 620,
    fastFallBoost: 2200,
    groundY: 220,
    player: { x: 100, y: 0, w: 70, h: 48, vy: 0, onGround: true, crouching: false },
    worldX: 0,
    obstacles: [],
    startTs: 0,
    lastTs: 0,
    spawnTimer: 0,
    spawnInterval: 1.3,
    // Parallax
    parallax: {
      skyShift: 0,
      cityShift: 0,
      hillShift: 0
    }
  });

  // Reset limpio
  const resetWorld = (worldRef) => {
    const w = worldRef?.current;
    if (!w) return;

    SCORE.current = 0;
    TIMELEFT.current = GAME_DURATION;
    STORY.current = { index: -1, bannerText: '', bannerAlpha: 0, bannerTimer: 0 };
    setCurrentStoryMoment(null);

    w.worldX = 0;
    w.lastTs = 0;
    w.startTs = 0;
    w.speed = 240;
    w.spawnInterval = 1.3;
    w.spawnTimer = 0.8;
    w.obstacles = [];
    w.parallax.skyShift = 0;
    w.parallax.cityShift = 0;
    w.parallax.hillShift = 0;
    w.player = { x: 100, y: w.groundY - 48, w: 70, h: 48, vy: 0, onGround: true, crouching: false };
  };

  useEffect(() => {
    resetWorld(WORLD);
    INTRO.current.offset = 320;
  }, []);

  // Bucle de juego
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let rafId;
    const loop = (ts) => {
      const w = WORLD.current;
      if (!w.lastTs) {
        w.lastTs = ts;
        if (!w.startTs && status === 'playing') w.startTs = ts;
      }
      const dt = Math.min(0.032, (ts - w.lastTs) / 1000);
      w.lastTs = ts;

      update(dt, ts);
      render(ctx, canvas);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [status]);

  // Reiniciar intro al entrar
  useEffect(() => {
    if (status === 'intro') INTRO.current.offset = 320;
  }, [status]);

  // Entradas
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.repeat) return;
      if ((e.code === 'Space' || e.code === 'ArrowUp') && status === 'playing') jump();
      if (e.code === 'ArrowDown' && status === 'playing') crouch(true);
      if (e.code === 'KeyR' && (status === 'playing' || status === 'gameover' || status === 'win' || status === 'paused')) {
        resetWorld(WORLD);
        setStatus('menu');
      }
      if (e.code === 'KeyP' && (status === 'playing' || status === 'paused')) togglePause();
      if (e.code === 'Enter' && status === 'menu') handlePlayFullscreen();
      if (e.code === 'Enter' && status === 'intro') startPlaying();
    };
    const onKeyUp = (e) => {
      if (e.code === 'ArrowDown') crouch(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [status]);

  const togglePause = () => {
    if (status === 'playing') setStatus('paused');
    else if (status === 'paused') setStatus('playing');
  };

  const jump = () => {
    const p = WORLD.current.player;
    if (p.onGround) {
      p.vy = -WORLD.current.jumpV;
      p.onGround = false;
    }
  };

  const crouch = (on) => {
    const p = WORLD.current.player;
    if (on) {
      if (!p.onGround) p.vy += WORLD.current.fastFallBoost * 0.04; // caída rápida
      else if (!p.crouching) {
        p.crouching = true;
        const prevBottom = p.y + p.h;
        p.h = 32; // reducir un poco la altura
        p.y = prevBottom - p.h;
      }
    } else if (p.crouching) {
      const prevBottom = p.y + p.h;
      p.h = 48;
      p.y = prevBottom - p.h;
      p.crouching = false;
    }
  };

  const handlePlayFullscreen = async () => {
    try { if (containerRef.current?.requestFullscreen) await containerRef.current.requestFullscreen(); } catch {}
    resetWorld(WORLD);

    const audioEl = document.getElementById('bg-music');
    if (audioEl) { audioEl.currentTime = 0; audioEl.play(); audioEl.muted = muted; }

    if (!INTRO_SHOWN.current) { setStatus('intro'); INTRO_SHOWN.current = true; }
    else { startPlaying(); }
  };

  const startPlaying = () => {
    const w = WORLD.current;
    w.lastTs = 0;
    w.startTs = 0;
    // Mostrar primer momento inmediatamente
    STORY.current.index = 0;
    STORY.current.bannerText = STORY_MOMENTS.current[0].text;
    STORY.current.bannerTimer = 4.2; // mostrar 4.2s
    STORY.current.bannerAlpha = 0; // animar fade-in
    setCurrentStoryMoment(STORY.current.bannerText);
    setStatus('playing');
  };

  const handleRetry = () => {
    resetWorld(WORLD);
    setCurrentStoryMoment(null);
    startPlaying();
  };

  const update = (dt, ts) => {
    const w = WORLD.current;

    if (status === 'menu') return;

    if (status === 'intro') {
      INTRO.current.offset -= INTRO.current.speed * dt;
      if (INTRO.current.offset < -140) startPlaying();
      return;
    }

    if (status === 'paused') return;
    if (status !== 'playing') return;

    // Tiempo de juego
    if (w.startTs === 0) w.startTs = ts;
    const elapsed = (ts - w.startTs) / 1000;
    const remaining = Math.max(0, GAME_DURATION - elapsed);
    TIMELEFT.current = remaining;

    // Narrativa basada en tiempo -> índice
    const maxIndex = STORY_MOMENTS.current.length - 1;
    const idx = Math.min(Math.floor(elapsed / 30), maxIndex);
    if (idx !== STORY.current.index) {
      STORY.current.index = idx;
      STORY.current.bannerText = STORY_MOMENTS.current[idx].text;
      STORY.current.bannerTimer = 4.2;
      setCurrentStoryMoment(STORY.current.bannerText);
    }

    // Animación del banner (fade in/out)
    if (STORY.current.bannerTimer > 0) {
      STORY.current.bannerTimer -= dt;
      STORY.current.bannerAlpha = Math.min(1, STORY.current.bannerAlpha + dt * 3);
    } else {
      STORY.current.bannerAlpha = Math.max(0, STORY.current.bannerAlpha - dt * 2);
    }

    if (remaining <= 0.01) { setStatus('win'); return; }

    // Progresión de dificultad
    const tFactor = Math.min(1, elapsed / GAME_DURATION);
    w.speed = 240 + (w.maxSpeed - 240) * tFactor;
    w.spawnInterval = 1.3 - 0.8 * tFactor;

    // Parallax scrolling
    w.parallax.skyShift += w.speed * 0.08 * dt;
    w.parallax.cityShift += w.speed * 0.25 * dt;
    w.parallax.hillShift += w.speed * 0.45 * dt;

    // Avance mundo
    w.worldX += w.speed * dt;

    // Física jugador
    const p = w.player;
    p.vy += w.gravity * dt;
    p.y += p.vy * dt;
    const groundY = w.groundY - p.h;
    if (p.y >= groundY) { p.y = groundY; p.vy = 0; p.onGround = true; } else { p.onGround = false; }

    // Spawn obstáculos
    w.spawnTimer -= dt;
    if (w.spawnTimer <= 0) {
      spawnObstacle(w);
      w.spawnTimer = w.spawnInterval * (0.9 + Math.random() * 0.4);
    }

    // Colisiones + puntuación
    for (const o of w.obstacles) {
      const sx = o.x - w.worldX + p.x;
      o.screenX = sx;
      if (!o.scored && sx + o.w < p.x) { o.scored = true; SCORE.current += 100; }
      const collide = rectOverlap(p.x, p.y, p.w, p.h, sx, o.y, o.w, o.h);
      if (collide) { setStatus('gameover'); break; }
    }

    // Limpiar
    w.obstacles = w.obstacles.filter((o) => o.screenX > -140);
    SCORE.current += Math.floor(w.speed * dt * 0.6);
  };

  const render = (ctx, canvas) => {
    const w = WORLD.current;
    const p = w.player;

    // Fondo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (status === 'intro') {
      drawIntroBackground(ctx, canvas);
      drawIntro(ctx, canvas, INTRO.current.lines, INTRO.current.offset);
      drawSkipHint(ctx, canvas, 'Pulsa Enter para saltar');
      return;
    }

    drawSky(ctx, canvas, w.parallax.skyShift);
    drawCity(ctx, canvas, w.parallax.cityShift);
    drawHills(ctx, canvas, w.parallax.hillShift);

    // Marca de agua narrativa sutil
    const momentText = currentStoryMoment || STORY_MOMENTS.current[0].text;
    drawStoryWatermark(ctx, canvas, momentText);

    // Suelo
    ctx.fillStyle = '#bfe3ff';
    ctx.fillRect(0, w.groundY + 12, canvas.width, 4);

    // Obstáculos
    for (const o of w.obstacles) {
      if (o.screenX < -80 || o.screenX > canvas.width + 120) continue;
      if (o.type === 'low') drawObstacleLow(ctx, o.screenX, o.y, o.w, o.h);
      else drawObstacleHigh(ctx, o.screenX, o.y, o.w, o.h);
    }

    // Pareja (sticker conjunto)
    drawCouple(ctx, p.x, p.y, p.w, p.h, !p.onGround, p.crouching);

    // HUD
    drawHUD(ctx, canvas, {
      score: SCORE.current,
      time: TIMELEFT.current,
      status
    });

    // Banner de momento especial (animado)
    if (STORY.current.bannerAlpha > 0) {
      drawStoryBanner(ctx, canvas, momentText, STORY.current.bannerAlpha);
    }

    if (status === 'paused') {
      drawOverlay(ctx, canvas, 'Pausa ⏸', 'Pulsa P para continuar');
      return;
    }

    if (status === 'gameover') {
      drawOverlay(ctx, canvas, '¡Ups! Te has tropezado', 'Pulsa R para volver al menú');
    } else if (status === 'win') {
      drawOverlay(ctx, canvas, '¡Llegaste a tiempo! 💒', `Puntuación: ${Math.floor(SCORE.current)} · Pulsa R para menú`);
    }
  };

  const toggleMute = () => {
    const audioEl = document.getElementById('bg-music');
    if (audioEl) { audioEl.muted = !audioEl.muted; setMuted(audioEl.muted); }
    else setMuted((m) => !m);
  };

  useEffect(() => () => {
    const audioEl = document.getElementById('bg-music');
    if (audioEl) audioEl.pause();
  }, []);

  return (
    <div ref={containerRef} style={{ maxWidth: 980, margin: '0 auto', padding: '1rem', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '.5rem' }}>Camino a la iglesia</h2>

      {status === 'menu' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,.95), rgba(238,242,255,.95))', zIndex: 5, borderRadius: 12 }}>
          <div style={{ width: 'min(92%, 620px)', padding: '1.25rem', borderRadius: 12, boxShadow: '0 8px 28px rgba(0,0,0,.18)', background: 'white' }}>
            <h3 style={{ marginTop: 0, textAlign: 'center' }}>¡Acompaña a Ana y Dani!</h3>
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: 4 }}>
              Esquiva obstáculos durante 5 minutos. La historia de la pareja aparecerá como momentos especiales cada 30s.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
              <button onClick={handlePlayFullscreen} style={primaryBtn}>▶ Jugar en pantalla completa</button>
              <button onClick={() => { resetWorld(WORLD); startPlaying(); }} style={secondaryBtn}>▷ Jugar</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,.12)', background: 'white', position: 'relative' }}>
        <audio id="bg-music" src="/musica-boda.mp3" loop autoPlay={false} style={{ display: 'none' }} />
        <button onClick={toggleMute} aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'} style={{ position: 'absolute', right: 8, top: 8, zIndex: 8, background: 'rgba(0,0,0,.55)', color: '#fff', border: 0, borderRadius: 999, width: 36, height: 36, cursor: 'pointer' }}>{muted ? '🔇' : '🔊'}</button>
        {(status === 'playing' || status === 'paused') && (
          <button onClick={togglePause} style={{ position: 'absolute', right: 52, top: 8, zIndex: 8, background: 'rgba(0,0,0,.55)', color: '#fff', border: 0, borderRadius: 999, width: 36, height: 36, cursor: 'pointer' }}>{status === 'paused' ? '▶' : '⏸'}</button>
        )}
        {status === 'intro' && (
          <button onClick={startPlaying} style={{ position: 'absolute', right: 8, bottom: 8, zIndex: 8, background: 'rgba(0,0,0,.55)', color: '#fff', border: 0, borderRadius: 8, padding: '.4rem .6rem', cursor: 'pointer' }}>Saltar intro</button>
        )}
        <canvas ref={canvasRef} width={900} height={280} style={{ width: '100%', display: 'block', background: status === 'intro' ? '#000' : 'linear-gradient(#eef2ff, #fff)' }} />

        {/* Controles táctiles */}
        {status === 'playing' && (
          <div style={{ position: 'absolute', inset: 'auto 0 0 0', display: 'flex', justifyContent: 'space-between', padding: '8px 10px', pointerEvents: 'none' }}>
            <button onMouseDown={jump} onTouchStart={jump} style={touchBtn}>⮝ Saltar</button>
            <button onMouseDown={() => crouch(true)} onMouseUp={() => crouch(false)} onTouchStart={() => crouch(true)} onTouchEnd={() => crouch(false)} style={touchBtn}>⮟ Agachar</button>
          </div>
        )}

        {(status === 'gameover' || status === 'win') && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 7 }}>
            <div style={{ background: 'rgba(17,24,39,.88)', color: '#fff', padding: '1rem 1.25rem', borderRadius: 12, boxShadow: '0 8px 28px rgba(0,0,0,.35)', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                {status === 'win' ? '¡Llegaste a tiempo! 💒' : '¡Ups! Te has tropezado'}
              </div>
              <div style={{ fontSize: 14, opacity: .9, marginBottom: 12 }}>
                Puntuación: {Math.floor(SCORE.current)}
              </div>
              <button onClick={handleRetry} style={{ background: '#22c55e', color: '#0b1a0f', border: 0, padding: '.5rem 1rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>↻ Reintentar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Estilos de botones
const primaryBtn = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: 'white', border: 0, padding: '.75rem 1.25rem',
  borderRadius: 10, fontWeight: 700, cursor: 'pointer',
  boxShadow: '0 6px 18px rgba(99,102,241,.35)'
};
const secondaryBtn = {
  background: '#111827', color: 'white', border: 0,
  padding: '.75rem 1.25rem', borderRadius: 10,
  fontWeight: 700, cursor: 'pointer'
};
const touchBtn = {
  pointerEvents: 'auto',
  background: 'rgba(0,0,0,.55)', color: '#fff', border: 0,
  borderRadius: 10, padding: '.5rem .75rem', fontWeight: 700
};

// Utilidades
function rectOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
function formatTime(t) {
  const s = Math.max(0, Math.floor(t));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function spawnObstacle(w) {
  const type = Math.random() < 0.55 ? 'low' : 'high';
  if (type === 'low') {
    const width = 28 + Math.random() * 18;
    const height = 22 + Math.random() * 22;
    const x = w.worldX + 900 + Math.random() * 120;
    const y = w.groundY - height;
    w.obstacles.push({ type, x, y, w: width, h: height, scored: false, screenX: 0 });
  } else {
    const width = 84 + Math.random() * 70;
    const height = 18;
    const x = w.worldX + 900 + Math.random() * 120;
    const y = w.groundY - (48 + 12);
    w.obstacles.push({ type, x, y, w: width, h: height, scored: false, screenX: 0 });
  }
}

// Dibujo UI
function drawHUD(ctx, canvas, { score, time, status }) {
  ctx.save();
  // Barra superior
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  roundRect(ctx, 8, 8, canvas.width - 16, 34, 8);
  ctx.fill();

  // Puntuación
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 12px Inter, system-ui, -apple-system, Segoe UI, Roboto';
  ctx.textAlign = 'left';
  ctx.fillText(`Puntos: ${Math.floor(score)}`, 16, 30);

  // Tiempo restante + barra
  ctx.textAlign = 'right';
  ctx.fillText(`Tiempo: ${formatTime(time)}`, canvas.width - 16, 30);
  const pct = Math.max(0, Math.min(1, time / 300));
  const barW = (canvas.width - 16) * pct;
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#22c55e';
  roundRect(ctx, 8, 46, barW, 6, 3);
  ctx.fill();
  ctx.restore();
}

function drawIntroBackground(ctx, canvas) {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, '#000');
  g.addColorStop(1, '#1f2937');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawIntro(ctx, canvas, lines, offset) {
  ctx.save();
  ctx.fillStyle = '#10b981';
  ctx.textAlign = 'center';
  ctx.font = 'bold 22px Inter, system-ui, -apple-system, Segoe UI, Roboto';
  const centerX = canvas.width / 2;
  let y = canvas.height + offset;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const scale = 1 - i * 0.05;
    ctx.save();
    ctx.translate(centerX, y);
    ctx.scale(scale, scale);
    ctx.fillText(line, 0, 0);
    ctx.restore();
    y += 36;
  }
  ctx.restore();
}

function drawSkipHint(ctx, canvas, text) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  roundRect(ctx, canvas.width - 165, canvas.height - 36, 156, 26, 8);
  ctx.fill();
  ctx.fillStyle = '#e5e7eb';
  ctx.font = '12px Inter, system-ui, -apple-system, Segoe UI, Roboto';
  ctx.textAlign = 'right';
  ctx.fillText(text, canvas.width - 12, canvas.height - 18);
  ctx.restore();
}

function drawSky(ctx, canvas, shift) {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, '#e8f0ff');
  g.addColorStop(1, '#ffffff');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // nubes suaves
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 6; i++) {
    const x = ((i * 180 - (shift * 0.3) % (canvas.width + 200)) + canvas.width + 200) % (canvas.width + 200) - 100;
    ctx.beginPath();
    ctx.ellipse(x, 60 + (i % 2) * 18, 70, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCity(ctx, canvas, shift) {
  ctx.save();
  ctx.fillStyle = '#c7d2fe';
  const baseY = 180;
  for (let i = 0; i < 14; i++) {
    const w = 40 + (i % 3) * 10;
    const h = 30 + (i % 5) * 18;
    const x = ((i * 90 - (shift % (canvas.width + 200))) + canvas.width + 200) % (canvas.width + 200) - 100;
    roundRect(ctx, x, baseY - h, w, h, 4);
    ctx.fill();
  }
  ctx.restore();
}

function drawHills(ctx, canvas, shift) {
  ctx.save();
  ctx.fillStyle = '#93c5fd';
  for (let i = 0; i < 4; i++) {
    const x = ((i * 260 - (shift % (canvas.width + 300))) + canvas.width + 300) % (canvas.width + 300) - 150;
    ctx.beginPath();
    ctx.ellipse(x, 220, 180, 36, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawObstacleLow(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#94a3b8';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 6);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawObstacleHigh(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#9ca3af';
  roundRect(ctx, x, y + h - 30, 4, 30, 2);
  roundRect(ctx, x + w - 4, y + h - 30, 4, 30, 2);
  ctx.fill();
  ctx.fillStyle = '#22c55e';
  roundRect(ctx, x, y, w, h, 6);
  ctx.fill();
  ctx.restore();
}

// Sticker conjunto: novio + novia cogidos de la mano
function drawCouple(ctx, x, y, w, h, jumping, crouching) {
  ctx.save();
  // Sombra
  if (jumping) {
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.5, y + h + 10, w * 0.7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Novia (izquierda)
  const nx = x - 16; const ny = y; const nw = Math.floor(w * 0.48); const nh = h;
  ctx.fillStyle = '#f8fafc';
  roundRect(ctx, nx - 2, ny + nh * 0.35, nw + 4, nh * 0.65, 10); // vestido
  ctx.fill();
  ctx.fillStyle = '#e5e7eb';
  roundRect(ctx, nx, ny, nw, nh * 0.45, 8); // torso
  ctx.fill();
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(nx + nw / 2, crouching ? ny - 4 : ny - 6, 10, 0, Math.PI * 2); // cabeza
  ctx.fill();
  // velo
  ctx.globalAlpha = 0.6; ctx.fillStyle = '#e0f2fe'; roundRect(ctx, nx - 6, ny - 6, nw + 12, 16, 8); ctx.fill(); ctx.globalAlpha = 1;

  // Novio (derecha)
  const gx = x + nw - 4; const gy = y; const gw = Math.floor(w * 0.52); const gh = h;
  ctx.fillStyle = '#1f2937'; roundRect(ctx, gx, gy, gw, gh, 8); ctx.fill(); // traje
  ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.arc(gx + gw / 2, crouching ? gy - 4 : gy - 6, 10, 0, Math.PI * 2); ctx.fill(); // cabeza
  ctx.fillStyle = '#ef4444'; ctx.fillRect(gx + gw / 2 - 3, gy + 10, 6, 10); // corbata

  // Manos unidas (corazón pequeño)
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  const mx = gx - 4; const my = y + h * 0.48;
  ctx.arc(mx - 3, my, 3, 0, Math.PI * 2);
  ctx.arc(mx + 3, my, 3, 0, Math.PI * 2);
  ctx.moveTo(mx - 6, my); ctx.lineTo(mx, my + 6); ctx.lineTo(mx + 6, my);
  ctx.fill();

  ctx.restore();
}

function drawStoryWatermark(ctx, canvas, momentText) {
  ctx.save();
  ctx.globalAlpha = 0.12;
  const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width * 0.9);
  gradient.addColorStop(0, '#fbbf24');
  gradient.addColorStop(0.5, '#f59e0b');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Texto grande sutil
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 34px Inter, system-ui, -apple-system, Segoe UI, Roboto';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const words = momentText.split(' ');
  let lines = []; let currentLine = '';
  for (const word of words) {
    const test = currentLine + (currentLine ? ' ' : '') + word;
    if (ctx.measureText(test).width > canvas.width * 0.7 && currentLine) { lines.push(currentLine); currentLine = word; }
    else currentLine = test;
  }
  if (currentLine) lines.push(currentLine);

  const lineHeight = 40;
  const startY = canvas.height / 2 - (lines.length - 1) * lineHeight / 2;
  for (let i = 0; i < lines.length; i++) ctx.fillText(lines[i], canvas.width / 2, startY + i * lineHeight);
  ctx.restore();
}

function drawStoryBanner(ctx, canvas, text, alpha) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.fillStyle = 'rgba(251, 191, 36, 0.95)';
  const padding = 12;
  ctx.font = 'bold 14px Inter, system-ui, -apple-system, Segoe UI, Roboto';
  const textW = ctx.measureText(text).width;
  const boxW = Math.min(canvas.width - 24, textW + padding * 2 + 40);
  const boxH = 42;
  const boxX = (canvas.width - boxW) / 2;
  const boxY = 6; // elevado
  roundRect(ctx, boxX, boxY, boxW, boxH, 10);
  ctx.fill();
  ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#92400e';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('💕 ' + text + ' 💕', canvas.width / 2, boxY + boxH / 2);
  ctx.restore();
}

function drawOverlay(ctx, canvas, title, subtitle) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px Inter, system-ui, -apple-system, Segoe UI, Roboto';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 6);
  ctx.font = '14px Inter, system-ui, -apple-system, Segoe UI, Roboto';
  ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 18);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
