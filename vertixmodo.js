'use strict';
// ============================================================================
// MODO DE VERTIX (aditivo): normal / mantenimiento / apagado, con mensaje opcional.
//  - Lo cambias desde el admin (pestaña "Vertix").
//  - Afecta al asistente de la pagina y a todo lo que use /api/vertix (incluido el Vertix de Discord).
//  - El bot.py lo lee en GET /api/vertix/modo para cambiar el emoji de su canal.
// ============================================================================
module.exports = function instalarVertixModo(app, ctx) {
  const { adminOnly, audit, store } = ctx;
  const MODOS = { normal: 'Normal', mant: 'Mantenimiento', off: 'Apagado' };
  const DEFECTO = { mant: 'Vertix está en mantenimiento. Vuelve en un rato.', off: 'Vertix está apagado por ahora.' };
  let estado = { modo: 'normal', mensaje: '', cambio: 0 };
  const cargada = (async () => {
    try { const j = JSON.parse((await store.read('vertix-modo.json')) || '{}'); if (MODOS[j.modo]) estado = { modo: j.modo, mensaje: String(j.mensaje || '').slice(0, 200), cambio: Number(j.cambio) || 0 }; }
    catch (e) { console.error('[vertix-modo] no pude leer:', e.message); }
  })();
  const publico = () => ({ modo: estado.modo, mensaje: estado.modo === 'normal' ? '' : (estado.mensaje || DEFECTO[estado.modo]), cambio: estado.cambio });
  app.__vxModo = publico;   // lo usa server.js para frenar /api/vertix y el soporte en vivo

  app.get('/api/vertix/modo', async (req, res) => { res.setHeader('Cache-Control', 'no-store'); await cargada; res.json(publico()); });
  app.get('/api/admin/vertix-modo', adminOnly, async (req, res) => { await cargada; res.json(Object.assign(publico(), { mensajeGuardado: estado.mensaje })); });
  app.put('/api/admin/vertix-modo', adminOnly, async (req, res) => {
    try {
      const b = req.body || {};
      const modo = String(b.modo || '');
      if (!MODOS[modo]) return res.status(400).json({ error: 'Modo inválido.' });
      estado = { modo, mensaje: String(b.mensaje || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 200), cambio: Date.now() };
      await store.write('vertix-modo.json', JSON.stringify(estado));
      audit(req, 'vertix: modo', MODOS[modo] + (estado.mensaje ? ' | ' + estado.mensaje : ''));
      res.json(Object.assign(publico(), { mensajeGuardado: estado.mensaje }));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
