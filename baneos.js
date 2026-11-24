
'use strict';
// ============================================================================
// BANEOS DE LA PAGINA (aditivo). Funciona sin tocar ningun loader:
//  - A todo script que sirve la pagina se le antepone una verificacion corta (Lua).
//  - Esa verificacion manda UserId, usuario y el identificador del dispositivo (RbxAnalyticsService:GetClientId y gethwid si existe).
//  - Se banea por UserId Y por dispositivo: otra cuenta en el mismo dispositivo tambien queda baneada.
//  - El motivo que escribes sale en el cartel de kick (el mismo diseno del hub).
//  - Si la pagina no responde, el jugador pasa (nunca se bloquea a nadie por un error de red).
// ============================================================================
const crypto = require('crypto');

const KICK_LUA = "local function uzKick(caido, extra)\n    -- Kick de Roblox, pero con el cartel de kick redisenado (estilo del selector: papel claro, borde plateado que gira)\n    local titulo = caido and \"UZIVERT HUB  |  NO FUNCIONA POR AHORA\" or \"UZIVERT HUB  |  EN MANTENIMIENTO\"\n    local msg = caido and \"El script dejo de funcionar por ahora. Vuelve luego.\" or \"El script se puso en mantenimiento. Vuelve luego.\"\n    if extra then titulo = extra.titulo or titulo msg = extra.msg or msg end\n    pcall(function() game:GetService(\"Players\").LocalPlayer:Kick(msg) end)\n    task.spawn(function()\n        pcall(function()\n            local CG = game:GetService(\"CoreGui\")\n            local ov\n            for _ = 1, 80 do   -- espera (hasta 8 s) a que Roblox dibuje su cartel de kick\n                local rg = CG:FindFirstChild(\"RobloxPromptGui\")\n                ov = rg and rg:FindFirstChild(\"promptOverlay\")\n                if ov and ov:FindFirstChild(\"ErrorPrompt\") then break end\n                ov = nil\n                task.wait(0.1)\n            end\n            if not ov then return end\n            local PAPER, INK, GRAPH, SILVER = Color3.fromRGB(244, 245, 250), Color3.fromRGB(18, 20, 30), Color3.fromRGB(40, 44, 62), Color3.fromRGB(176, 186, 214)\n            local ep = ov.ErrorPrompt\n            local sg\n            local function pintar()\n                pcall(function() ov.BackgroundColor3 = Color3.fromRGB(8, 9, 14); ov.BackgroundTransparency = 0.35 end)\n                pcall(function()\n                    if ep:IsA(\"ImageLabel\") or ep:IsA(\"ImageButton\") then ep.Image = \"\" end\n                    ep.BackgroundColor3 = PAPER; ep.BackgroundTransparency = 0\n                    if not ep:FindFirstChild(\"UzCorner\") then\n                        local c = Instance.new(\"UICorner\"); c.Name = \"UzCorner\"; c.CornerRadius = UDim.new(0, 12); c.Parent = ep\n                        local st = Instance.new(\"UIStroke\"); st.Name = \"UzStroke\"; st.Thickness = 2; st.Color = Color3.new(1, 1, 1); st.Parent = ep\n                        sg = Instance.new(\"UIGradient\")\n                        sg.Color = ColorSequence.new({ ColorSequenceKeypoint.new(0, Color3.new(1, 1, 1)), ColorSequenceKeypoint.new(0.5, SILVER), ColorSequenceKeypoint.new(1, Color3.new(1, 1, 1)) })\n                        sg.Parent = st\n                    end\n                end)\n                for _, o in ipairs(ep:GetDescendants()) do\n                    pcall(function()\n                        local n = string.lower(o.Name)\n                        if o:IsA(\"TextLabel\") or o:IsA(\"TextButton\") then\n                            local boton = o:IsA(\"TextButton\") or (o.Parent and string.find(string.lower(o.Parent.Name), \"button\"))\n                            o.Font = Enum.Font.GothamBold\n                            o.TextColor3 = boton and Color3.new(1, 1, 1) or ((string.find(n, \"title\") and INK) or GRAPH)\n                            if string.find(n, \"title\") then o.Text = titulo; o.TextSize = 20 end\n                        elseif o:IsA(\"ImageButton\") or o:IsA(\"ImageLabel\") or (o:IsA(\"Frame\") and string.find(n, \"button\")) then\n                            if string.find(n, \"button\") then\n                                if not o:IsA(\"Frame\") then o.Image = \"\" end\n                                o.BackgroundColor3 = GRAPH; o.BackgroundTransparency = 0\n                                if not o:FindFirstChildOfClass(\"UICorner\") then Instance.new(\"UICorner\", o).CornerRadius = UDim.new(0, 8) end\n                            end\n                        end\n                    end)\n                end\n            end\n            local t0 = os.clock()\n            while ov.Parent and os.clock() - t0 < 600 do   -- Roblox suele repintar: se reaplica un rato\n                pintar()\n                if sg then sg.Rotation = (os.clock() * 90) % 360 end\n                task.wait(0.1)\n            end\n        end)\n    end)\nend\n";

