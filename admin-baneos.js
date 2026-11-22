'use strict';
// Pestana "Baneos" del admin (aditiva): baneos de la pagina por UserId + dispositivo, con motivo
(function () {
  const bar = document.getElementById('tabs'), panel = document.getElementById('panel');
  if (!bar || !panel || typeof api !== 'function') return;
  const btn = document.createElement('button'); btn.dataset.t = 'baneos'; btn.textContent = 'Baneos';
  bar.appendChild(btn);
  const tab = document.createElement('div'); tab.className = 'tab hide'; tab.dataset.t = 'baneos';
  panel.appendChild(tab);
  const el = (tag, props, ...kids) => { const e = document.createElement(tag); Object.assign(e, props || {}); kids.forEach((k) => e.append(k)); return e; };
  const fecha = (t) => (t ? new Date(t).toLocaleString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-');
  const msg = el('div', { className: 'msg' }), lista = el('div'), est = el('p', { textContent: '...' });
  const inU = el('input', { placeholder: 'Usuario de Roblox o UserId', maxLength: 24 });
  const inM = el('input', { placeholder: 'Motivo (sale en el cartel de kick)', maxLength: 200 });
  const bBan = el('button', { textContent: 'Banear' });
  bBan.addEventListener('click', async () => {
    try { const r = await api('/api/admin/baneos', { method: 'POST', body: { usuario: inU.value.trim(), motivo: inM.value.trim() } }); show(msg, `Baneado: ${r.usuario} (${r.dispositivos} dispositivo(s) registrados)`, true); inU.value = ''; inM.value = ''; cargar(); }
    catch (e) { show(msg, e.message, false); }
  });
  async function cargar() {
    try {
      const d = await api('/api/admin/baneos');
      est.textContent = `Baneados: ${d.baneos.length} | Cuentas vistas: ${d.vistos}`;
      lista.textContent = '';
      if (!d.baneos.length) { lista.append(el('p', { textContent: 'No hay baneos.' })); return; }
      const t = el('table'); t.append(el('thead', {}, el('tr', {}, ...['Usuario', 'Motivo', 'Fecha', 'Tipo', ''].map((h) => el('th', { textContent: h })))));
      const tb = el('tbody');
      d.baneos.forEach((b) => {
        const q = el('button', { className: 'ghost', textContent: 'Quitar baneo' });
        q.addEventListener('click', async () => { if (!confirm('¿Quitar el baneo de ' + (b.name || b.id) + '? También se quitan sus cuentas alternas.')) return; try { await api('/api/admin/baneos/' + b.id, { method: 'DELETE', body: {} }); show(msg, 'Baneo quitado.', true); cargar(); } catch (e) { show(msg, e.message, false); } });
        tb.append(el('tr', {}, el('td', { textContent: `${b.name || '?'} (${b.id})` }), el('td', { textContent: b.motivo }), el('td', { textContent: fecha(b.ts) }), el('td', { textContent: b.via ? 'alterna de ' + b.via : 'directo' }), el('td', {}, q)));
      });
      t.append(tb); lista.append(t);
    } catch (e) { est.textContent = 'No se pudo leer (' + e.message + ').'; }
  }
  tab.append(
    el('div', { className: 'card' }, el('h3', { textContent: 'Baneos de la página' }), est, el('p', { textContent: 'Valen para todos los scripts (Hub, Duelos, Universal) sin tocar los loaders. Se banea la cuenta y también el dispositivo: si entra con otra cuenta, se detecta y se banea sola con el mismo motivo.' })),
    el('div', { className: 'card' }, el('h3', { textContent: 'Banear' }), inU, inM, el('div', { className: 'row' }, bBan), msg),
    el('div', { className: 'card' }, el('h3', { textContent: 'Lista' }), lista)
  );
  btn.addEventListener('click', cargar);
})();
