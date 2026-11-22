'use strict';
// Pestana "Vertix" del admin (aditiva): interruptor Normal / Mantenimiento / Apagado
(function () {
  const bar = document.getElementById('tabs'), panel = document.getElementById('panel');
  if (!bar || !panel || typeof api !== 'function') return;
  const btn = document.createElement('button'); btn.dataset.t = 'vertix'; btn.textContent = 'Vertix';
  bar.appendChild(btn);
  const tab = document.createElement('div'); tab.className = 'tab hide'; tab.dataset.t = 'vertix';
  panel.appendChild(tab);
  const el = (tag, props, ...kids) => { const e = document.createElement(tag); Object.assign(e, props || {}); kids.forEach((k) => e.append(k)); return e; };
  const msg = el('div', { className: 'msg' });
  const est = el('p', { textContent: '...' });
  const sel = el('select');
  [['normal', 'Normal (funcionando)'], ['mant', 'Mantenimiento'], ['off', 'Apagado']].forEach(([v, t]) => sel.append(el('option', { value: v, textContent: t })));
  const inMsg = el('input', { placeholder: 'Mensaje que verá la gente (opcional)', maxLength: 200 });
  const b = el('button', { textContent: 'Guardar' });
  b.addEventListener('click', async () => {
    try { const r = await api('/api/admin/vertix-modo', { method: 'PUT', body: { modo: sel.value, mensaje: inMsg.value } }); show(msg, 'Listo: Vertix en modo ' + r.modo + '.', true); cargar(); }
    catch (e) { show(msg, e.message, false); }
  });
  async function cargar() {
    try {
      const d = await api('/api/admin/vertix-modo');
      sel.value = d.modo; inMsg.value = d.mensajeGuardado || '';
      est.textContent = 'Modo actual: ' + ({ normal: 'Normal', mant: 'Mantenimiento', off: 'Apagado' }[d.modo]) + (d.mensaje ? ' | Mensaje: ' + d.mensaje : '');
    } catch (e) { est.textContent = 'No se pudo leer (' + e.message + ').'; }
  }
  tab.append(
    el('div', { className: 'card' }, el('h3', { textContent: 'Vertix' }), est),
    el('div', { className: 'card' }, el('h3', { textContent: 'Cambiar modo' }), el('p', { textContent: 'En Mantenimiento o Apagado, Vertix deja de responder en la página y en Discord y muestra tu mensaje. Tú (admin) puedes seguir probándolo. El bot cambia el emoji de su canal solo.' }), sel, inMsg, el('div', { className: 'row' }, b), msg)
  );
  btn.addEventListener('click', cargar);
})();
