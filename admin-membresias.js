'use strict';
// Pestana "Membresias" del admin (aditiva: se agrega sola al panel; no cambia nada de lo que ya existe)
(function () {
  const bar = document.getElementById('tabs'), panel = document.getElementById('panel');
  if (!bar || !panel || typeof api !== 'function') return;
  const btn = document.createElement('button'); btn.dataset.t = 'membresias'; btn.textContent = 'Membresías';
  bar.appendChild(btn);
  const tab = document.createElement('div'); tab.className = 'tab hide'; tab.dataset.t = 'membresias';
  panel.appendChild(tab);

  const el = (tag, props, ...kids) => { const e = document.createElement(tag); Object.assign(e, props || {}); kids.forEach((k) => e.append(k)); return e; };
  const fecha = (t) => (t ? new Date(t).toLocaleString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-');
  const msg = el('div', { className: 'msg' });
  const lista = el('div');
  const est = el('p', { textContent: '...' });

  const inUser = el('input', { placeholder: 'Usuario de Roblox', maxLength: 20 });
  const selPlan = el('select'); selPlan.append(el('option', { value: 'exclusiva', textContent: 'Exclusiva (80 Robux)' }), el('option', { value: 'premium', textContent: 'Premium (160 Robux)' }));
  const inNota = el('input', { placeholder: 'Nota (opcional)', maxLength: 120 });
  const bAlta = el('button', { textContent: 'Agregar compra' });
  bAlta.addEventListener('click', async () => {
    try { const r = await api('/api/admin/membresias', { method: 'POST', body: { usuario: inUser.value.trim(), plan: selPlan.value, nota: inNota.value } }); show(msg, `Listo: ${r.usuario.robloxName} (${r.usuario.planNombre})`, true); inUser.value = ''; inNota.value = ''; cargar(); }
    catch (e) { show(msg, e.message, false); }
  });

  const scriptsBox = el('div');
  function scriptsUI(sc) {
    scriptsBox.textContent = '';
    ['exclusiva', 'premium'].forEach((p) => {
      const ta = el('textarea', { placeholder: `Script de la membresía ${p} (Lua)`, style: 'min-height:90px;width:100%' });
      const b = el('button', { className: 'ghost', textContent: `Guardar script ${p}` });
      b.addEventListener('click', async () => { try { const r = await api('/api/admin/membresias/script/' + p, { method: 'PUT', body: { codigo: ta.value } }); show(msg, `Script ${p} guardado (${r.largo} caracteres).`, true); ta.value = ''; cargar(); } catch (e) { show(msg, e.message, false); } });
      scriptsBox.append(el('label', { textContent: `${p[0].toUpperCase() + p.slice(1)}: ${sc[p] ? sc[p] + ' caracteres cargados' : 'sin script (usa uno de prueba)'}` }), ta, el('div', { className: 'row' }, b));
    });
  }

  async function accion(id, a, body, ok) {
    try { await api(`/api/admin/membresias/${id}/${a}`, { method: 'POST', body: body || {} }); show(msg, ok, true); cargar(); } catch (e) { show(msg, e.message, false); }
  }
  async function cargar() {
    try {
      const d = await api('/api/admin/membresias');
      est.textContent = `Base: ${d.db} | Reset de HWID cada ${d.resetHoras} h | Cuentas: ${d.usuarios.length}`;
      scriptsUI(d.scripts || {});
      lista.textContent = '';
      if (!d.usuarios.length) { lista.append(el('p', { textContent: 'Todavía no hay cuentas.' })); return; }
      const t = el('table'); t.append(el('thead', {}, el('tr', {}, ...['Roblox', 'Plan', 'Discord', 'Dispositivo', 'Último reset', ''].map((h) => el('th', { textContent: h })))));
      const tb = el('tbody');
      d.usuarios.forEach((u) => {
        const ac = el('td'); ac.style.whiteSpace = 'nowrap';
        const mk = (txt, fn, cls) => { const b = el('button', { className: 'ghost' + (cls ? ' ' + cls : ''), textContent: txt }); b.style.marginRight = '6px'; b.addEventListener('click', fn); return b; };
        ac.append(
          mk('Reset HWID', () => accion(u.robloxId, 'reset', {}, 'HWID reseteado.')),
          mk('Nuevo token', () => { if (confirm('El loader anterior deja de funcionar. ¿Seguro?')) accion(u.robloxId, 'token', {}, 'Token regenerado.'); }),
          mk('Desvincular', () => { if (confirm('¿Desvincular Discord y dispositivo?')) accion(u.robloxId, 'desvincular', {}, 'Desvinculado.'); }),
          mk('Borrar', async () => { if (!confirm('¿Borrar esta cuenta?')) return; try { await api('/api/admin/membresias/' + u.robloxId, { method: 'DELETE', body: {} }); show(msg, 'Borrada.', true); cargar(); } catch (e) { show(msg, e.message, false); } })
        );
        tb.append(el('tr', {}, el('td', { textContent: `${u.robloxName} (${u.robloxId})` }), el('td', { textContent: u.planNombre || 'solo verificado' }), el('td', { textContent: u.discordName || '-' }), el('td', { textContent: u.vinculado ? 'vinculado' : 'libre' }), el('td', { textContent: fecha(u.lastReset) }), ac));
      });
      t.append(tb); lista.append(t);
    } catch (e) { est.textContent = 'Membresías apagadas o sin base de datos (' + e.message + ').'; scriptsBox.textContent = ''; lista.textContent = ''; }
  }

  tab.append(
    el('div', { className: 'card' }, el('h3', { textContent: 'Membresías' }), est),
    el('div', { className: 'card' }, el('h3', { textContent: 'Agregar compra' }), el('p', { textContent: 'Cuando alguien te pasa los Robux, cargá su usuario de Roblox y el plan.' }), inUser, selPlan, inNota, el('div', { className: 'row' }, bAlta), msg),
    el('div', { className: 'card' }, el('h3', { textContent: 'Cuentas' }), lista),
    el('div', { className: 'card' }, el('h3', { textContent: 'Scripts de cada plan' }), el('p', { textContent: 'Lo que recibe cada miembro al ejecutar su loader. Premium usa el de Exclusiva si no tiene el suyo.' }), scriptsBox)
  );
  btn.addEventListener('click', cargar);
})();
