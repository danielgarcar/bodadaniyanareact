import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './RSVP.css';

const RSVP = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendance: '', // 'yes' | 'no'
    guests: 1,
    bringGuest: false,
    guestName: '',
    whatsapp: '',
    message: '',
    allergies: ''
  });
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Actualizar bringGuest desde radios
    if (name === 'bringGuest') {
      setFormData((prev) => ({ ...prev, bringGuest: value === 'yes', guests: value === 'yes' ? 2 : 1 }));
      return;
    }

    // Si cambia la asistencia a "no", reseteamos el +1
    if (name === 'attendance') {
      setFormData((prev) => ({
        ...prev,
        attendance: value,
        ...(value === 'no' ? { bringGuest: false, guests: 1, guestName: '' } : {})
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Validación básica
    if (!formData.name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!formData.email.trim()) {
      setError('El email es obligatorio.');
      return;
    }
    if (!formData.attendance) {
      setError('Selecciona si asistirás.');
      return;
    }
    if (formData.bringGuest && !formData.guestName.trim()) {
      setError('Por favor, indica el nombre del acompañante.');
      return;
    }
    if (formData.whatsapp && !formData.phone.trim()) {
      setError('Por favor, indica tu número de teléfono para añadirte al grupo de WhatsApp.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        status: formData.attendance === 'yes' ? 'confirmado' : 'no',
        guests_count: formData.bringGuest ? 2 : 1,
        guest_name: formData.bringGuest ? formData.guestName.trim() : '',
        whatsapp: !!formData.whatsapp,
        message: formData.message || '',
        allergies: formData.allergies || ''
      };
      // Insert RSVP y obtener el id
      const { data: rsvpData, error: dbError } = await supabase.from('rsvp').insert([payload]).select('id').single();
      if (dbError) throw dbError;
      // Insertar en guestbook
      await supabase.from('guestbook').insert([
        {
          rsvp_id: rsvpData.id,
          name: formData.name.trim(),
          guest_name: formData.bringGuest ? formData.guestName.trim() : '',
          message: formData.message || ''
        }
      ]);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        attendance: '',
        guests: 1,
        bringGuest: false,
        guestName: '',
        whatsapp: '',
        message: '',
        allergies: ''
      });
      setTouched({});
    } catch (err) {
      setError('No se pudo guardar tu confirmación. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rsvp-container">
        <section className="rsvp-hero">
          <h2>¡Gracias por tu respuesta! 💌</h2>
          <p>Hemos registrado tu confirmación. ¡Nos vemos muy pronto!</p>
        </section>
      </div>
    );
  }

  return (
    <div className="rsvp-container">
      <section className="rsvp-hero">
        <h2>Confirmar asistencia</h2>
        <p>Cuéntanos si podrás acompañarnos en nuestro gran día.</p>
      </section>

      <section className="rsvp-form-section">
        <div className="container">
          <form onSubmit={handleSubmit} className="rsvp-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} onBlur={handleBlur} required placeholder="Tu nombre completo" className={touched.name && !formData.name.trim() ? 'input-error' : ''} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} required placeholder="tucorreo@email.com" className={touched.email && !formData.email.trim() ? 'input-error' : ''} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={handleBlur} placeholder="Opcional" />
              </div>
              <div className="form-group">
                <label>¿Asistirás?</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="attendance" value="yes" checked={formData.attendance === 'yes'} onChange={handleChange} />
                    Sí
                  </label>
                  <label>
                    <input type="radio" name="attendance" value="no" checked={formData.attendance === 'no'} onChange={handleChange} />
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Mostrar +1 solo si asiste */}
            {formData.attendance === 'yes' && (
              <>
                {/* Traes invitado (+1) */}
                <div className="form-row">
                  <div className="form-group">
                    <label>TRAES INVITADO</label>
                    <div className="radio-group">
                      <label>
                        <input type="radio" name="bringGuest" value="yes" checked={formData.bringGuest === true} onChange={handleChange} />
                        Sí
                      </label>
                      <label>
                        <input type="radio" name="bringGuest" value="no" checked={formData.bringGuest === false} onChange={handleChange} />
                        No
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="allergies">Intolerancias alimenticias</label>
                    <input id="allergies" name="allergies" type="text" placeholder="Ej: gluten, lactosa, frutos secos..." value={formData.allergies} onChange={handleChange} onBlur={handleBlur} />
                  </div>
                </div>

                {/* Campo dinámico para nombre de invitado */}
                {formData.bringGuest && (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="guestName">Nombre del acompañante</label>
                      <input id="guestName" name="guestName" type="text" value={formData.guestName} onChange={handleChange} onBlur={handleBlur} placeholder="Nombre del invitado/a" className={touched.guestName && !formData.guestName.trim() ? 'input-error' : ''} />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Pregunta para grupo de WhatsApp */}
            <div className="form-row">
              <div className="form-group">
                <label>¿Quieres que te añadamos al grupo de WhatsApp?</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="whatsapp" value={true} checked={formData.whatsapp === true || formData.whatsapp === 'true'} onChange={() => setFormData((prev) => ({ ...prev, whatsapp: true }))} /> Sí
                  </label>
                  <label>
                    <input type="radio" name="whatsapp" value={false} checked={formData.whatsapp === false || formData.whatsapp === 'false' || formData.whatsapp === ''} onChange={() => setFormData((prev) => ({ ...prev, whatsapp: false }))} /> No
                  </label>
                </div>
              </div>
            </div>
            {/* Si quiere WhatsApp, pedir teléfono */}
            {formData.whatsapp === true && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Teléfono para WhatsApp</label>
                  <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={handleBlur} placeholder="Tu número de WhatsApp" />
                </div>
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <input id="message" name="message" type="text" value={formData.message} onChange={handleChange} onBlur={handleBlur} placeholder="¿Algo que quieras contarnos? (opcional)" />
              </div>
            </div>

            {error && <div className="rsvp-error">{error}</div>}
            {/* Feedback visual para campos requeridos */}
            <div className="form-feedback">
              {touched.name && !formData.name.trim() && <span className="input-error-msg">El nombre es obligatorio.</span>}
              {touched.email && !formData.email.trim() && <span className="input-error-msg">El email es obligatorio.</span>}
              {formData.bringGuest && touched.guestName && !formData.guestName.trim() && <span className="input-error-msg">El nombre del acompañante es obligatorio.</span>}
              {formData.whatsapp === true && touched.phone && !formData.phone.trim() && <span className="input-error-msg">El teléfono es obligatorio para WhatsApp.</span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar confirmación'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default RSVP;