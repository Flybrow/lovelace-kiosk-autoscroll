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
    rotateViews: false,
    entity: null,
    activeHours: null,
    users: null,
    enabled: true
  };

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

  function gotoNextView() {
    const ll = getLovelace();
    if (!ll || !ll.config || !Array.isArray(ll.config.views) || ll.config.views.length < 2) {
      return false;
    }
    const parts = location.pathname.split("/").filter(Boolean);
    if (!parts.length) return false;
    const dashboard = parts[0];
    const current = parts.length > 1 ? parts[1] : "";
    const views = ll.config.views;
    let idx = -1;
    for (let i = 0; i < views.length; i++) {
      const seg = views[i].path != null ? String(views[i].path) : String(i);
      if (seg === current) { idx = i; break; }
    }
    if (idx < 0) idx = 0;
    const next = (idx + 1) % views.length;
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
  let multipleCards = false;

  const activeCards = new Set();
  let globalController = null;

  function resolveEntry() {
    const dash = currentDashboard();
    if (globalController && globalController.dashboard !== dash) globalController = null;

    let local = null;
    let count = 0;
    activeCards.forEach(function (card) {
      if (!card.isConnected) return;
      const c = Object.assign({}, DEFAULTS, card._config || {});
      if (c.enabled === false) return;
      if (!userAllowed(c, card._hass)) return;
      count++;
      if (!local) local = { cfg: c, hass: card._hass };
    });
    multipleCards = count > 1;

    if (local) {
      if (local.cfg.rotateViews) {
        globalController = { cfg: local.cfg, hass: local.hass, dashboard: dash };
      }
      return local;
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
    cachedScroller = null;
    acc = 0;
    dir = 1;
    newLeg = true;
    pausedUntil = 0;
    legEndTs = 0;
    lastActive = 0;
    lastTs = 0;
  }
  window.addEventListener("location-changed", onNav);
  window.addEventListener("popstate", onNav);

  let rafId = null;
  function running() {
    return (activeCards.size > 0 || globalController) && !document.hidden;
  }
  function start() {
    if (rafId === null) {
      lastTs = 0;
      rafId = requestAnimationFrame(loop);
    }
  }
  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
  function ensureRunning() {
    if (rafId === null && running()) start();
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else ensureRunning();
  });

  function loop(ts) {
    if (!activeCards.size && !globalController) { stop(); return; }
    rafId = requestAnimationFrame(loop);
    try {
      step(ts);
    } catch (e) {}
  }

  function step(ts) {
    const entry = resolveEntry();
    if (!entry) return;
    const cfg = entry.cfg;
    const hass = entry.hass;
    lastPauseOnInteraction = cfg.pauseOnInteraction;

    const now = Date.now();
    const dt = lastTs ? clamp(ts - lastTs, 0, 100) : 16;
    lastTs = ts;

    if (now < pausedUntil) { lastActive = 0; return; }
    if (document.hidden) { lastActive = 0; return; }
    if (isEditMode()) { lastActive = 0; return; }
    if (!withinHours(cfg.activeHours)) { lastActive = 0; return; }
    if (!entityActive(hass, cfg.entity)) { lastActive = 0; return; }

    if (now < userActiveUntil) { lastActive = 0; return; }

    const horiz = isHorizontal(cfg);
    const scroller = getScroller(horiz);
    if (!scroller) return;

    const max = getMax(scroller, horiz);
    if (max <= 1) return;
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
      if (cfg.rotateViews && gotoNextView()) {
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

  class KioskAutoscrollCard extends HTMLElement {
    setConfig(config) {
      this._config = config || {};
      this._render();
    }
    set hass(hass) {
      this._hass = hass;
      const editing = this._isEditing();
      if (editing !== this._lastEditing) this._render();
    }
    set editMode(value) {
      this._editMode = value;
      this._render();
    }
    connectedCallback() {
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
      if (!running()) stop();
      rerenderCards();
    }
    _isEditing() {
      return this._editMode === true || isEditMode();
    }
    _render() {
      this._lastEditing = this._isEditing();
      this.innerHTML = "";
      if (!this._lastEditing) {
        this.style.display = "none";
        return;
      }
      this.style.display = "block";
      const c = this._config || {};
      const mode = c.mode === "duration" ? "durée fixe" : "vitesse fixe";
      const axis = c.axis === "horizontal" ? "horizontal" : "vertical";
      const users = c.users
        ? (Array.isArray(c.users) ? c.users.join(", ") : String(c.users))
        : "tous";

      const box = document.createElement("div");
      box.style.cssText =
        "border:1px dashed var(--primary-color,#03a9f4);border-radius:8px;" +
        "padding:12px 14px;background:var(--card-background-color,#fff);" +
        "color:var(--primary-text-color,#212121);font-size:14px";

      const title = document.createElement("div");
      title.style.cssText = "font-weight:600;display:flex;align-items:center;gap:6px";
      title.textContent = "⇳ Kiosk Auto Scroll";

      const desc = document.createElement("div");
      desc.style.cssText = "opacity:.75;margin-top:4px;line-height:1.4";
      desc.textContent =
        "Carte invisible : active le défilement automatique (mode kiosque) " +
        "sur ce tableau de bord. Invisible hors édition.";

      const stats = document.createElement("div");
      stats.style.cssText = "opacity:.75;margin-top:4px;line-height:1.4";
      const bold = function (value) {
        const b = document.createElement("b");
        b.textContent = String(value);
        return b;
      };
      stats.append(
        document.createTextNode("Mode "), bold(mode),
        document.createTextNode(" • axe "), bold(axis),
        document.createTextNode(" • rotation "), bold(c.rotateViews ? "oui" : "non"),
        document.createTextNode(" • utilisateur(s) "), bold(users)
      );
      box.append(title, desc, stats);

      if (connectedCardCount() > 1) {
        const warn = document.createElement("div");
        warn.style.cssText = "margin-top:8px;color:var(--error-color,#db4437);font-weight:600";
        warn.textContent = "⚠ Plusieurs cartes Kiosk sur cette page : une seule est utilisée. N'en gardez qu'une.";
        box.appendChild(warn);
      }

      this.appendChild(box);
    }
    getCardSize() {
      return this._isEditing() ? 1 : 0;
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

  const LABELS = {
    mode: "Mode de défilement",
    axis: "Sens du défilement",
    speed: "Vitesse",
    duration: "Durée d'un aller",
    easing: "Ralentir en douceur aux extrémités",
    pause: "Pause aux extrémités",
    pauseOnInteraction: "Pause après une interaction",
    rotateViews: "Faire défiler tout le tableau de bord",
    entity: "Activer seulement si une entité est allumée",
    activeHours: "Plage horaire d'activité",
    users: "Limiter à certains utilisateurs"
  };

  const HELPERS = {
    mode: "« Vitesse constante » : une vitesse fixe. « Durée constante » : la vue est parcourue dans un temps choisi, quelle que soit sa longueur.",
    axis: "Vertical (de haut en bas) ou horizontal (vues en colonnes, panneaux larges).",
    speed: "Plus la valeur est grande, plus c'est rapide (ex. 0.25 = très lent, 1 = normal, 3 = rapide).",
    duration: "Temps, en secondes, pour parcourir toute la vue d'un bout à l'autre.",
    easing: "Le défilement ralentit en approchant des extrémités (mode vitesse uniquement).",
    pause: "Temps d'arrêt à chaque extrémité, en millisecondes (4000 = 4 s).",
    pauseOnInteraction: "Après un toucher, un clic ou la molette, délai avant reprise (en ms).",
    rotateViews: "En bas, passe à la vue suivante. Le défilement couvre alors tout le tableau de bord ; une carte posée sur une autre page reste prioritaire sur cette page.",
    entity: "Le défilement n'a lieu que si cette entité est on / home / open (ex. un input_boolean).",
    activeHours: "Limite le défilement à une tranche horaire, ex. 08:00-20:00 (gère aussi la nuit).",
    users: "Choisissez les personnes autorisées. Vide = tout le monde."
  };

  function buildSchema(mode) {
    const main = mode === "duration"
      ? { name: "duration", selector: { number: { min: 1, step: 1, mode: "box", unit_of_measurement: "s" } } }
      : { name: "speed", selector: { number: { min: 0.05, step: 0.05, mode: "box" } } };
    return [
      { name: "mode", selector: { select: { mode: "dropdown", options: [
        { value: "speed", label: "Vitesse constante" },
        { value: "duration", label: "Durée constante (parcours en X s)" }
      ] } } },
      main,
      { name: "pause", selector: { number: { min: 0, step: 100, mode: "box", unit_of_measurement: "ms" } } },
      { type: "expandable", title: "Réglages avancés (optionnel)", icon: "mdi:tune", schema: [
        { name: "axis", selector: { select: { mode: "dropdown", options: [
          { value: "vertical", label: "Vertical (haut/bas)" },
          { value: "horizontal", label: "Horizontal (gauche/droite)" }
        ] } } },
        { name: "easing", selector: { boolean: {} } },
        { name: "pauseOnInteraction", selector: { number: { min: 0, step: 500, mode: "box", unit_of_measurement: "ms" } } },
        { name: "rotateViews", selector: { boolean: {} } },
        { name: "entity", selector: { entity: {} } },
        { name: "activeHours", selector: { text: {} } },
        { name: "users", selector: { entity: { domain: "person", multiple: true } } }
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
        this._form.computeLabel = function (s) { return LABELS[s.name] || s.name; };
        this._form.computeHelper = function (s) {
          if (s.name === "activeHours") {
            const v = self._config && self._config.activeHours;
            if (v && !validHours(v)) {
              return "⚠ Format invalide. Attendu HH:MM-HH:MM (ex. 08:00-20:00).";
            }
          }
          return HELPERS[s.name] || "";
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
      const mode = this._config.mode || DEFAULTS.mode;
      if (mode !== this._lastMode) {
        this._form.schema = buildSchema(mode);
        this._lastMode = mode;
      }
      this._form.data = this._config;
    }
  }

  if (!customElements.get("kiosk-autoscroll-card-editor")) {
    customElements.define("kiosk-autoscroll-card-editor", KioskAutoscrollCardEditor);
  }

  window.customCards = window.customCards || [];
  if (!window.customCards.some(function (c) { return c.type === "kiosk-autoscroll-card"; })) {
    window.customCards.push({
      type: "kiosk-autoscroll-card",
      name: "Kiosk Auto Scroll",
      description: "Carte invisible : active le defilement automatique (mode kiosque) sur ce tableau de bord.",
      preview: false,
      documentationURL: "https://github.com/Flybrow/lovelace-kiosk-autoscroll"
    });
  }

  console.info(
    "%c KIOSK-AUTOSCROLL %c charge ",
    "background:#03a9f4;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px",
    "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
  );
})();