module.exports = function instalarBaneos(app, ctx) {
  const { adminOnly, audit, store, limited, ip, clean, baseUrl, apiAdmin } = ctx;
  // Mantiene tambien el baneo viejo de la API (el cargador del hub grande lo usa) con el mismo motivo; si la API no responde, no pasa nada
  const viejo = async (name, accion, motivo) => { if (!apiAdmin || !name) return; try { await apiAdmin('/admin/ban', { user: name, accion, motivo: motivo || '' }); } catch (e) { console.error('[baneos] API vieja:', e.message); } };
  const ROBLOX_USERS = (ctx.ROBLOX_USERS || 'https://users.roblox.com').replace(/\/$/, '');
  const hash = (x) => crypto.createHash('sha256').update('uzb:' + String(x)).digest('hex').slice(0, 24);
  let D = { bans: {}, vistos: {} };            // bans[uid] = { uid, name, motivo, ts, por, cids:[], hws:[], via? } | vistos[uid] = { name, cids:[], hws:[], ts }
  let idx = new Map();                          // hash de dispositivo -> uid del baneo
  let sucio = false, timer = null;
  const cargada = (async () => {
    try { const j = JSON.parse((await store.read('baneos.json')) || '{}'); D = { bans: j.bans || {}, vistos: j.vistos || {} }; } catch (e) { console.error('[baneos] no pude leer:', e.message); }
    reindex();
  })();
  function reindex() { idx = new Map(); for (const b of Object.values(D.bans)) for (const h of [].concat(b.cids || [], b.hws || [])) idx.set(h, b.uid); }
  function guardar() {
    sucio = true; if (timer) return;
    timer = setTimeout(async () => {
      timer = null; if (!sucio) return; sucio = false;
      try {
        const ks = Object.keys(D.vistos);
        if (ks.length > 20000) ks.sort((a, b) => D.vistos[a].ts - D.vistos[b].ts).slice(0, ks.length - 15000).forEach((k) => delete D.vistos[k]);
        await store.write('baneos.json', JSON.stringify(D));
      } catch (e) { sucio = true; console.error('[baneos] guardar:', e.message); }
    }, 8000);
    if (timer.unref) timer.unref();
  }

  // ---- Lua que se antepone a los scripts
  app.__baneoPre = (req) => {
    const base = JSON.stringify(baseUrl(req));
    return `do local P = game:GetService("Players").LocalPlayer
local HS = game:GetService("HttpService")
local cid, hw, ex = "", "", ""
pcall(function() cid = tostring(game:GetService("RbxAnalyticsService"):GetClientId()) end)
pcall(function() if gethwid then hw = tostring(gethwid()) end end)
pcall(function() ex = tostring(identifyexecutor and identifyexecutor() or "") end)
local ok, r = pcall(function() return game:HttpGet(${base} .. "/b/c?u=" .. P.UserId .. "&n=" .. HS:UrlEncode(P.Name) .. "&c=" .. HS:UrlEncode(cid) .. "&h=" .. HS:UrlEncode(hw) .. "&e=" .. HS:UrlEncode((ex:gsub("[^%w ]", "")))) end)
local motivo = ok and type(r) == "string" and r:match("^BAN|(.*)$")
local function uzBan(motivo)
${KICK_LUA}
uzKick(false, { titulo = "UZIVERT HUB  |  BANEADO", msg = "Fuiste baneado de Uzivert Hub.\\nMotivo: " .. motivo })
end
if motivo then uzBan(motivo) return end
-- revision continua: si te banean mientras usas el hub, te saca en unos segundos con el cartel y el motivo
task.spawn(function()
    local t0 = os.clock()
    while os.clock() - t0 < 21600 do
        task.wait(10)
        local ok2, r2 = pcall(function() return game:HttpGet(${base} .. "/b/c?r=1&u=" .. P.UserId .. "&c=" .. HS:UrlEncode(cid) .. "&h=" .. HS:UrlEncode(hw)) end)
        local m2 = ok2 and type(r2) == "string" and r2:match("^BAN|(.*)$")
        if m2 then
            pcall(function() getgenv().UZIVERT_APAGADO = true end)
            uzBan(m2)
            break
        end
    end
end)
end
`;
  };

  // ---- verificacion (la llama el Lua de arriba)
  app.get('/b/c', async (req, res) => {
    res.type('text/plain; charset=utf-8').setHeader('Cache-Control', 'no-store');
    try {
      await cargada;
      if (limited('bc:' + ip(req), 600, 60e3)) return res.send('OK');
      const q = req.query, u = clean(q.u, 16);
      if (!/^\d{1,12}$/.test(u) || u === '0') return res.send('OK');
      const cid = clean(q.c, 80), hw = clean(q.h, 120);
      const hc = cid && cid.length >= 8 ? hash('c' + cid) : '', hh = hw && hw.length >= 8 ? hash('h' + hw) : '', hs = [hc, hh].filter(Boolean);
      const rev = q.r === '1';   // revision periodica: solo consulta, no escribe nada
      const v = rev ? (D.vistos[u] || { name: '', cids: [], hws: [], ts: 0 }) : (D.vistos[u] || (D.vistos[u] = { name: '', cids: [], hws: [], ts: 0 }));
      if (!rev) {
        v.name = clean(q.n, 24) || v.name; v.ts = Date.now();
        if (hc && !v.cids.includes(hc)) { v.cids.push(hc); if (v.cids.length > 6) v.cids.shift(); }
        if (hh && !v.hws.includes(hh)) { v.hws.push(hh); if (v.hws.length > 6) v.hws.shift(); }
        guardar();
      }
      let b = D.bans[u];
      if (!b) {   // otra cuenta desde un dispositivo baneado
        const origen = hs.map((h) => idx.get(h)).find(Boolean);
        if (origen && D.bans[origen]) {
          const o = D.bans[origen];
          b = D.bans[u] = { uid: u, name: v.name, motivo: o.motivo, ts: Date.now(), por: 'automatico', via: origen, cids: v.cids.slice(), hws: v.hws.slice() };
          reindex(); guardar();
          console.log('[baneos] cuenta alterna detectada:', u, 'via', origen);
        }
      }
      if (!b) return res.send('OK');
      let ch = false;   // si el baneado entro desde un dispositivo nuevo, tambien se registra
      if (hc && !b.cids.includes(hc)) { b.cids.push(hc); ch = true; }
      if (hh && !b.hws.includes(hh)) { b.hws.push(hh); ch = true; }
      if (ch) { reindex(); guardar(); }
      res.send('BAN|' + String(b.motivo || 'Sin motivo').replace(/[\r\n|]/g, ' ').slice(0, 200));
    } catch (e) { res.send('OK'); }
  });

  // ---- admin
  const lista = () => Object.values(D.bans).sort((a, b) => b.ts - a.ts).map((b) => ({ id: b.uid, name: b.name, motivo: b.motivo, ts: b.ts, por: b.por, via: b.via || null, dispositivos: (b.cids || []).length + (b.hws || []).length }));
  async function resolver(texto) {
    const t = String(texto || '').trim();
    if (/^\d{1,12}$/.test(t)) {
      try { const r = await fetch(`${ROBLOX_USERS}/v1/users/${t}`, { signal: AbortSignal.timeout(8000) }); if (r.ok) { const j = await r.json(); return { id: String(j.id), name: j.name }; } } catch {}
      return { id: t, name: '' };
    }
    if (!/^[A-Za-z0-9_]{3,20}$/.test(t)) return null;
    try {
      const r = await fetch(`${ROBLOX_USERS}/v1/usernames/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usernames: [t], excludeBannedUsers: false }), signal: AbortSignal.timeout(8000) });
      const j = await r.json(); const x = j && j.data && j.data[0]; return x ? { id: String(x.id), name: x.name } : null;
    } catch { return null; }
  }
  app.get('/api/admin/baneos', adminOnly, async (req, res) => { await cargada; res.json({ baneos: lista(), vistos: Object.keys(D.vistos).length }); });
  app.post('/api/admin/baneos', adminOnly, async (req, res) => {
    try {
      await cargada;
      const b = req.body || {}; const motivo = String(b.motivo || '').replace(/[\u0000-\u001f|]/g, ' ').trim().slice(0, 200) || 'Incumplir las reglas';
      const u = await resolver(b.usuario);
      if (!u) return res.status(400).json({ error: 'No encontré ese usuario de Roblox.' });
      const v = D.vistos[u.id] || { cids: [], hws: [] };
      D.bans[u.id] = { uid: u.id, name: u.name || v.name || '', motivo, ts: Date.now(), por: 'admin', cids: (v.cids || []).slice(), hws: (v.hws || []).slice() };
      for (const o of Object.values(D.bans)) if (o.via === u.id) o.motivo = motivo;
      reindex(); guardar(); audit(req, 'baneo (pagina)', `${u.name || u.id} | ${motivo}`);
      await viejo(u.name || D.vistos[u.id] && D.vistos[u.id].name, 'ban', motivo);
      res.json({ ok: true, usuario: u.name || u.id, dispositivos: D.bans[u.id].cids.length + D.bans[u.id].hws.length });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.delete('/api/admin/baneos/:id', adminOnly, async (req, res) => {
    await cargada;
    const id = String(req.params.id);
    if (!D.bans[id]) return res.status(404).json({ error: 'No está baneado.' });
    const nombres = [];
    for (const k of Object.keys(D.bans)) if (k === id || D.bans[k].via === id) { nombres.push(D.bans[k].name); delete D.bans[k]; }   // tambien sus cuentas alternas
    for (const n of nombres) await viejo(n, 'unban');
    reindex(); guardar(); audit(req, 'desbaneo (pagina)', id);
    res.json({ ok: true });
  });
};
