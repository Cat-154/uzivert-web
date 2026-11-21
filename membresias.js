'use strict';
// ============================================================================
// MEMBRESIAS (aditivo, apagado por defecto)
//  - Se activa con la variable MEMBRESIAS=1 y la base con MONGO_URL_MEMBRESIAS.
//  - Con MEMBRESIAS_PRUEBA=1 y sin Mongo usa memoria (solo para probar, se borra al reiniciar).
//  - Bot de Discord: manda la cabecera x-memb-key = MEMB_BOT_KEY.
//  - Reset de HWID: cada MEMB_RESET_HORAS horas (6 por defecto). El staff resetea sin limite.
// Planes: exclusiva (80 Robux) y premium (160 Robux), ambos permanentes.
// ============================================================================
const crypto = require('crypto');

module.exports = function instalarMembresias(app, ctx) {
  const { adminOnly, audit, baseUrl, env } = ctx;
  const ROBLOX_USERS = (ctx.ROBLOX_USERS || 'https://users.roblox.com').replace(/\/$/, '');
  const ON = env.MEMBRESIAS === '1';
  const PLANES = { exclusiva: 'Exclusiva', premium: 'Premium' };
  const RESET_MS = (Number(env.MEMB_RESET_HORAS) || 6) * 3600e3;
  const CODIGO_MS = 10 * 60e3;
  const BOT_KEY = env.MEMB_BOT_KEY || '';

  // El panel siempre puede preguntar si esta encendido
  app.get('/api/admin/membresias/estado', adminOnly, (req, res) => res.json({ activo: ON, db: ON ? dbTipo : null, resetHoras: RESET_MS / 3600e3, botKey: !!BOT_KEY }));
  let dbTipo = 'apagado';
  if (!ON) return;

  // ---------------------------------------------------------------- base de datos
  // Interfaz minima: get / put / del / list / findBy (coleccion, id)
  function memDb() {
    const cols = {};
    const c = (n) => (cols[n] = cols[n] || new Map());
    return {
      tipo: 'memoria (prueba)',
      async get(n, id) { const d = c(n).get(String(id)); return d ? JSON.parse(JSON.stringify(d)) : null; },
      async put(n, id, doc) { c(n).set(String(id), JSON.parse(JSON.stringify(doc))); },
      async del(n, id) { c(n).delete(String(id)); },
      async list(n) { return [...c(n).values()].map((d) => JSON.parse(JSON.stringify(d))); },
      async findBy(n, campo, valor) { for (const d of c(n).values()) if (d[campo] === valor && valor !== '' && valor != null) return JSON.parse(JSON.stringify(d)); return null; },
    };
  }
  function mongoDb(url) {
    let MongoClient;
    try { ({ MongoClient } = require('mongodb')); } catch { throw new Error('Falta la libreria "mongodb" (agregala en package.json: "mongodb": "^6.8.0").'); }
    const client = new MongoClient(url, { serverSelectionTimeoutMS: 8000 });
    let dbp = null;
    const col = async (n) => { if (!dbp) dbp = client.connect().then(() => client.db(env.MONGO_DB_MEMBRESIAS || 'uzivert_membresias')); const d = await dbp; return d.collection(n); };
    return {
      tipo: 'mongo',
      async get(n, id) { return (await col(n)).findOne({ _id: String(id) }); },
      async put(n, id, doc) { const d = Object.assign({}, doc, { _id: String(id) }); await (await col(n)).replaceOne({ _id: String(id) }, d, { upsert: true }); },
      async del(n, id) { await (await col(n)).deleteOne({ _id: String(id) }); },
      async list(n) { return (await col(n)).find({}).toArray(); },
      async findBy(n, campo, valor) { if (valor === '' || valor == null) return null; return (await col(n)).findOne({ [campo]: valor }); },
    };
  }
  let DB = null;
  try {
    if (env.MONGO_URL_MEMBRESIAS) DB = mongoDb(env.MONGO_URL_MEMBRESIAS);
    else if (env.MEMBRESIAS_PRUEBA === '1') DB = memDb();
  } catch (e) { console.error('[membresias] ' + e.message); }
  if (!DB) {
    console.error('[membresias] MEMBRESIAS=1 pero falta MONGO_URL_MEMBRESIAS: el sistema queda apagado.');
    return;
  }
  dbTipo = DB.tipo;
  console.log('[membresias] activo | base: ' + DB.tipo + (BOT_KEY ? '' : ' | AVISO: falta MEMB_BOT_KEY (el bot no podra conectarse)'));

  // ---------------------------------------------------------------- utilidades
  const hh = (h) => crypto.createHash('sha256').update('uzv-hwid:' + String(h)).digest('hex');
  const nuevoToken = () => crypto.randomBytes(24).toString('base64url');
  const ALFA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const nuevoCodigo = () => { const b = crypto.randomBytes(8); let s = ''; for (let i = 0; i < 8; i++) s += ALFA[b[i] % ALFA.length]; return `UZV-${s.slice(0, 4)}-${s.slice(4)}`; };
  const limpiar = (s, max) => String(s == null ? '' : s).replace(/[\u0000-\u001F]/g, '').trim().slice(0, max);
  const esId = (s) => /^\d{1,12}$/.test(String(s));
  const esNombre = (s) => /^[A-Za-z0-9_]{3,20}$/.test(String(s));
  const luaStr = (s) => '"' + String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '').replace(/\n/g, '\\n').replace(/[\u0000-\u001F]/g, '') + '"';
  const igual = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
  const lim = new Map();
  const limite = (clave, max, ms) => { const n = Date.now(); const a = (lim.get(clave) || []).filter((t) => n - t < ms); if (a.length >= max) { lim.set(clave, a); return false; } a.push(n); lim.set(clave, a); if (lim.size > 5000) lim.clear(); return true; };
  const noStore = (res) => res.setHeader('Cache-Control', 'no-store');
  const lua = (res, src) => { noStore(res); res.type('text/plain; charset=utf-8').send(src); };
  const planDe = (u) => (u && PLANES[u.plan] ? u.plan : '');
  const publico = (u) => ({ robloxId: u.robloxId, robloxName: u.robloxName, plan: u.plan || '', planNombre: PLANES[u.plan] || '', discordId: u.discordId || '', discordName: u.discordName || '', vinculado: !!u.hwid, lastReset: u.lastReset || 0, linkedAt: u.linkedAt || 0, creado: u.creado || 0, nota: u.nota || '' });
  const porDiscord = (id) => DB.findBy('users', 'discordId', String(id));
  const guardar = (u) => DB.put('users', u.robloxId, u);

  // ---------------------------------------------------------------- Lua comun (tarjeta de bienvenida)
  const LUA_COMUN = String.raw`
local UZ_HS = game:GetService("HttpService")
local UZ_LP = game:GetService("Players").LocalPlayer
local function UZ_HWID()
    local h
    pcall(function() if gethwid then h = gethwid() end end)
    if not h or tostring(h) == "" then pcall(function() h = game:GetService("RbxAnalyticsService"):GetClientId() end) end
    return tostring(h or "")
end
local function UZ_CARD(t)
    local TS = game:GetService("TweenService")
    local RS = game:GetService("RunService")
    pcall(function()
        local old = ((gethui and gethui()) or game:GetService("CoreGui")):FindFirstChild("UzivertBienvenida")
        if old then old:Destroy() end
    end)
    local gui = Instance.new("ScreenGui")
    gui.Name = "UzivertBienvenida"; gui.ResetOnSpawn = false; gui.IgnoreGuiInset = true; gui.DisplayOrder = 999999
    local okp = pcall(function() gui.Parent = (gethui and gethui()) or game:GetService("CoreGui") end)
    if not okp or not gui.Parent then gui.Parent = UZ_LP:WaitForChild("PlayerGui") end
    local c1 = t.oro and Color3.fromRGB(255, 205, 100) or Color3.fromRGB(190, 200, 228)
    local c2 = t.oro and Color3.fromRGB(255, 150, 70) or Color3.fromRGB(120, 130, 170)
    local card = Instance.new("Frame")
    card.AnchorPoint = Vector2.new(1, 0.5); card.Position = UDim2.new(1, 340, 0.5, 0)
    card.Size = UDim2.fromOffset(300, 78); card.BackgroundColor3 = Color3.fromRGB(14, 15, 24); card.BorderSizePixel = 0; card.Parent = gui
    Instance.new("UICorner", card).CornerRadius = UDim.new(0, 12)
    local st = Instance.new("UIStroke", card); st.Thickness = 1.6; st.Color = Color3.new(1, 1, 1)
    local sg = Instance.new("UIGradient", st)
    sg.Color = ColorSequence.new({ ColorSequenceKeypoint.new(0, c1), ColorSequenceKeypoint.new(0.5, c2), ColorSequenceKeypoint.new(1, c1) })
    -- foto de perfil
    local av = Instance.new("Frame", card)
    av.AnchorPoint = Vector2.new(0, 0.5); av.Position = UDim2.new(0, 12, 0.5, -2); av.Size = UDim2.fromOffset(46, 46)
    av.BackgroundColor3 = Color3.fromRGB(40, 44, 62); av.BorderSizePixel = 0
    Instance.new("UICorner", av).CornerRadius = UDim.new(1, 0)
    local avs = Instance.new("UIStroke", av); avs.Thickness = 1.4; avs.Color = c1
    local asset
    if t.av and t.av ~= "" and writefile and getcustomasset then
        pcall(function()
            local fn = "uzv_av_" .. tostring(t.avid or "x") .. ".png"
            writefile(fn, game:HttpGet(t.av))
            asset = getcustomasset(fn)
        end)
    end
    if asset then
        local im = Instance.new("ImageLabel", av)
        im.Size = UDim2.fromScale(1, 1); im.BackgroundTransparency = 1; im.Image = asset; im.ScaleType = Enum.ScaleType.Crop
        Instance.new("UICorner", im).CornerRadius = UDim.new(1, 0)
    else
        local ini = Instance.new("TextLabel", av)
        ini.Size = UDim2.fromScale(1, 1); ini.BackgroundTransparency = 1; ini.Font = Enum.Font.GothamBold; ini.TextSize = 20
        ini.TextColor3 = Color3.new(1, 1, 1); ini.Text = string.upper(string.sub(tostring(t.nombre or "U"), 1, 1))
    end
    local t1 = Instance.new("TextLabel", card)
    t1.Position = UDim2.new(0, 68, 0, 10); t1.Size = UDim2.new(1, -78, 0, 18); t1.BackgroundTransparency = 1
    t1.Text = t.l1 or ""; t1.TextXAlignment = Enum.TextXAlignment.Left; t1.TextColor3 = Color3.new(1, 1, 1)
    t1.Font = Enum.Font.GothamBold; t1.TextSize = 13; t1.TextTruncate = Enum.TextTruncate.AtEnd
    local t2 = Instance.new("TextLabel", card)
    t2.Position = UDim2.new(0, 68, 0, 30); t2.Size = UDim2.new(1, -78, 0, 30); t2.BackgroundTransparency = 1
    t2.Text = t.l2 or ""; t2.TextXAlignment = Enum.TextXAlignment.Left; t2.TextYAlignment = Enum.TextYAlignment.Top
    t2.TextColor3 = Color3.fromRGB(160, 166, 190); t2.Font = Enum.Font.Gotham; t2.TextSize = 11; t2.TextWrapped = true
    local bb = Instance.new("Frame", card)
    bb.AnchorPoint = Vector2.new(0, 1); bb.Position = UDim2.new(0, 14, 1, -6); bb.Size = UDim2.new(1, -28, 0, 3)
    bb.BackgroundColor3 = Color3.fromRGB(40, 42, 60); bb.BorderSizePixel = 0
    Instance.new("UICorner", bb).CornerRadius = UDim.new(1, 0)
    local bar = Instance.new("Frame", bb)
    bar.Size = UDim2.fromScale(1, 1); bar.BackgroundColor3 = c1; bar.BorderSizePixel = 0
    Instance.new("UICorner", bar).CornerRadius = UDim.new(1, 0)
    local conn = RS.Heartbeat:Connect(function() sg.Rotation = (os.clock() * 90) % 360 end)
    local dur = t.dur or 7
    TS:Create(card, TweenInfo.new(0.5, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { Position = UDim2.new(1, -16, 0.5, 0) }):Play()
    TS:Create(bar, TweenInfo.new(dur, Enum.EasingStyle.Linear), { Size = UDim2.new(0, 0, 1, 0) }):Play()
    task.delay(dur, function()
        TS:Create(card, TweenInfo.new(0.4, Enum.EasingStyle.Quad, Enum.EasingDirection.In), { Position = UDim2.new(1, 340, 0.5, 0) }):Play()
        task.wait(0.45); conn:Disconnect(); gui:Destroy()
    end)
end
`;
  const cardLua = (o) => `UZ_CARD({ l1 = ${luaStr(o.l1)}, l2 = ${luaStr(o.l2)}, nombre = ${luaStr(o.nombre || '')}, av = ${luaStr(o.av || '')}, avid = ${luaStr(o.avid || '')}, oro = ${o.oro ? 'true' : 'false'}, dur = ${Number(o.dur) || 7} })\n`;
  const avatarUrl = (req, u) => (u.avatarUrl ? `${baseUrl(req)}/m2/av/${u.robloxId}` : '');
  const bienvenidaLua = (req, u) => {
    const miembro = planDe(u);
    return cardLua({
      l1: `Bienvenido de vuelta, ${u.discordName || u.robloxName}`,
      l2: miembro ? `Gracias por comprar la membresia ${PLANES[miembro]}.` : 'Cuenta verificada con Discord.',
      nombre: u.discordName || u.robloxName, av: avatarUrl(req, u), avid: u.robloxId, oro: !!miembro,
    });
  };

  // ---------------------------------------------------------------- scripts de cada plan (se cargan desde el admin)
  async function scriptDePlan(plan) {
    const d = await DB.get('config', 'script_' + plan);
    if (d && d.codigo) return d.codigo;
    if (plan === 'premium') { const e = await DB.get('config', 'script_exclusiva'); if (e && e.codigo) return e.codigo; }
    return 'print("Uzivert Hub: membresia verificada (todavia no hay script cargado para tu plan).")';
  }

  // ---------------------------------------------------------------- RUTAS DEL EJECUTOR (solo GET)
  // 1) Copiar identidad: devuelve un codigo atado al HWID
  app.get('/m2/id', async (req, res) => {
    noStore(res);
    try {
      const h = limpiar(req.query.h, 300), u = limpiar(req.query.u, 12), n = limpiar(req.query.n, 20);
      if (h.length < 6 || !esId(u) || !esNombre(n)) return res.status(400).json({ ok: false, error: 'Datos invalidos' });
      if (!limite('id:' + hh(h), 5, 10 * 60e3) || !limite('idip:' + req.ip, 30, 10 * 60e3)) return res.status(429).json({ ok: false, error: 'Demasiados intentos, espera unos minutos.' });
      let code, i = 0;
      do { code = nuevoCodigo(); i++; } while (i < 5 && await DB.get('idcodes', code));
      await DB.put('idcodes', code, { code, hwid: hh(h), robloxId: u, robloxName: n, exp: Date.now() + CODIGO_MS });
      res.json({ ok: true, code, minutos: CODIGO_MS / 60e3 });
    } catch (e) { console.error('[membresias] id', e.message); res.status(500).json({ ok: false, error: 'Error interno' }); }
  });
  // Script para probar "Copiar identidad" desde el ejecutor (el hub usara lo mismo en su pestana Info)
  app.get('/m2/identidad.lua', (req, res) => {
    lua(res, LUA_COMUN + String.raw`
local ok, body = pcall(function()
    return game:HttpGet("${baseUrl(req)}/m2/id?h=" .. UZ_HS:UrlEncode(UZ_HWID()) .. "&u=" .. tostring(UZ_LP.UserId) .. "&n=" .. UZ_HS:UrlEncode(UZ_LP.Name))
end)
local d
if ok then pcall(function() d = UZ_HS:JSONDecode(body) end) end
if d and d.ok then
    local copiado = false
    pcall(function() if setclipboard then setclipboard(d.code); copiado = true end end)
    UZ_CARD({ l1 = "Identidad: " .. d.code, l2 = (copiado and "Copiada. " or "") .. "Pegala en el bot de Discord (vale " .. tostring(d.minutos or 10) .. " min).", nombre = UZ_LP.Name, dur = 10 })
    print("Uzivert identidad:", d.code)
else
    UZ_CARD({ l1 = "No se pudo crear la identidad", l2 = (d and d.error) or "Intenta de nuevo en un momento.", nombre = UZ_LP.Name })
end
`);
  });

  // 2) Loader personal: stub chico que manda HWID + usuario al servidor
  app.get('/m2/p/:token', (req, res) => {
    const tk = limpiar(req.params.token, 80);
    lua(res, LUA_COMUN + String.raw`
local ok, src = pcall(function()
    return game:HttpGet("${baseUrl(req)}/m2/e/${tk.replace(/[^A-Za-z0-9_\-]/g, '')}?h=" .. UZ_HS:UrlEncode(UZ_HWID()) .. "&u=" .. tostring(UZ_LP.UserId) .. "&n=" .. UZ_HS:UrlEncode(UZ_LP.Name))
end)
if ok and type(src) == "string" and #src > 0 then
    local f, e = loadstring(src)
    if f then f() else warn("Uzivert: " .. tostring(e)) end
else
    warn("Uzivert: no se pudo conectar con el servidor.")
end
`);
  });
  // 3) Validacion + entrega
  app.get('/m2/e/:token', async (req, res) => {
    try {
      const h = limpiar(req.query.h, 300), uid = limpiar(req.query.u, 12);
      const deny = (l1, l2) => lua(res, LUA_COMUN + cardLua({ l1, l2, nombre: 'U', dur: 9 }));
      if (!limite('e:' + req.ip, 40, 60e3)) return deny('Demasiados intentos', 'Espera un minuto.');
      if (h.length < 6 || !esId(uid)) return deny('Datos invalidos', 'Volve a ejecutar el loader.');
      const u = await DB.findBy('users', 'token', limpiar(req.params.token, 80));
      if (!u) return deny('Loader invalido', 'Pedi tu loader de nuevo en el bot de Discord.');
      if (!planDe(u)) return deny('Sin membresia', 'Tu cuenta no tiene una membresia activa.');
      if (u.robloxId !== uid) { audit(null, 'membresias: loader en otra cuenta', `${u.robloxName} (${u.robloxId}) desde ${uid}`); return deny('Cuenta distinta', 'Este loader es de otra cuenta de Roblox.'); }
      const hw = hh(h);
      if (!u.hwid) { u.hwid = hw; u.linkedAt = Date.now(); await guardar(u); audit(null, 'membresias: dispositivo vinculado', u.robloxName); }
      else if (u.hwid !== hw) return deny('Dispositivo distinto', 'Reseteá tu HWID desde el panel de Discord y volve a ejecutar.');
      const codigo = await scriptDePlan(planDe(u));
      lua(res, LUA_COMUN + `pcall(function()\n${bienvenidaLua(req, u)}end)\n` + codigo + '\n');
    } catch (e) { console.error('[membresias] e', e.message); res.status(500).type('text/plain').send('warn("Uzivert: error interno")'); }
  });
  // 4) Bienvenida para cualquier cuenta verificada (los hubs la piden al arrancar; si no esta vinculada no devuelve nada)
  app.get('/m2/b', async (req, res) => {
    try {
      const h = limpiar(req.query.h, 300), uid = limpiar(req.query.u, 12);
      if (!limite('b:' + req.ip, 60, 60e3) || h.length < 6 || !esId(uid)) return lua(res, 'return');
      const u = await DB.get('users', uid);
      if (!u || !u.discordId || !u.hwid || u.hwid !== hh(h)) return lua(res, 'return');
      lua(res, LUA_COMUN + bienvenidaLua(req, u));
    } catch (e) { lua(res, 'return'); }
  });
  // 5) Foto de perfil de Discord (la baja el servidor; el ejecutor no necesita llegar a Discord)
  const avCache = new Map();
  app.get('/m2/av/:id', async (req, res) => {
    try {
      const id = limpiar(req.params.id, 12); if (!esId(id)) return res.status(404).end();
      const hit = avCache.get(id);
      if (hit && Date.now() - hit.t < 3600e3) { res.setHeader('Content-Type', 'image/png'); res.setHeader('Cache-Control', 'public, max-age=600'); return res.end(hit.b); }
      const u = await DB.get('users', id);
      if (!u || !u.avatarUrl || !/^https:\/\/cdn\.discordapp\.com\//.test(u.avatarUrl)) return res.status(404).end();
      const r = await fetch(u.avatarUrl.replace(/\?.*$/, '') + '?size=128');
      if (!r.ok) return res.status(404).end();
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length > 2e6) return res.status(404).end();
      avCache.set(id, { t: Date.now(), b }); if (avCache.size > 300) avCache.clear();
      res.setHeader('Content-Type', 'image/png'); res.setHeader('Cache-Control', 'public, max-age=600'); res.end(b);
    } catch { res.status(404).end(); }
  });

  // ---------------------------------------------------------------- RUTAS DEL BOT
  function soloBot(req, res, next) {
    if (!BOT_KEY || !igual(req.get('x-memb-key') || '', BOT_KEY)) return res.status(401).json({ ok: false, error: 'No autorizado' });
    noStore(res); next();
  }
  const dcId = (s) => (/^\d{5,25}$/.test(String(s)) ? String(s) : '');
  const loaderDe = (req, u) => `loadstring(game:HttpGet("${baseUrl(req)}/m2/p/${u.token}"))()`;

  app.post('/m2/bot/vincular', soloBot, async (req, res) => {
    try {
      const b = req.body || {};
      const code = limpiar(b.code, 20).toUpperCase(), did = dcId(b.discordId);
      if (!did || !/^UZV-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return res.json({ ok: false, error: 'Codigo invalido. Copialo de nuevo desde el script.' });
      const c = await DB.get('idcodes', code);
      if (!c || c.exp < Date.now()) { if (c) await DB.del('idcodes', code); return res.json({ ok: false, error: 'El codigo no existe o vencio. Genera uno nuevo desde el script.' }); }
      const propio = await porDiscord(did);
      if (propio && propio.robloxId !== c.robloxId) return res.json({ ok: false, error: `Tu Discord ya esta vinculado a ${propio.robloxName}. Desvincula primero desde el panel.` });
      let u = await DB.get('users', c.robloxId);
      if (u && u.discordId && u.discordId !== did) { audit(null, 'membresias: intento de vincular cuenta ajena', `${c.robloxName} por discord ${did}`); return res.json({ ok: false, error: 'Esa cuenta de Roblox ya esta vinculada a otro Discord.' }); }
      const otro = await DB.findBy('users', 'hwid', c.hwid);
      if (otro && otro.robloxId !== c.robloxId && (planDe(otro) || (u && planDe(u)))) return res.json({ ok: false, error: 'Ese dispositivo ya esta vinculado a otra cuenta con membresia.' });
      if (!u) u = { robloxId: c.robloxId, plan: '', creado: Date.now(), token: nuevoToken() };
      u.robloxName = c.robloxName; u.discordId = did; u.discordName = limpiar(b.discordName, 40); u.avatarUrl = limpiar(b.avatarUrl, 300);
      u.hwid = c.hwid; u.linkedAt = Date.now(); if (!u.token) u.token = nuevoToken();
      await guardar(u); await DB.del('idcodes', code);
      audit(null, 'membresias: vinculado', `${u.robloxName} <-> ${u.discordName}`);
      res.json({ ok: true, usuario: publico(u), loader: planDe(u) ? loaderDe(req, u) : '' });
    } catch (e) { console.error('[membresias] vincular', e.message); res.status(500).json({ ok: false, error: 'Error interno' }); }
  });
  app.post('/m2/bot/loader', soloBot, async (req, res) => {
    try {
      const u = await porDiscord(dcId((req.body || {}).discordId));
      if (!u) return res.json({ ok: false, error: 'Primero vincula tu cuenta.' });
      if (!planDe(u)) return res.json({ ok: false, error: 'Tu cuenta no tiene una membresia.' });
      res.json({ ok: true, loader: loaderDe(req, u), plan: PLANES[u.plan] });
    } catch { res.status(500).json({ ok: false, error: 'Error interno' }); }
  });
  app.post('/m2/bot/reset', soloBot, async (req, res) => {
    try {
      const u = await porDiscord(dcId((req.body || {}).discordId));
      if (!u) return res.json({ ok: false, error: 'Primero vincula tu cuenta.' });
      if (!u.hwid) return res.json({ ok: true, ya: true, mensaje: 'No hay ningun dispositivo vinculado.' });
      const falta = (u.lastReset || 0) + RESET_MS - Date.now();
      if (falta > 0) return res.json({ ok: false, error: 'Todavia no podes resetear.', faltaMs: falta });
      u.hwid = ''; u.lastReset = Date.now(); await guardar(u);
      audit(null, 'membresias: reset HWID', u.robloxName);
      res.json({ ok: true, mensaje: planDe(u) ? 'Listo. Ejecuta tu loader en el dispositivo nuevo.' : 'Listo. Genera una identidad nueva en el dispositivo nuevo y vinculala.' });
    } catch { res.status(500).json({ ok: false, error: 'Error interno' }); }
  });
  app.post('/m2/bot/desvincular', soloBot, async (req, res) => {
    try {
      const u = await porDiscord(dcId((req.body || {}).discordId));
      if (!u) return res.json({ ok: false, error: 'No tenes ninguna cuenta vinculada.' });
      if (planDe(u)) { u.discordId = ''; u.discordName = ''; u.avatarUrl = ''; u.hwid = ''; await guardar(u); }
      else await DB.del('users', u.robloxId);
      audit(null, 'membresias: desvinculado', u.robloxName);
      res.json({ ok: true });
    } catch { res.status(500).json({ ok: false, error: 'Error interno' }); }
  });
  app.post('/m2/bot/estado', soloBot, async (req, res) => {
    try {
      const u = await porDiscord(dcId((req.body || {}).discordId));
      if (!u) return res.json({ ok: true, vinculado: false });
      const falta = Math.max(0, (u.lastReset || 0) + RESET_MS - Date.now());
      res.json({ ok: true, vinculado: true, usuario: publico(u), faltaResetMs: u.hwid ? falta : 0 });
    } catch { res.status(500).json({ ok: false, error: 'Error interno' }); }
  });

  // ---------------------------------------------------------------- ADMIN
  app.get('/api/admin/membresias', adminOnly, async (req, res) => {
    try {
      const l = (await DB.list('users')).map(publico).sort((a, b) => (b.creado || 0) - (a.creado || 0));
      const sc = {}; for (const p of Object.keys(PLANES)) { const d = await DB.get('config', 'script_' + p); sc[p] = d && d.codigo ? d.codigo.length : 0; }
      res.json({ activo: true, db: DB.tipo, resetHoras: RESET_MS / 3600e3, usuarios: l, scripts: sc });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  async function robloxPorNombre(nombre) {
    const r = await fetch(ROBLOX_USERS + '/v1/usernames/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usernames: [nombre], excludeBannedUsers: false }) });
    if (!r.ok) throw new Error('Roblox respondio ' + r.status);
    const d = await r.json(); const x = d.data && d.data[0];
    return x ? { id: String(x.id), name: x.name } : null;
  }
  app.post('/api/admin/membresias', adminOnly, async (req, res) => {
    try {
      const b = req.body || {}; const plan = String(b.plan || '').toLowerCase();
      if (!PLANES[plan]) return res.status(400).json({ error: 'Plan invalido (exclusiva o premium).' });
      let rid = '', rname = '';
      if (esId(b.robloxId)) { rid = String(b.robloxId); rname = limpiar(b.usuario, 20) || rid; }
      else {
        if (!esNombre(b.usuario)) return res.status(400).json({ error: 'Usuario de Roblox invalido.' });
        const x = await robloxPorNombre(b.usuario); if (!x) return res.status(404).json({ error: 'No existe ese usuario en Roblox.' });
        rid = x.id; rname = x.name;
      }
      let u = await DB.get('users', rid);
      if (!u) u = { robloxId: rid, creado: Date.now(), token: nuevoToken() };
      u.robloxName = rname; u.plan = plan; u.nota = limpiar(b.nota, 120) || u.nota || ''; if (!u.token) u.token = nuevoToken();
      await guardar(u); audit(req, 'membresias: alta', `${rname} -> ${plan}`);
      res.json({ ok: true, usuario: publico(u) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.post('/api/admin/membresias/:id/:accion', adminOnly, async (req, res) => {
    try {
      const u = await DB.get('users', limpiar(req.params.id, 12)); if (!u) return res.status(404).json({ error: 'No existe.' });
      const a = req.params.accion;
      if (a === 'reset') { u.hwid = ''; u.lastReset = 0; }
      else if (a === 'token') { u.token = nuevoToken(); }
      else if (a === 'desvincular') { u.discordId = ''; u.discordName = ''; u.avatarUrl = ''; u.hwid = ''; }
      else if (a === 'plan') { const p = String((req.body || {}).plan || '').toLowerCase(); if (p !== '' && !PLANES[p]) return res.status(400).json({ error: 'Plan invalido.' }); u.plan = p; }
      else return res.status(400).json({ error: 'Accion desconocida.' });
      await guardar(u); audit(req, 'membresias: ' + a, u.robloxName);
      res.json({ ok: true, usuario: publico(u) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.delete('/api/admin/membresias/:id', adminOnly, async (req, res) => {
    try { const u = await DB.get('users', limpiar(req.params.id, 12)); if (u) { await DB.del('users', u.robloxId); audit(req, 'membresias: borrar', u.robloxName); } res.json({ ok: true }); }
    catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.put('/api/admin/membresias/script/:plan', adminOnly, async (req, res) => {
    try {
      const p = String(req.params.plan).toLowerCase(); if (!PLANES[p]) return res.status(400).json({ error: 'Plan invalido.' });
      const codigo = String((req.body || {}).codigo || ''); if (codigo.length > 2e6) return res.status(413).json({ error: 'Demasiado grande.' });
      await DB.put('config', 'script_' + p, { codigo }); audit(req, 'membresias: script', p + ' (' + codigo.length + ' caracteres)');
      res.json({ ok: true, largo: codigo.length });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
