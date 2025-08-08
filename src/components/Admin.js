import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';

const PASSWORD = '210916.';

// Imágenes disponibles en /public/images para la historia
const STORY_IMAGE_OPTIONS = [
  '/images/img_story1.jpg',
  '/images/img_story2.jpg',
  '/images/img_story3.jpg',
  '/images/img_story4.jpg',
  '/images/img_story5.jpg',
];

// Añadir exportación a Excel
let XLSX;
async function exportToExcel(rows, filename = 'invitados.xlsx') {
  if (!XLSX) XLSX = await import('xlsx');
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  XLSX.writeFile(wb, filename);
}

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('created_at:desc');
  const [adminTab, setAdminTab] = useState('list'); // list | pairs | seating | story

  // Seating plan state
  const [tablesCount, setTablesCount] = useState(8);
  const [seatsPerTable, setSeatsPerTable] = useState(8);
  const [assignments, setAssignments] = useState({}); // key `${t}-${s}` -> guestId
  const [selectedGuest, setSelectedGuest] = useState(null);

  // Historia state
  const [storyRows, setStoryRows] = useState([]);
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyMsg, setStoryMsg] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('rsvp')
        .select('id, created_at, name, email, phone, status, guests_count, guest_name, whatsapp, allergies, message')
        .order(sort.split(':')[0], { ascending: sort.split(':')[1] !== 'desc' });
      if (err) throw err;
      setRows(data || []);
    } catch (e) {
      setError('No se pudo cargar la lista.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (auth) load(); }, [auth, sort]);

  // Carga diferida de historia al abrir pestaña
  useEffect(() => { if (auth && adminTab === 'story') loadStory(); }, [auth, adminTab]);

  const filtered = useMemo(() => {
    let list = [...rows];
    if (statusFilter !== 'all') list = list.filter(r => r.status === statusFilter);
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter(r =>
        r.name?.toLowerCase().includes(t) ||
        r.email?.toLowerCase().includes(t) ||
        r.phone?.toLowerCase().includes(t) ||
        r.guest_name?.toLowerCase().includes(t)
      );
    }
    return list;
  }, [rows, q, statusFilter]);

  const updateRow = async (id, patch) => {
    const prev = rows;
    setRows(rows.map(r => (r.id === id ? { ...r, ...patch } : r)));
    try {
      const { error: err } = await supabase.from('rsvp').update(patch).eq('id', id);
      if (err) throw err;
    } catch (e) {
      setRows(prev);
      alert('No se pudo guardar el cambio');
    }
  };

  const removeRow = async (id) => {
    if (!confirm('¿Eliminar este registro?')) return;
    const prev = rows;
    setRows(rows.filter(r => r.id !== id));
    try {
      const { error: err } = await supabase.from('rsvp').delete().eq('id', id);
      if (err) throw err;
    } catch (e) {
      setRows(prev);
      alert('No se pudo eliminar');
    }
  };

  const kpis = useMemo(() => {
    const totalReg = rows.length;
    const confirmados = rows.filter(r => r.status === 'confirmado');
    const totalConfirmados = confirmados.length;
    const plusOnes = confirmados.reduce((acc, r) => acc + (Number(r.guests_count) > 1 ? 1 : 0), 0);
    const totalAsistentes = confirmados.reduce((acc, r) => acc + (Number(r.guests_count) || 1), 0);
    const pct = totalReg ? Math.round((totalConfirmados / totalReg) * 100) : 0;
    return { totalReg, totalConfirmados, plusOnes, totalAsistentes, pct };
  }, [rows]);

  const pairs = useMemo(() => {
    return rows
      .filter(r => r.status === 'confirmado' && Number(r.guests_count) > 1 && (r.guest_name || '').trim())
      .map(r => ({
        invitado: r.name,
        acompanante: r.guest_name,
        email: r.email,
        telefono: r.phone,
        id: r.id,
      }));
  }, [rows]);

  // Seating: lista de invitados (incluye +1)
  const guests = useMemo(() => {
    const conf = rows.filter(r => r.status === 'confirmado');
    const list = [];
    conf.forEach(r => {
      list.push({ id: `p-${r.id}`, label: r.name });
      if (Number(r.guests_count) > 1 && (r.guest_name || '').trim()) {
        list.push({ id: `g-${r.id}`, label: `${r.guest_name} (acompañante)` });
      }
    });
    return list;
  }, [rows]);

  const unassignedGuests = useMemo(() => {
    const assignedIds = new Set(Object.values(assignments));
    return guests.filter(g => !assignedIds.has(g.id));
  }, [guests, assignments]);

  const cleanAssignmentsForConfig = (newTables, newSeats) => {
    const next = {};
    Object.entries(assignments).forEach(([k, v]) => {
      const [t, s] = k.split('-').map(n => parseInt(n, 10));
      if (t < newTables && s < newSeats) next[k] = v;
    });
    setAssignments(next);
  };

  const handleTablesChange = (val) => {
    const v = Math.max(1, Math.min(50, Number(val) || 1));
    setTablesCount(v);
    cleanAssignmentsForConfig(v, seatsPerTable);
  };

  const handleSeatsChange = (val) => {
    const v = Math.max(1, Math.min(20, Number(val) || 1));
    setSeatsPerTable(v);
    cleanAssignmentsForConfig(tablesCount, v);
  };

  const assignSelectedToSeat = (t, s) => {
    if (!selectedGuest) return;
    // Evitar duplicados: quitar de asiento anterior
    const entries = Object.entries(assignments);
    const prevKey = entries.find(([k, id]) => id === selectedGuest.id)?.[0];
    const next = { ...assignments };
    if (prevKey) delete next[prevKey];
    next[`${t}-${s}`] = selectedGuest.id;
    setAssignments(next);
  };

  const unassignSeat = (t, s) => {
    const key = `${t}-${s}`;
    if (!(key in assignments)) return;
    const next = { ...assignments };
    delete next[key];
    setAssignments(next);
  };

  // ===== Historia: CRUD + subida de imágenes =====
  async function loadStory() {
    setStoryLoading(true);
    setStoryMsg('');
    try {
      const { data, error: err } = await supabase
        .from('story_milestones')
        .select('id, year, title, description, image_url, icon, is_published, sort_order')
        .order('sort_order', { ascending: true });
      if (err) throw err;
      setStoryRows(data || []);
    } catch (e) {
      setStoryMsg('No se pudo cargar la historia.');
    } finally {
      setStoryLoading(false);
    }
  }

  function setStoryFieldLocal(id, field, value) {
    setStoryRows(prev => prev.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  }

  async function updateStoryRow(id, patch) {
    const prev = storyRows;
    setStoryRows(prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
    try {
      const { error: err } = await supabase.from('story_milestones').update(patch).eq('id', id);
      if (err) throw err;
    } catch (e) {
      setStoryRows(prev);
      alert('No se pudo guardar el hito');
    }
  }

  async function addStoryRow() {
    setStoryMsg('');
    const nextOrder = (storyRows[storyRows.length - 1]?.sort_order || 0) + 1;
    const draft = {
      year: new Date().getFullYear(),
      title: 'Nuevo hito',
      description: '',
      image_url: '',
      icon: '🌟',
      is_published: false,
      sort_order: nextOrder,
    };
    try {
      const { data, error: err } = await supabase.from('story_milestones').insert([draft]).select('*').single();
      if (err) throw err;
      setStoryRows(prev => [...prev, data]);
    } catch (e) {
      setStoryMsg('No se pudo crear el hito.');
    }
  }

  async function removeStoryRow(id) {
    if (!confirm('¿Eliminar este hito de la historia?')) return;
    const prev = storyRows;
    setStoryRows(prev.filter(r => r.id !== id));
    try {
      const { error: err } = await supabase.from('story_milestones').delete().eq('id', id);
      if (err) throw err;
    } catch (e) {
      setStoryRows(prev);
      alert('No se pudo eliminar el hito');
    }
  }

  async function moveStory(id, dir) {
    // dir: -1 arriba, +1 abajo
    const idx = storyRows.findIndex(r => r.id === id);
    if (idx < 0) return;
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= storyRows.length) return;
    const a = storyRows[idx];
    const b = storyRows[targetIdx];
    const updated = storyRows.slice();
    // Intercambiar en UI
    [updated[idx], updated[targetIdx]] = [updated[targetIdx], updated[idx]];
    // Intercambiar sort_order
    const aOrder = a.sort_order ?? idx;
    const bOrder = b.sort_order ?? targetIdx;
    updated[idx] = { ...updated[idx], sort_order: aOrder };
    updated[targetIdx] = { ...updated[targetIdx], sort_order: bOrder };
    setStoryRows(updated);
    try {
      // Persistir ambos
      const up1 = supabase.from('story_milestones').update({ sort_order: aOrder }).eq('id', b.id);
      const up2 = supabase.from('story_milestones').update({ sort_order: bOrder }).eq('id', a.id);
      const [{ error: e1 }, { error: e2 }] = await Promise.all([up1, up2]);
      if (e1 || e2) throw e1 || e2;
    } catch (e) {
      alert('No se pudo reordenar. Recarga la página.');
      loadStory();
    }
  }

  if (!auth) {
    return (
      <div className="admin-page">
        <div className="admin-hero"><h2>Panel de Administración</h2></div>
        <div className="container">
          <div className="admin-card admin-login">
            <input
              type="password"
              placeholder="Contraseña"
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              onKeyDown={(e)=>{ if (e.key === 'Enter' && input === PASSWORD) setAuth(true); }}
            />
            <button onClick={()=> input === PASSWORD ? setAuth(true) : setError('Contraseña incorrecta')}>Entrar</button>
            {error && <div style={{color:'#c0392b', fontWeight:700}}>{error}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-hero"><h2>Gestión de Invitados</h2></div>
      <div className="container">
        <div className="admin-card" style={{marginBottom:'1rem'}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:'0.75rem'}}>
            <div className="kpi">
              <div className="kpi-label">Confirmados</div>
              <div className="kpi-value">{kpis.totalConfirmados}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Asistentes totales</div>
              <div className="kpi-value">{kpis.totalAsistentes}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Invitados con +1</div>
              <div className="kpi-value">{kpis.plusOnes}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">% confirmados</div>
              <div className="kpi-value">{kpis.pct}%</div>
            </div>
          </div>
        </div>

        {/* Pestañas */}
        <div className="admin-tabs">
          <button className={`admin-tab ${adminTab==='list' ? 'active' : ''}`} onClick={()=>setAdminTab('list')}>Lista</button>
          <button className={`admin-tab ${adminTab==='pairs' ? 'active' : ''}`} onClick={()=>setAdminTab('pairs')}>Parejas (+1)</button>
          <button className={`admin-tab ${adminTab==='seating' ? 'active' : ''}`} onClick={()=>setAdminTab('seating')}>Seating plan</button>
          <button className={`admin-tab ${adminTab==='story' ? 'active' : ''}`} onClick={()=>setAdminTab('story')}>Historia</button>
        </div>

        {adminTab === 'list' && (
          <div className="admin-card">
            <div className="admin-toolbar">
              <input placeholder="Buscar por nombre, email, teléfono..." value={q} onChange={(e)=>setQ(e.target.value)} />
              <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
                <option value="all">Todos</option>
                <option value="confirmado">Confirmados</option>
                <option value="no">No asisten</option>
              </select>
              <select value={sort} onChange={(e)=>setSort(e.target.value)}>
                <option value="created_at:desc">Más recientes</option>
                <option value="created_at:asc">Más antiguos</option>
                <option value="name:asc">Nombre A-Z</option>
                <option value="name:desc">Nombre Z-A</option>
              </select>
              <button onClick={load} title="Recargar">🔄</button>
              <button onClick={()=>exportToExcel(filtered, 'invitados.xlsx')} title="Exportar a Excel">📥 Exportar Excel</button>
            </div>

            <div style={{overflowX:'auto'}}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Acomp.</th>
                    <th>Invitado</th>
                    <th>WhatsApp</th>
                    <th>Alergias</th>
                    <th>Mensaje</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={10}>Cargando...</td></tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr><td colSpan={10}>Sin resultados</td></tr>
                  )}
                  {filtered.map(row => (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td>{row.email}</td>
                      <td>{row.phone}</td>
                      <td>
                        <select
                          value={row.status}
                          onChange={(e)=>updateRow(row.id, { status: e.target.value })}
                        >
                          <option value="confirmado">confirmado</option>
                          <option value="no">no</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          max={2}
                          value={row.guests_count || 1}
                          onChange={(e)=>updateRow(row.id, { guests_count: Math.min(2, Math.max(1, Number(e.target.value)||1)) })}
                          style={{width:60}}
                        />
                      </td>
                      <td>
                        <input
                          value={row.guest_name || ''}
                          onChange={(e)=>updateRow(row.id, { guest_name: e.target.value })}
                        />
                      </td>
                      <td>{row.whatsapp ? 'Sí' : 'No'}</td>
                      <td>
                        <input
                          value={row.allergies || ''}
                          onChange={(e)=>updateRow(row.id, { allergies: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          value={row.message || ''}
                          onChange={(e)=>updateRow(row.id, { message: e.target.value })}
                        />
                      </td>
                      <td className="actions">
                        <button onClick={()=>removeRow(row.id)} title="Eliminar">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'pairs' && (
          <div className="admin-card">
            <div className="admin-toolbar">
              <button onClick={()=>exportToExcel(pairs, 'parejas.xlsx')}>📥 Exportar Parejas</button>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Invitado</th>
                    <th>Acompañante</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {pairs.length === 0 ? (
                    <tr><td colSpan={4}>No hay invitados con +1</td></tr>
                  ) : (
                    pairs.map(p => (
                      <tr key={p.id}>
                        <td>{p.invitado}</td>
                        <td>{p.acompanante}</td>
                        <td>{p.email}</td>
                        <td>{p.telefono}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'seating' && (
          <div className="admin-card">
            <div className="seating-controls">
              <div>
                <label>Mesas</label>
                <input type="number" min={1} max={50} value={tablesCount} onChange={(e)=>handleTablesChange(e.target.value)} />
              </div>
              <div>
                <label>Asientos por mesa</label>
                <input type="number" min={1} max={20} value={seatsPerTable} onChange={(e)=>handleSeatsChange(e.target.value)} />
              </div>
              <div className="guest-pool">
                <div className="guest-pool-title">Invitados sin asignar ({unassignedGuests.length})</div>
                <div className="guest-pool-list">
                  {unassignedGuests.map(g => (
                    <button
                      key={g.id}
                      className={`guest-chip ${selectedGuest?.id===g.id ? 'selected' : ''}`}
                      onClick={()=>setSelectedGuest(g)}
                    >{g.label}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="seating-wrapper">
              {Array.from({ length: tablesCount }).map((_, t) => (
                <div key={t} className="table-card">
                  <div className="table-title">Mesa {t+1}</div>
                  <div className="seats-grid">
                    {Array.from({ length: seatsPerTable }).map((__, s) => {
                      const key = `${t}-${s}`;
                      const guestId = assignments[key];
                      const guest = guestId ? guests.find(g => g.id === guestId) : null;
                      return (
                        <div key={key} className={`seat ${guest ? 'assigned' : ''}`} onClick={()=> guest ? unassignSeat(t,s) : assignSelectedToSeat(t,s)}>
                          <div className="seat-number">{s+1}</div>
                          <div className="seat-label">{guest ? guest.label : 'Libre'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === 'story' && (
          <div className="admin-card">
            <div className="admin-toolbar">
              <button onClick={loadStory} title="Recargar">🔄</button>
              <button onClick={addStoryRow} title="Nuevo hito">➕ Nuevo hito</button>
              {storyMsg && <span style={{ marginLeft: 'auto', color: '#6b7280' }}>{storyMsg}</span>}
            </div>

            {storyLoading ? (
              <div>Cargando historia…</div>
            ) : storyRows.length === 0 ? (
              <div>No hay hitos aún. Crea el primero.</div>
            ) : (
              <div style={{ display: 'grid', gap: '.75rem' }}>
                {storyRows.map((r, idx) => (
                  <div
                    key={r.id}
                    className="story-row"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '180px 1fr',
                      gap: '.75rem',
                      alignItems: 'start',
                      border: '1px solid rgba(0,0,0,.06)',
                      borderRadius: '12px',
                      padding: '.75rem',
                    }}
                  >
                    <div style={{ display: 'grid', gap: '.5rem' }}>
                      <img
                        src={r.image_url || STORY_IMAGE_OPTIONS[0]}
                        alt="preview"
                        style={{
                          width: '180px',
                          height: '130px',
                          objectFit: 'cover',
                          borderRadius: '10px',
                          border: '1px solid rgba(0,0,0,.05)',
                        }}
                      />
                      <label style={{ fontSize: '.85rem', fontWeight: 700 }}>Imagen (public/images)</label>
                      <select
                        value={r.image_url || ''}
                        onChange={(e) => updateStoryRow(r.id, { image_url: e.target.value })}
                      >
                        <option value="">-- Selecciona imagen --</option>
                        {STORY_IMAGE_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <input
                        placeholder="/images/mi_imagen.jpg"
                        value={r.image_url || ''}
                        onChange={(e) => setStoryFieldLocal(r.id, 'image_url', e.target.value)}
                        onBlur={(e) => updateStoryRow(r.id, { image_url: e.target.value })}
                      />
                      <div style={{ display: 'flex', gap: '.35rem' }}>
                        <button onClick={() => moveStory(r.id, -1)} disabled={idx === 0}>
                          ⬆️
                        </button>
                        <button onClick={() => moveStory(r.id, +1)} disabled={idx === storyRows.length - 1}>
                          ⬇️
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: '.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px', gap: '.5rem' }}>
                        <div>
                          <label>Año</label>
                          <input
                            type="number"
                            value={r.year || ''}
                            onChange={(e) => setStoryFieldLocal(r.id, 'year', Number(e.target.value))}
                            onBlur={(e) => updateStoryRow(r.id, { year: Number(e.target.value) || null })}
                          />
                        </div>
                        <div>
                          <label>Título</label>
                          <input
                            value={r.title || ''}
                            onChange={(e) => setStoryFieldLocal(r.id, 'title', e.target.value)}
                            onBlur={(e) => updateStoryRow(r.id, { title: e.target.value })}
                          />
                        </div>
                        <div>
                          <label>Icono</label>
                          <input
                            value={r.icon || ''}
                            onChange={(e) => setStoryFieldLocal(r.id, 'icon', e.target.value)}
                            onBlur={(e) => updateStoryRow(r.id, { icon: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label>Descripción</label>
                        <textarea
                          rows={3}
                          value={r.description || ''}
                          onChange={(e) => setStoryFieldLocal(r.id, 'description', e.target.value)}
                          onBlur={(e) => updateStoryRow(r.id, { description: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                          <input
                            type="checkbox"
                            checked={!!r.is_published}
                            onChange={(e) => {
                              setStoryFieldLocal(r.id, 'is_published', e.target.checked);
                              updateStoryRow(r.id, { is_published: e.target.checked });
                            }}
                          />
                          Publicado
                        </label>
                        <span style={{ color: '#6b7280' }}>Orden: {r.sort_order ?? idx}</span>
                        <button style={{ marginLeft: 'auto' }} onClick={() => removeStoryRow(r.id)}>
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
