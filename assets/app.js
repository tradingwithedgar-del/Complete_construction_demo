/* ==========================================================================
   Complete Construction — behaviour
   Vanilla JS, no dependencies. Reads content flags from assets/site.config.js.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.SITE || {};
  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  /* ======================================================================
     1. Apply configuration
     Everything gated by an approval flag ships hidden. This reveals only
     what the owner has confirmed, so a false flag (or a JS failure) leaves
     the unverified claim invisible.
     ====================================================================== */
  function applyConfig() {
    var flags = CFG.flags || {};

    $$("[data-flag]").forEach(function (el) {
      if (flags[el.getAttribute("data-flag")] === true) { el.hidden = false; }
    });

    // Services
    var enabled = {};
    (CFG.services || []).forEach(function (s) { enabled[s.id] = s.enabled; });
    $$("[data-service]").forEach(function (el) {
      el.hidden = enabled[el.getAttribute("data-service")] !== true;
    });
    // Renumber the visible service cards so the sequence has no gaps.
    $$(".svc-card:not([hidden]) .sn").forEach(function (el, i) {
      el.textContent = "S-" + String(i + 1).padStart(2, "0");
    });

    // Service-area counties
    var confirmed = {};
    (CFG.serviceArea && CFG.serviceArea.counties || []).forEach(function (c) {
      confirmed[c.name] = c.confirmed;
    });
    $$("[data-county]").forEach(function (el) {
      el.hidden = confirmed[el.getAttribute("data-county")] !== true;
    });

    // Language control
    if (CFG.i18n && CFG.i18n.enabled === false) {
      $$(".lang").forEach(function (el) { el.hidden = true; });
    }

    // Phone number, in case it is changed in one place
    var b = CFG.business || {};
    if (b.phoneE164) {
      $$('a[data-phone-link]').forEach(function (a) { a.href = "tel:" + b.phoneE164; });
    }
    if (b.phoneDisplay) {
      $$("[data-phone-display]").forEach(function (el) { el.textContent = b.phoneDisplay; });
    }
  }

  /* ======================================================================
     2. Language
     ====================================================================== */
  var langNodes = $$("[data-en]");
  function setLang(lang) {
    if (lang !== "es") { lang = "en"; }
    langNodes.forEach(function (n) {
      var t = n.getAttribute("data-" + lang);
      if (t !== null) { n.textContent = t; }
    });
    document.documentElement.lang = lang;
    $$(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    try { localStorage.setItem("cc-lang", lang); } catch (e) {}
  }
  $$(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(this.dataset.lang); });
  });

  /* ======================================================================
     3. Mobile drawer — focus trap, Escape, scroll lock
     ====================================================================== */
  var drawer   = $("#drawer");
  var backdrop = $("#drawer-backdrop");
  var burger   = $("#burger");
  var lastFocus = null;

  function trapFocus(container, ev) {
    var items = $$(FOCUSABLE, container).filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) { return; }
    var first = items[0], last = items[items.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  }

  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.classList.add("open");
    backdrop.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var first = $$(FOCUSABLE, drawer)[0];
    if (first) { first.focus(); }
  }

  function closeDrawer(restore) {
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (restore !== false && lastFocus) { lastFocus.focus(); }
  }

  if (burger && drawer) {
    burger.addEventListener("click", function () {
      drawer.classList.contains("open") ? closeDrawer() : openDrawer();
    });
    backdrop.addEventListener("click", function () { closeDrawer(); });
    $("#drawer-close").addEventListener("click", function () { closeDrawer(); });
    // A navigation link should close the drawer and let the anchor run.
    $$("#drawer nav a").forEach(function (a) {
      a.addEventListener("click", function () { closeDrawer(false); });
    });
    drawer.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") { ev.preventDefault(); closeDrawer(); }
      else if (ev.key === "Tab") { trapFocus(drawer, ev); }
    });
  }

  /* ======================================================================
     4. Phase rail — tablist on desktop, scroll strip on mobile
     ====================================================================== */
  var tabs = $$('.rail [role="tab"]');
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      $("#" + t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) { tab.focus(); }
    if (window.matchMedia("(max-width:680px)").matches && tab.scrollIntoView) {
      tab.scrollIntoView({ inline: "center", block: "nearest", behavior: prefersReduced() ? "auto" : "smooth" });
    }
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab, false); });
    tab.addEventListener("keydown", function (ev) {
      var n = null;
      if (ev.key === "ArrowRight" || ev.key === "ArrowDown") { n = tabs[(i + 1) % tabs.length]; }
      else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") { n = tabs[(i - 1 + tabs.length) % tabs.length]; }
      else if (ev.key === "Home") { n = tabs[0]; }
      else if (ev.key === "End") { n = tabs[tabs.length - 1]; }
      if (n) { ev.preventDefault(); selectTab(n, true); }
    });
  });

  function prefersReduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ======================================================================
     5. Portfolio filters
     A filter renders only when at least one published project carries that
     category, so an empty "New builds" tab can never appear.
     ====================================================================== */
  function buildFilters() {
    var host = $("#filters");
    if (!host) { return; }
    var projects = $$("[data-category]");
    var present = [];
    projects.forEach(function (p) {
      p.getAttribute("data-category").split(/\s+/).forEach(function (c) {
        if (c && present.indexOf(c) === -1) { present.push(c); }
      });
    });

    var labels = (CFG.portfolio && CFG.portfolio.categoryLabels) || {};
    var showSingle = CFG.portfolio && CFG.portfolio.showFiltersWhenSingleCategory;
    if (present.length < 2 && !showSingle) { host.hidden = true; return; }

    host.hidden = false;
    var cats = ["all"].concat(present);
    cats.forEach(function (cat, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = labels[cat] || cat;
      b.setAttribute("aria-pressed", String(i === 0));
      b.addEventListener("click", function () {
        $$("#filters button").forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        projects.forEach(function (p) {
          var match = cat === "all" || p.getAttribute("data-category").split(/\s+/).indexOf(cat) > -1;
          p.hidden = !match;
        });
      });
      host.appendChild(b);
    });
  }

  /* ======================================================================
     5b. Gallery
     Renders the grid and its filter chips from CFG.gallery. A chip appears
     only for a category that actually holds photos, so an empty room type
     can never show up. Adding a room is a config edit, not a new page.
     ====================================================================== */
  function buildGallery() {
    var grid = $("#gallery-grid");
    var chips = $("#gallery-filters");
    var empty = $("#gallery-empty");
    var section = $("#gallery");
    if (!grid || !chips) { return; }

    var cfg = CFG.gallery || {};
    var images = cfg.images || [];
    var labels = cfg.categories || {};

    // Nothing to show: hide the whole section rather than leave a gap.
    if (!images.length) { if (section) { section.hidden = true; } return; }

    var frag = document.createDocumentFragment();
    images.forEach(function (img, i) {
      var fig = document.createElement("figure");
      fig.className = "gal-item";
      fig.setAttribute("data-cat", img.category || "");

      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("data-full", img.src);
      btn.setAttribute("data-caption", img.caption || img.alt || "");

      var el = document.createElement("img");
      el.src = img.src;
      el.alt = img.alt || "";
      el.loading = i < 4 ? "eager" : "lazy";
      el.decoding = "async";
      el.width = 544;
      el.height = 720;

      btn.appendChild(el);
      fig.appendChild(btn);

      if (labels[img.category]) {
        var cap = document.createElement("figcaption");
        cap.className = "mono";
        cap.textContent = labels[img.category];
        fig.appendChild(cap);
      }
      frag.appendChild(fig);
    });
    grid.appendChild(frag);

    // Which categories actually have photos, in config order
    var present = Object.keys(labels).filter(function (key) {
      return images.some(function (im) { return im.category === key; });
    });

    function show(cat) {
      // The room label under each photo is useful when everything is mixed
      // together, and pure repetition once a single room is selected.
      grid.classList.toggle("filtered", cat !== "all");
      var shown = 0;
      $$(".gal-item", grid).forEach(function (fig) {
        var match = cat === "all" || fig.getAttribute("data-cat") === cat;
        fig.hidden = !match;
        if (match) { shown += 1; }
      });
      if (empty) { empty.hidden = shown > 0; }
    }

    // One category only? The chips would be decoration, so skip them.
    if (present.length < 2) { chips.hidden = true; return; }

    ["all"].concat(present).forEach(function (cat, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = cat === "all" ? (labels.all || "All") : labels[cat];
      b.setAttribute("aria-pressed", String(i === 0));
      b.addEventListener("click", function () {
        $$("button", chips).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        show(cat);
      });
      chips.appendChild(b);
    });
  }

  /* ======================================================================
     6. Lightbox — Escape, arrows, focus trap, focus restore
     ====================================================================== */
  var lb = $("#lightbox"), lbImg = $("#lb-img"), lbCap = $("#lb-cap"), lbIdx = $("#lb-index");
  var group = [], pos = 0, lbLastFocus = null;

  function openLb(triggerBtn) {
    var scope = triggerBtn.closest("[data-gallery]") || document;
    // Only images currently on screen, so prev/next follows the active filter
    // rather than stepping into hidden categories.
    group = $$("button[data-full]", scope).filter(function (b) {
      return !b.hidden && b.offsetParent !== null;
    });
    if (!group.length) { group = [triggerBtn]; }
    pos = group.indexOf(triggerBtn);
    lbLastFocus = triggerBtn;
    render();
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#lb-close").focus();
  }

  function render() {
    var b = group[pos], img = b.querySelector("img");
    lbImg.src = b.getAttribute("data-full");
    lbImg.alt = img ? img.alt : "";
    lbCap.textContent = b.getAttribute("data-caption") || (img ? img.alt : "");
    lbIdx.textContent = (pos + 1) + " / " + group.length;
    var many = group.length > 1;
    $("#lb-prev").hidden = !many;
    $("#lb-next").hidden = !many;
  }

  function step(d) { pos = (pos + d + group.length) % group.length; render(); }

  function closeLb() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.removeAttribute("src");
    if (lbLastFocus) { lbLastFocus.focus(); }
  }

  if (lb) {
    $("#lb-close").addEventListener("click", closeLb);
    $("#lb-prev").addEventListener("click", function () { step(-1); });
    $("#lb-next").addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (ev) { if (ev.target === lb) { closeLb(); } });
    lb.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") { closeLb(); }
      else if (ev.key === "ArrowRight" && group.length > 1) { step(1); }
      else if (ev.key === "ArrowLeft" && group.length > 1) { step(-1); }
      else if (ev.key === "Tab") { trapFocus(lb, ev); }
    });
    // Delegated, so buttons rendered after boot (the gallery) work as well.
    document.addEventListener("click", function (ev) {
      var btn = ev.target.closest && ev.target.closest("button[data-full]");
      if (btn) { openLb(btn); }
    });
  }

  /* ======================================================================
     7. Anchor navigation — smooth scroll plus focus for screen readers
     ====================================================================== */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href").slice(1);
      if (!id) { return; }
      var target = document.getElementById(id);
      if (!target) { return; }
      ev.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
      // Move focus so keyboard and screen-reader users land in the section.
      if (!target.hasAttribute("tabindex")) { target.setAttribute("tabindex", "-1"); }
      target.focus({ preventScroll: true });
      if (history.replaceState) { history.replaceState(null, "", "#" + id); }
    });
  });

  // "Check your project area" drops the visitor into the Town/ZIP field.
  var areaCta = $("#check-area");
  if (areaCta) {
    areaCta.addEventListener("click", function (ev) {
      ev.preventDefault();
      var f = $("#contact");
      f.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
      window.setTimeout(function () {
        var town = $("#f-town");
        if (town) { town.focus({ preventScroll: true }); }
      }, prefersReduced() ? 0 : 520);
    });
  }

  /* ======================================================================
     8. Lead form
     ====================================================================== */
  var form = $("#contact-form");
  var msg  = $("#form-msg");

  var COPY = {
    en: {
      sending: "Sending…",
      ok: "Thank you. Your enquiry has been sent and we will get back to you shortly.",
      err: "Sorry, that did not send. Please call or text (732) 890-6244 instead.",
      demo: "Preview mode: the form is not connected to an inbox yet, so nothing was sent. Add the Web3Forms key in assets/site.config.js.",
      fix: "Please check the highlighted fields."
    },
    es: {
      sending: "Enviando…",
      ok: "Gracias. Su solicitud fue enviada y le responderemos en breve.",
      err: "No se pudo enviar. Por favor llame o escriba al (732) 890-6244.",
      demo: "Modo de vista previa: el formulario aún no está conectado a un correo, así que no se envió nada. Agregue la clave de Web3Forms en assets/site.config.js.",
      fix: "Por favor revise los campos marcados."
    }
  };
  function t() { return COPY[document.documentElement.lang === "es" ? "es" : "en"]; }
  function say(kind, text) { msg.textContent = text; msg.className = "form-msg show " + kind; }

  /* --- progressive disclosure: reveal the qualifying questions that are
         actually relevant to the project type chosen --- */
  var typeSelect = $("#f-type");
  if (typeSelect) {
    typeSelect.addEventListener("change", function () {
      var v = typeSelect.value;
      var chosen = v !== "";
      $("#opt-common").classList.toggle("show", chosen);
      $("#opt-lot").classList.toggle("show", v === "addition" || v === "new-build");
      $("#opt-spaces").classList.toggle("show", v === "whole-home");
    });
  }

  /* --- inline validation --- */
  function fieldOf(input) { return input.closest(".field"); }

  function validate(input) {
    var wrap = fieldOf(input);
    if (!wrap) { return true; }
    var ok = input.checkValidity();
    wrap.classList.toggle("invalid", !ok);
    input.setAttribute("aria-invalid", String(!ok));
    var err = wrap.querySelector(".err");
    if (err && !ok) {
      err.textContent = input.validity.valueMissing
        ? (err.getAttribute("data-missing") || "This field is required.")
        : (err.getAttribute("data-invalid") || "Please check this entry.");
    }
    return ok;
  }

  if (form) {
    $$("input,select,textarea", form).forEach(function (el) {
      if (el.type === "hidden") { return; }
      el.addEventListener("blur", function () { validate(el); });
      el.addEventListener("input", function () {
        if (fieldOf(el) && fieldOf(el).classList.contains("invalid")) { validate(el); }
      });
    });
  }

  /* --- the single submit path -----------------------------------------
     One function sends the enquiry. It posts to Web3Forms, which emails
     it to the inbox the access key was created against.

     Field names double as the labels in the email Adolfo receives, so
     they are written the way a person reads them, not the way a database
     would store them. The subject carries the project type and town so
     enquiries can be triaged from the inbox list without opening them.

     To change where enquiries go, change the key in
     assets/site.config.js. Nothing else needs touching.
     ------------------------------------------------------------------- */
  function labelOf(select) {
    var el = form.elements[select];
    if (!el || !el.value) { return ""; }
    if (el.tagName === "SELECT") { return el.options[el.selectedIndex].textContent.trim(); }
    return String(el.value).trim();
  }

  function buildEnquiry() {
    var cfg  = CFG.form || {};
    var v    = function (n) { var el = form.elements[n]; return el ? String(el.value || "").trim() : ""; };
    var type = labelOf("projectType");
    var town = v("townOrZip");

    var body = {
      access_key: cfg.web3formsAccessKey,
      subject: (cfg.subjectPrefix || "New project enquiry")
        + (type ? " — " + type : "")
        + (town ? " — " + town : ""),
      from_name: "Complete Construction website",
      // Lets Adolfo hit reply in his mail client and reach the customer.
      replyto: v("email"),
      // Honeypot. Read .checked, not .value — an unchecked checkbox still
      // reports "on", which would make Web3Forms treat every real
      // submission as a bot and drop it silently.
      botcheck: (form.elements.botcheck && form.elements.botcheck.checked) ? "1" : "",

      "Name":                v("name"),
      "Phone":               v("phone"),
      "Email":               v("email"),
      "Town or ZIP":         town,
      "Project type":        type,
      "Project details":     v("message")
    };

    // Only include the optional answers that were actually filled in, so
    // the email does not carry a wall of empty rows.
    var extras = {
      "Desired start":        labelOf("timeframe"),
      "Investment range":     labelOf("budgetRange"),
      "Owns property or lot": labelOf("ownsPropertyOrLot"),
      "Spaces included":      v("spacesIncluded")
    };
    Object.keys(extras).forEach(function (k) { if (extras[k]) { body[k] = extras[k]; } });

    body["Sent from"] = (cfg.sourcePage || "home") + " page";
    return body;
  }

  function submitEnquiry(body) {
    return fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); });
  }

  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var fields = $$("input,select,textarea", form).filter(function (el) {
        return el.type !== "hidden" && el.willValidate && el.offsetParent !== null;
      });
      var bad = fields.filter(function (el) { return !validate(el); });
      if (bad.length) {
        say("err", t().fix);
        bad[0].focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn.textContent;
      function restore() {
        btn.disabled = false;
        btn.removeAttribute("aria-busy");
        btn.textContent = label;
      }
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
      btn.textContent = t().sending;
      say("ok", t().sending);

      var body = buildEnquiry();
      if (!body.access_key) { restore(); say("err", t().demo); return; }

      submitEnquiry(body)
        .then(function (res) {
          if (res && res.success === true) {
            say("ok", t().ok);
            form.reset();
            $$(".optional-block", form).forEach(function (b) { b.classList.remove("show"); });
          } else {
            say("err", t().err);
          }
        })
        .catch(function () { say("err", t().err); })
        .finally(restore);
    });
  }

  /* ======================================================================
     9. Boot
     ====================================================================== */
  applyConfig();
  buildFilters();
  buildGallery();

  var yr = $("#yr");
  if (yr) { yr.textContent = String(new Date().getFullYear()); }

  var saved = null;
  try { saved = localStorage.getItem("cc-lang"); } catch (e) {}
  if (!saved && (navigator.language || "").toLowerCase().indexOf("es") === 0) { saved = "es"; }
  if (saved === "es") { setLang("es"); }
})();
