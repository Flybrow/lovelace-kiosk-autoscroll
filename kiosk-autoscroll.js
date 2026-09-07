(function () {
  "use strict";

  const DEFAULTS = {
    mode: "speed",
    axis: "vertical",
    speed: 1,
    duration: 60,
    interval: 30,
    pause: 4000,
    pauseOnInteraction: 8000,
    easing: true,
    hideScrollbar: false,
    language: "auto",
    rotateViews: false,
    entity: null,
    activeHours: null,
    users: null,
    enabled: true
  };

  // --- Traductions ---------------------------------------------------------
  // L'anglais est la langue de repli. La langue affichee suit celle de Home
  // Assistant (hass.locale.language), sauf si l'option `language` la force.
  const STRINGS = {
    en: {
      cardName: "Kiosk Auto Scroll",
      cardDescription: "Invisible card: enables automatic scrolling (kiosk mode) on this dashboard.",
      cardDesc: "Invisible card: enables automatic scrolling (kiosk mode) on this dashboard. Hidden outside edit mode.",
      statMode: "Mode ",
      statAxis: " • axis ",
      statRotate: " • rotation ",
      statUsers: " • user(s) ",
      modeSpeedShort: "constant speed",
      modeDurationShort: "fixed duration",
      axisVerticalShort: "vertical",
      axisHorizontalShort: "horizontal",
      yes: "yes",
      no: "no",
      allUsers: "everyone",
      warnMultiple: "⚠ Several Kiosk cards on this page: only one is used. Keep just one.",
      advanced: "Advanced settings (optional)",
      hoursError: "⚠ Invalid format. Expected HH:MM-HH:MM (e.g. 08:00-20:00).",
      optSpeed: "Constant speed",
      optDuration: "Constant duration (travel in X s)",
      optVertical: "Vertical (up/down)",
      optHorizontal: "Horizontal (left/right)",
      optLangAuto: "Automatic (Home Assistant language)",
      optLangEn: "English",
      optLangFr: "Français",
      labels: {
        mode: "Scrolling mode",
        axis: "Scrolling direction",
        speed: "Speed",
        duration: "Duration of one pass",
        easing: "Slow down gently at the ends",
        hideScrollbar: "Hide the scrollbar",
        pause: "Pause at the ends",
        pauseOnInteraction: "Pause after an interaction",
        rotateViews: "Scroll through the whole dashboard",
        entity: "Only run if an entity is on",
        activeHours: "Active time range",
        users: "Restrict to certain users",
        language: "Language"
      },
      helpers: {
        mode: "“Constant speed”: a fixed speed. “Constant duration”: the view is travelled in a chosen time, whatever its length.",
        axis: "Vertical (top to bottom) or horizontal (column views, wide panels).",
        speed: "The higher the value, the faster (e.g. 0.25 = very slow, 1 = normal, 3 = fast).",
        duration: "Time, in seconds, to travel the whole view from end to end.",
        easing: "Scrolling slows down near the ends (speed mode only).",
        hideScrollbar: "Hides the scrollbar for a full-screen look. Touch and wheel scrolling still work. Restored in edit mode.",
        pause: "Dwell time at each end, in milliseconds (4000 = 4 s).",
        pauseOnInteraction: "After a touch, click or wheel, delay before resuming (in ms).",
        rotateViews: "At the bottom, move to the next view. Scrolling then covers the whole dashboard; a card placed on another page takes priority there.",
        entity: "Scrolling only happens if this entity is on / home / open (e.g. an input_boolean).",
        activeHours: "Limits scrolling to a time range, e.g. 08:00-20:00 (overnight ranges supported).",
        users: "Choose who is allowed. Empty = everyone.",
        language: "Language of this card and its editor. Automatic follows the Home Assistant language."
      }
    },
    fr: {
      cardName: "Kiosk Auto Scroll",
      cardDescription: "Carte invisible : active le defilement automatique (mode kiosque) sur ce tableau de bord.",
      cardDesc: "Carte invisible : active le défilement automatique (mode kiosque) sur ce tableau de bord. Invisible hors édition.",
      statMode: "Mode ",
      statAxis: " • axe ",
      statRotate: " • rotation ",
      statUsers: " • utilisateur(s) ",
      modeSpeedShort: "vitesse fixe",
      modeDurationShort: "durée fixe",
      axisVerticalShort: "vertical",
      axisHorizontalShort: "horizontal",
      yes: "oui",
      no: "non",
      allUsers: "tous",
      warnMultiple: "⚠ Plusieurs cartes Kiosk sur cette page : une seule est utilisée. N'en gardez qu'une.",
      advanced: "Réglages avancés (optionnel)",
      hoursError: "⚠ Format invalide. Attendu HH:MM-HH:MM (ex. 08:00-20:00).",
      optSpeed: "Vitesse constante",
      optDuration: "Durée constante (parcours en X s)",
      optVertical: "Vertical (haut/bas)",
      optHorizontal: "Horizontal (gauche/droite)",
      optLangAuto: "Automatique (langue de Home Assistant)",
      optLangEn: "English",
      optLangFr: "Français",
      labels: {
        mode: "Mode de défilement",
        axis: "Sens du défilement",
        speed: "Vitesse",
        duration: "Durée d'un aller",
        easing: "Ralentir en douceur aux extrémités",
        hideScrollbar: "Masquer la barre de défilement",
        pause: "Pause aux extrémités",
        pauseOnInteraction: "Pause après une interaction",
        rotateViews: "Faire défiler tout le tableau de bord",
        entity: "Activer seulement si une entité est allumée",
        activeHours: "Plage horaire d'activité",
        users: "Limiter à certains utilisateurs",
        language: "Langue"
      },
      helpers: {
        mode: "« Vitesse constante » : une vitesse fixe. « Durée constante » : la vue est parcourue dans un temps choisi, quelle que soit sa longueur.",
        axis: "Vertical (de haut en bas) ou horizontal (vues en colonnes, panneaux larges).",
        speed: "Plus la valeur est grande, plus c'est rapide (ex. 0.25 = très lent, 1 = normal, 3 = rapide).",
        duration: "Temps, en secondes, pour parcourir toute la vue d'un bout à l'autre.",
        easing: "Le défilement ralentit en approchant des extrémités (mode vitesse uniquement).",
        hideScrollbar: "Cache la barre de défilement pour un rendu plein écran. Le défilement au doigt ou à la molette reste possible. Réaffichée en mode édition.",
        pause: "Temps d'arrêt à chaque extrémité, en millisecondes (4000 = 4 s).",
        pauseOnInteraction: "Après un toucher, un clic ou la molette, délai avant reprise (en ms).",
        rotateViews: "En bas, passe à la vue suivante. Le défilement couvre alors tout le tableau de bord ; une carte posée sur une autre page reste prioritaire sur cette page.",
        entity: "Le défilement n'a lieu que si cette entité est on / home / open (ex. un input_boolean).",
        activeHours: "Limite le défilement à une tranche horaire, ex. 08:00-20:00 (gère aussi la nuit).",
        users: "Choisissez les personnes autorisées. Vide = tout le monde.",
        language: "Langue de cette carte et de son éditeur. Automatique suit la langue de Home Assistant."
      }
    }
  };

  const FALLBACK_LANG = "en";

  function normalizeLang(v) {
    if (!v) return null;
    const code = String(v).toLowerCase().split("-")[0];
    return STRINGS[code] ? code : null;
  }

  // Langue effective : option `language` > langue de Home Assistant > anglais.
  function resolveLang(cfg, hass) {
    const forced = (cfg && cfg.language && cfg.language !== "auto")
      ? normalizeLang(cfg.language)
      : null;
    if (forced) return forced;
    let haLang = null;
    if (hass) haLang = (hass.locale && hass.locale.language) || hass.language || null;
    return normalizeLang(haLang) || FALLBACK_LANG;
  }

  function t(lang, key) {
    const dict = STRINGS[lang] || STRINGS[FALLBACK_LANG];
    if (dict[key] !== undefined) return dict[key];
    const fb = STRINGS[FALLBACK_LANG][key];
    return fb !== undefined ? fb : key;
  }

  function tSub(lang, group, key) {
    const dict = STRINGS[lang] || STRINGS[FALLBACK_LANG];
    const g = dict[group] || {};
    if (g[key] !== undefined) return g[key];
    const fb = STRINGS[FALLBACK_LANG][group] || {};
    return fb[key] !== undefined ? fb[key] : key;
  }

  const EASE_ZONE = 120;
  const MIN_EASE = 0.2;

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function toList(v) {
    if (v === null || v === undefined || v === "") return null;
    if (Array.isArray(v)) return v.map(String);
    return String(v).split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function parseHM(s) {
    const p = String(s).trim().split(":");
    if (p.length < 2) return null;
    const h = parseInt(p[0], 10);
    const m = parseInt(p[1], 10);
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
  }

  function validHours(spec) {
    const parts = String(spec).split("-");
    if (parts.length !== 2) return false;
    return parseHM(parts[0]) !== null && parseHM(parts[1]) !== null;
  }

  function withinHours(spec) {
    if (!spec) return true;
    if (!validHours(spec)) return true;
    const parts = String(spec).split("-");
    const a = parseHM(parts[0]);
    const b = parseHM(parts[1]);
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    if (a <= b) return cur >= a && cur < b;
    return cur >= a || cur < b;
  }

  // Une vue est-elle eligible a la rotation ? (sous-vues et vues masquees exclues)
  function viewEligible(view, hass) {
    if (!view || view.subview === true) return false;
    const vis = view.visible;
    if (vis === undefined || vis === null) return true;
    if (vis === false) return false;
    if (vis === true) return true;
    if (Array.isArray(vis)) {
      const uid = hass && hass.user ? hass.user.id : null;
      if (!uid) return false;
      for (let i = 0; i < vis.length; i++) {
        const v = vis[i];
        if (v && v.user === uid) return true;
      }
      return false;
    }
    return true;
  }

  function entityActive(hass, entity) {
    if (!entity) return true;
    if (!hass || !hass.states || !hass.states[entity]) return true;
    const st = hass.states[entity].state;
    return st === "on" || st === "home" || st === "open" || st === "true";
  }

  function userAllowed(cfg, hass) {
    const filter = toList(cfg.users);
    if (!filter) return true;
    const u = hass && hass.user;
    if (!u) return false;
    for (let i = 0; i < filter.length; i++) {
      const f = filter[i];
      if (f === u.name || f === u.id) return true;
      if (f.indexOf("person.") === 0 && hass.states && hass.states[f]) {
        const attrs = hass.states[f].attributes || {};
        if (attrs.user_id && attrs.user_id === u.id) return true;
      }
    }
    return false;
  }

  function isHorizontal(cfg) {
    return cfg.axis === "horizontal";
  }
  function getMax(el, horiz) {
    return horiz ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
  }
  function getPos(el, horiz) {
    return horiz ? el.scrollLeft : el.scrollTop;
  }
  function setPos(el, horiz, v) {
    if (horiz) el.scrollLeft = v;
    else el.scrollTop = v;
  }

  function findScroller(horiz) {
    let best = null;
    let bestClient = -1;
    const queue = [document.body];
    let guard = 0;
    while (queue.length && guard < 20000) {
      guard++;
      const el = queue.shift();
      if (!el) continue;
      try {
        const range = horiz ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
        const client = horiz ? el.clientWidth : el.clientHeight;
        if (range > 50) {
          const st = getComputedStyle(el);
          const ov = horiz ? st.overflowX : st.overflowY;
          if (ov === "auto" || ov === "scroll" || ov === "overlay") {
            if (client > bestClient) {
              best = el;
              bestClient = client;
            }
          }
        }
      } catch (e) {}
      if (el.shadowRoot) queue.push.apply(queue, el.shadowRoot.children);
      if (el.children) queue.push.apply(queue, el.children);
    }
    return best || document.scrollingElement || document.documentElement;
  }

  // --- Masquage de la barre de defilement ---------------------------------
  // Firefox/Edge acceptent des styles inline ; WebKit exige une regle
  // ::-webkit-scrollbar, qu'il faut injecter dans le root du scroller
  // (shadow root ou document) car une feuille globale n'y entre pas.
  const SB_ATTR = "data-kiosk-noscrollbar";
  const SB_RULE =
    "[" + SB_ATTR + "]::-webkit-scrollbar{display:none!important;" +
    "width:0!important;height:0!important}";
  const styledRoots = new WeakSet();
  let sbEl = null;
  let sbPrev = null;

  function injectScrollbarStyle(root) {
    if (!root || styledRoots.has(root)) return;
    try {
      const target = root.nodeType === 9 ? root.head : root;
      if (!target || !target.appendChild) return;
      const st = document.createElement("style");
      st.setAttribute("data-kiosk-autoscroll", "");
      st.textContent = SB_RULE;
      target.appendChild(st);
      styledRoots.add(root);
    } catch (e) {}
  }

  function releaseScrollbar() {
    if (!sbEl) return;
    try {
      sbEl.removeAttribute(SB_ATTR);
      sbEl.style.scrollbarWidth = sbPrev ? sbPrev.sw : "";
      sbEl.style.msOverflowStyle = sbPrev ? sbPrev.ms : "";
    } catch (e) {}
    sbEl = null;
    sbPrev = null;
  }

  function hideScrollbarOn(el) {
    if (!el) { releaseScrollbar(); return; }
    if (sbEl === el && el.isConnected) return;
    releaseScrollbar();
    try {
      sbPrev = { sw: el.style.scrollbarWidth, ms: el.style.msOverflowStyle };
      el.style.scrollbarWidth = "none";
      el.style.msOverflowStyle = "none";
      el.setAttribute(SB_ATTR, "");
      injectScrollbarStyle(el.getRootNode ? el.getRootNode() : document);
      sbEl = el;
    } catch (e) {
      sbEl = null;
      sbPrev = null;
    }
  }

  let cachedScroller = null;
  let cachedKey = null;
  function getScroller(horiz) {
    const key = location.pathname + "|" + (horiz ? "h" : "v");
    if (cachedScroller && cachedScroller.isConnected && key === cachedKey) {
      return cachedScroller;
    }
    const found = findScroller(horiz);
    const fallback = document.scrollingElement || document.documentElement;
    if (found && found !== fallback) {
      cachedScroller = found;
      cachedKey = key;
    } else {
      cachedScroller = null;
    }
    return found;
  }

  function bfsFind(root, predicate) {
    const queue = [root || document.body];
    let guard = 0;
    while (queue.length && guard < 20000) {
      guard++;
      const el = queue.shift();
      if (!el) continue;
      try {
        if (predicate(el)) return el;
      } catch (e) {}
      if (el.shadowRoot) queue.push.apply(queue, el.shadowRoot.children);
      if (el.children) queue.push.apply(queue, el.children);
    }
    return null;
  }

  let lovelaceHost = null;
  function getLovelace() {
    if (lovelaceHost && lovelaceHost.isConnected && lovelaceHost.lovelace) {
      return lovelaceHost.lovelace;
    }
    lovelaceHost = bfsFind(document.body, function (el) {
      return el.lovelace && typeof el.lovelace.editMode === "boolean";
    });
    return lovelaceHost ? lovelaceHost.lovelace : null;
  }

  function isEditMode() {
    const ll = getLovelace();
    if (ll && typeof ll.editMode === "boolean") return ll.editMode;
    try {
      return new URLSearchParams(location.search).get("edit") === "1";
    } catch (e) {
      return false;
    }
  }

  function currentDashboard() {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts.length ? parts[0] : "";
  }

  function gotoNextView(hass) {
    const ll = getLovelace();
    if (!ll || !ll.config || !Array.isArray(ll.config.views)) return false;
    const parts = location.pathname.split("/").filter(Boolean);
    if (!parts.length) return false;
    const dashboard = parts[0];
    const current = parts.length > 1 ? parts[1] : "";
    const views = ll.config.views;

    // Indices des vues affichables uniquement (pas de sous-vue, pas de vue masquee)
    const pool = [];
    for (let i = 0; i < views.length; i++) {
      if (viewEligible(views[i], hass)) pool.push(i);
    }
    if (pool.length < 2) return false;

    let idx = -1;
    for (let i = 0; i < views.length; i++) {
      const seg = views[i].path != null ? String(views[i].path) : String(i);
      if (seg === current) { idx = i; break; }
    }
    // Position dans le pool ; si la vue courante n'y est pas, on repart du debut
    let p = pool.indexOf(idx);
    if (p < 0) p = -1;
    const next = pool[(p + 1) % pool.length];
    const nv = views[next];
    const seg = nv.path != null ? nv.path : next;
    history.pushState(null, "", "/" + dashboard + "/" + seg);
    window.dispatchEvent(new Event("location-changed"));
    return true;
  }

  let dir = 1;
  let acc = 0;
  let pausedUntil = 0;
  let userActiveUntil = 0;
  let newLeg = true;
  let legEndTs = 0;
  let lastActive = 0;
  let lastPauseOnInteraction = DEFAULTS.pauseOnInteraction;
  let lastTs = 0;

  const activeCards = new Set();
  let globalController = null;

  function resolveEntry() {
    const dash = currentDashboard();
    if (globalController && globalController.dashboard !== dash) globalController = null;

    let local = null;
    let blocked = false;
    activeCards.forEach(function (card) {
      if (!card.isConnected) return;
      if (!card._hass) return; // pas encore initialisee : ni active, ni bloquante
      const c = Object.assign({}, DEFAULTS, card._config || {});
      // Une carte presente mais desactivee (ou interdite a cet utilisateur)
      // doit aussi neutraliser une rotation globale heritee d'une autre vue.
      if (c.enabled === false || !userAllowed(c, card._hass)) { blocked = true; return; }
      if (!local) local = { cfg: c, hass: card._hass };
    });

    if (local) {
      if (local.cfg.rotateViews) {
        globalController = { cfg: local.cfg, hass: local.hass, dashboard: dash };
      }
      return local;
    }
    if (blocked) {
      globalController = null;
      return null;
    }
    if (globalController) {
      return { cfg: globalController.cfg, hass: globalController.hass };
    }
    return null;
  }

  function onInteract() {
    if (!activeCards.size && !globalController) return;
    userActiveUntil = Date.now() + lastPauseOnInteraction;
  }

  ["wheel", "touchstart", "pointerdown", "keydown"].forEach(function (evt) {
    window.addEventListener(evt, onInteract, { passive: true });
  });

  function onNav() {
    releaseScrollbar();
    cachedScroller = null;
    acc = 0;
    dir = 1;
    newLeg = true;
    pausedUntil = 0;
    legEndTs = 0;
    lastActive = 0;
    lastTs = 0;
    userActiveUntil = 0;
  }
  window.addEventListener("location-changed", onNav);
  window.addEventListener("popstate", onNav);

  // Cadence : rAF quand ca defile, minuteur quand c'est inhibe (economie CPU/batterie)
  const IDLE_MS = 1000;
  const PAUSE_POLL_MS = 250;
  let rafId = null;
  let idleId = null;

  function running() {
    return (activeCards.size > 0 || globalController) && !document.hidden;
  }
  function scheduleNext(waitMs) {
    if (waitMs > 0) {
      idleId = setTimeout(function () {
        idleId = null;
        lastTs = 0;
        rafId = requestAnimationFrame(loop);
      }, waitMs);
    } else {
      rafId = requestAnimationFrame(loop);
    }
  }
  function start() {
    if (rafId === null && idleId === null) {
      lastTs = 0;
      rafId = requestAnimationFrame(loop);
    }
  }
  function stop() {
    releaseScrollbar();
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (idleId !== null) {
      clearTimeout(idleId);
      idleId = null;
    }
  }
  function ensureRunning() {
    if (rafId === null && idleId === null && running()) start();
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else ensureRunning();
  });

  function loop(ts) {
    rafId = null;
    if (!activeCards.size && !globalController) { stop(); return; }
    let wait = 0;
    try {
      wait = step(ts) || 0;
    } catch (e) {}
    scheduleNext(wait);
  }

  // Retourne le nombre de ms a attendre avant le prochain passage (0 = frame suivante).
  function step(ts) {
    const entry = resolveEntry();
    if (!entry) { releaseScrollbar(); return IDLE_MS; }
    const cfg = entry.cfg;
    const hass = entry.hass;
    lastPauseOnInteraction = cfg.pauseOnInteraction;

    const now = Date.now();
    const dt = lastTs ? clamp(ts - lastTs, 0, 100) : 16;
    lastTs = ts;

    if (now < pausedUntil) {
      lastActive = 0;
      return Math.min(pausedUntil - now, PAUSE_POLL_MS);
    }
    if (document.hidden) { lastActive = 0; return IDLE_MS; }
    if (isEditMode()) { lastActive = 0; releaseScrollbar(); return IDLE_MS; }
    if (!withinHours(cfg.activeHours)) { lastActive = 0; return IDLE_MS; }
    if (!entityActive(hass, cfg.entity)) { lastActive = 0; return IDLE_MS; }

    if (now < userActiveUntil) {
      lastActive = 0;
      return Math.min(userActiveUntil - now, PAUSE_POLL_MS);
    }

    const horiz = isHorizontal(cfg);
    const scroller = getScroller(horiz);
    if (!scroller) return IDLE_MS;

    if (cfg.hideScrollbar) hideScrollbarOn(scroller);
    else releaseScrollbar();

    const max = getMax(scroller, horiz);
    if (max <= 1) return IDLE_MS;
    const pos = getPos(scroller, horiz);

    const durationMode = cfg.mode === "duration" && cfg.duration > 0;
    let pxMs;
    if (durationMode) {
      if (newLeg || !legEndTs) {
        legEndTs = now + cfg.duration * 1000;
        newLeg = false;
      }
      if (lastActive && now - lastActive > 300) {
        legEndTs += now - lastActive;
      }
      const remaining = dir === 1 ? (max - pos) : pos;
      const timeLeft = Math.max(legEndTs - now, 16);
      pxMs = remaining / timeLeft;
    } else {
      const interval = cfg.interval > 0 ? cfg.interval : DEFAULTS.interval;
      pxMs = cfg.speed / interval;
      if (cfg.easing) {
        const dist = dir === 1 ? (max - pos) : pos;
        pxMs *= clamp(dist / EASE_ZONE, MIN_EASE, 1);
      }
    }
    lastActive = now;

    acc += dir * pxMs * dt;
    const stepPx = acc >= 0 ? Math.floor(acc) : Math.ceil(acc);
    if (stepPx !== 0) {
      setPos(scroller, horiz, pos + stepPx);
      acc -= stepPx;
    }

    const newPos = getPos(scroller, horiz);
    if (dir === 1 && newPos >= max - 1) {
      setPos(scroller, horiz, max);
      acc = 0;
      pausedUntil = now + cfg.pause;
      newLeg = true;
      if (cfg.rotateViews && gotoNextView(hass)) {
        dir = 1;
      } else {
        dir = -1;
      }
    } else if (dir === -1 && newPos <= 0) {
      setPos(scroller, horiz, 0);
      acc = 0;
      pausedUntil = now + cfg.pause;
      newLeg = true;
      dir = 1;
    }
    return 0;
  }

  function inEditorPreview(el) {
    let node = el;
    let guard = 0;
    while (node && guard < 300) {
      guard++;
      const tag = node.localName || "";
      if (tag === "hui-card-preview" || tag.indexOf("edit-card") !== -1) return true;
      if (node.parentNode) node = node.parentNode;
      else if (node.host) node = node.host;
      else break;
    }
    return false;
  }

  function connectedCardCount() {
    let n = 0;
    activeCards.forEach(function (c) { if (c.isConnected) n++; });
    return n;
  }

  function rerenderCards() {
    activeCards.forEach(function (c) {
      if (c.isConnected && typeof c._render === "function") c._render();
    });
  }

  // Valide la config : Lovelace attend une exception pour afficher l'erreur a l'edition.
  function validateConfig(c) {
    if (c === null || typeof c !== "object") {
      throw new Error("Invalid configuration.");
    }
    if (c.mode !== undefined && c.mode !== "speed" && c.mode !== "duration") {
      throw new Error("mode must be 'speed' or 'duration'.");
    }
    if (c.axis !== undefined && c.axis !== "vertical" && c.axis !== "horizontal") {
      throw new Error("axis must be 'vertical' or 'horizontal'.");
    }
    const positive = ["speed", "duration", "interval"];
    for (let i = 0; i < positive.length; i++) {
      const k = positive[i];
      if (c[k] !== undefined && c[k] !== null) {
        const n = Number(c[k]);
        if (isNaN(n) || n <= 0) throw new Error(k + " must be a number greater than zero.");
      }
    }
    const nonNeg = ["pause", "pauseOnInteraction"];
    for (let i = 0; i < nonNeg.length; i++) {
      const k = nonNeg[i];
      if (c[k] !== undefined && c[k] !== null) {
        const n = Number(c[k]);
        if (isNaN(n) || n < 0) throw new Error(k + " must be zero or a positive number.");
      }
    }
    if (c.activeHours && !validHours(c.activeHours)) {
      throw new Error("activeHours must use the HH:MM-HH:MM format (e.g. 08:00-20:00).");
    }
    const bools = ["easing", "hideScrollbar", "rotateViews", "enabled"];
    for (let i = 0; i < bools.length; i++) {
      const k = bools[i];
      if (c[k] !== undefined && c[k] !== null && typeof c[k] !== "boolean") {
        throw new Error(k + " must be true or false.");
      }
    }
    if (c.entity !== undefined && c.entity !== null && typeof c.entity !== "string") {
      throw new Error("entity must be an entity id.");
    }
    if (c.language !== undefined && c.language !== null && c.language !== "auto"
        && !normalizeLang(c.language)) {
      throw new Error("language must be 'auto' or one of: " + Object.keys(STRINGS).join(", ") + ".");
    }
  }

  class KioskAutoscrollCard extends HTMLElement {
    setConfig(config) {
      validateConfig(config);
      this._config = config || {};
      this._render();
    }
    set hass(hass) {
      this._hass = hass;
      const editing = this._isEditing();
      const lang = resolveLang(this._config, hass);
      if (editing !== this._lastEditing || lang !== this._lastLang) this._render();
    }
    set editMode(value) {
      this._editMode = value;
      this._render();
    }
    connectedCallback() {
      this._restoreHosts();
      this._preview = inEditorPreview(this);
      if (!this._preview) {
        activeCards.add(this);
        ensureRunning();
      }
      rerenderCards();
      this._render();
    }
    disconnectedCallback() {
      activeCards.delete(this);
      this._restoreHosts();
      if (!running()) stop();
      rerenderCards();
    }
    _isEditing() {
      return this._editMode === true || isEditMode();
    }
    // Rend visible a nouveau tout conteneur masque par _hideHosts().
    _restoreHosts() {
      const hidden = this._hiddenHosts;
      if (!hidden) return;
      for (let i = 0; i < hidden.length; i++) {
        hidden[i].el.style.display = hidden[i].prev;
      }
      hidden.length = 0;
    }
    // Hors edition, masquer la carte ne suffit pas : en vue « sections » (HA 2024.3+)
    // le conteneur <hui-card> occupe une cellule de la grille et laisse un trou.
    // On masque donc aussi les conteneurs de mise en page qui l'entourent.
    _hideHosts() {
      const hidden = this._hiddenHosts || (this._hiddenHosts = []);
      if (hidden.length) return;
      let node = this.parentNode;
      let guard = 0;
      while (node && guard < 4) {
        guard++;
        const tag = node.localName || "";
        if (tag !== "hui-card" && tag !== "hui-card-options" && tag !== "hui-card-container") break;
        hidden.push({ el: node, prev: node.style.display });
        node.style.display = "none";
        node = node.parentNode;
      }
    }
    _render() {
      this._lastEditing = this._isEditing();
      this._lastLang = resolveLang(this._config, this._hass);
      this.innerHTML = "";
      if (!this._lastEditing) {
        this.style.display = "none";
        this.style.margin = "0";
        this.style.padding = "0";
        if (!this._preview) this._hideHosts();
        return;
      }
      this._restoreHosts();
      this.style.display = "block";
      this.style.margin = "";
      this.style.padding = "";
      const c = this._config || {};
      const lang = resolveLang(c, this._hass);
      const mode = c.mode === "duration"
        ? t(lang, "modeDurationShort")
        : t(lang, "modeSpeedShort");
      const axis = c.axis === "horizontal"
        ? t(lang, "axisHorizontalShort")
        : t(lang, "axisVerticalShort");
      const users = c.users
        ? (Array.isArray(c.users) ? c.users.join(", ") : String(c.users))
        : t(lang, "allUsers");

      const box = document.createElement("div");
      box.style.cssText =
        "border:1px dashed var(--primary-color,#03a9f4);border-radius:8px;" +
        "padding:12px 14px;background:var(--card-background-color,#fff);" +
        "color:var(--primary-text-color,#212121);font-size:14px";

      const title = document.createElement("div");
      title.style.cssText = "font-weight:600;display:flex;align-items:center;gap:6px";
      title.textContent = "⇳ " + t(lang, "cardName");

      const desc = document.createElement("div");
      desc.style.cssText = "opacity:.75;margin-top:4px;line-height:1.4";
      desc.textContent = t(lang, "cardDesc");

      const stats = document.createElement("div");
      stats.style.cssText = "opacity:.75;margin-top:4px;line-height:1.4";
      const bold = function (value) {
        const b = document.createElement("b");
        b.textContent = String(value);
        return b;
      };
      stats.append(
        document.createTextNode(t(lang, "statMode")), bold(mode),
        document.createTextNode(t(lang, "statAxis")), bold(axis),
        document.createTextNode(t(lang, "statRotate")),
        bold(c.rotateViews ? t(lang, "yes") : t(lang, "no")),
        document.createTextNode(t(lang, "statUsers")), bold(users)
      );
      box.append(title, desc, stats);

      if (connectedCardCount() > 1) {
        const warn = document.createElement("div");
        warn.style.cssText = "margin-top:8px;color:var(--error-color,#db4437);font-weight:600";
        warn.textContent = t(lang, "warnMultiple");
        box.appendChild(warn);
      }

      this.appendChild(box);
    }
    getCardSize() {
      return this._isEditing() ? 1 : 0;
    }
    // Vues « sections » (HA 2024.3+) : emprise minimale a l'edition, nulle en production.
    getGridOptions() {
      if (this._isEditing()) {
        return { rows: 2, columns: 12, min_rows: 1, min_columns: 6 };
      }
      return { rows: 0, columns: 0, min_rows: 0, min_columns: 0 };
    }
    // Ancien nom de l'API (HA 2024.3 -> 2024.10).
    getLayoutOptions() {
      return this.getGridOptions();
    }
    static getConfigElement() {
      return document.createElement("kiosk-autoscroll-card-editor");
    }
    static getStubConfig() {
      return {
        mode: DEFAULTS.mode,
        speed: DEFAULTS.speed,
        pause: DEFAULTS.pause,
        pauseOnInteraction: DEFAULTS.pauseOnInteraction
      };
    }
  }

  if (!customElements.get("kiosk-autoscroll-card")) {
    customElements.define("kiosk-autoscroll-card", KioskAutoscrollCard);
  }

  function buildSchema(mode, lang) {
    const main = mode === "duration"
      ? { name: "duration", selector: { number: { min: 1, step: 1, mode: "box", unit_of_measurement: "s" } } }
      : { name: "speed", selector: { number: { min: 0.05, step: 0.05, mode: "box" } } };
    return [
      { name: "mode", selector: { select: { mode: "dropdown", options: [
        { value: "speed", label: t(lang, "optSpeed") },
        { value: "duration", label: t(lang, "optDuration") }
      ] } } },
      main,
      { name: "pause", selector: { number: { min: 0, step: 100, mode: "box", unit_of_measurement: "ms" } } },
      { type: "expandable", title: t(lang, "advanced"), icon: "mdi:tune", schema: [
        { name: "axis", selector: { select: { mode: "dropdown", options: [
          { value: "vertical", label: t(lang, "optVertical") },
          { value: "horizontal", label: t(lang, "optHorizontal") }
        ] } } },
        { name: "easing", selector: { boolean: {} } },
        { name: "hideScrollbar", selector: { boolean: {} } },
        { name: "pauseOnInteraction", selector: { number: { min: 0, step: 500, mode: "box", unit_of_measurement: "ms" } } },
        { name: "rotateViews", selector: { boolean: {} } },
        { name: "entity", selector: { entity: {} } },
        { name: "activeHours", selector: { text: {} } },
        { name: "users", selector: { entity: { domain: "person", multiple: true } } },
        { name: "language", selector: { select: { mode: "dropdown", options: [
          { value: "auto", label: t(lang, "optLangAuto") },
          { value: "en", label: t(lang, "optLangEn") },
          { value: "fr", label: t(lang, "optLangFr") }
        ] } } }
      ] }
    ];
  }

  class KioskAutoscrollCardEditor extends HTMLElement {
    setConfig(config) {
      this._config = config || {};
      this._render();
    }
    set hass(hass) {
      this._hass = hass;
      this._render();
    }
    _render() {
      if (!this._config) return;
      const self = this;
      if (!this._form) {
        this._form = document.createElement("ha-form");
        this._form.computeLabel = function (sc) {
          return tSub(self._lang || FALLBACK_LANG, "labels", sc.name);
        };
        this._form.computeHelper = function (sc) {
          const lg = self._lang || FALLBACK_LANG;
          if (sc.name === "activeHours") {
            const v = self._config && self._config.activeHours;
            if (v && !validHours(v)) return t(lg, "hoursError");
          }
          return tSub(lg, "helpers", sc.name);
        };
        this._form.addEventListener("value-changed", function (e) {
          self._config = e.detail.value;
          self.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: self._config },
            bubbles: true,
            composed: true
          }));
          self._render();
        });
        this.appendChild(this._form);
      }
      this._form.hass = this._hass;
      this._lang = resolveLang(this._config, this._hass);
      const mode = this._config.mode || DEFAULTS.mode;
      // Le schema porte les libelles traduits : le rebatir si mode ou langue change
      if (mode !== this._lastMode || this._lang !== this._lastLang) {
        this._form.schema = buildSchema(mode, this._lang);
        this._lastMode = mode;
        this._lastLang = this._lang;
      }
      this._form.data = this._config;
    }
  }

  if (!customElements.get("kiosk-autoscroll-card-editor")) {
    customElements.define("kiosk-autoscroll-card-editor", KioskAutoscrollCardEditor);
  }

  // A ce stade `hass` n'existe pas encore : on se rabat sur la langue du navigateur.
  const pickerLang = normalizeLang(
    typeof navigator !== "undefined" ? navigator.language : null
  ) || FALLBACK_LANG;

  window.customCards = window.customCards || [];
  if (!window.customCards.some(function (c) { return c.type === "kiosk-autoscroll-card"; })) {
    window.customCards.push({
      type: "kiosk-autoscroll-card",
      name: t(pickerLang, "cardName"),
      description: t(pickerLang, "cardDescription"),
      preview: false,
      documentationURL: "https://github.com/Flybrow/lovelace-kiosk-autoscroll"
    });
  }

  console.info(
    "%c KIOSK-AUTOSCROLL %c loaded ",
    "background:#03a9f4;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px",
    "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
  );
})();
