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

    // Social links. A handle fills in the href and reveals every button that
    // points at it; an empty handle leaves them all hidden, so an unconfirmed
    // profile can never ship as a dead link.
    var social = CFG.social || {};
    var BASE = { instagram: "https://instagram.com/", facebook: "https://facebook.com/" };
    Object.keys(BASE).forEach(function (net) {
      var handle = String(social[net] || "").trim().replace(/^@/, "");
      $$('[data-social="' + net + '"]').forEach(function (el) {
        if (!handle) { el.hidden = true; return; }
        el.href = BASE[net] + handle;
        el.setAttribute("aria-label", net === "instagram"
          ? "Complete Construction on Instagram, opens in a new tab"
          : "Complete Construction on Facebook, opens in a new tab");
        el.hidden = false;
      });
    });

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
  function setLang(lang) {
    if (lang !== "es") { lang = "en"; }
    // Re-queried each time rather than captured once: the blocks below the
    // hero are rendered after this script loads, so a cached list would
    // leave every word in them untranslated.
    $$("[data-en]").forEach(function (n) {
      var t = n.getAttribute("data-" + lang);
      if (t !== null) { n.textContent = t; }
    });
    document.documentElement.lang = lang;
    // Elements whose translation belongs in an attribute, not in text.
    // An image gets its real alt rewritten rather than an aria-label laid
    // over it, so the accessible name and the indexed text stay the same
    // string - the hero badge is the <h1>, so that string is the heading.
    $$("[data-alt-en]").forEach(function (n) {
      var t = n.getAttribute("data-alt-" + lang);
      if (t === null) { return; }
      if (n.tagName === "IMG") { n.setAttribute("alt", t); }
      else { n.setAttribute("aria-label", t); }
    });
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

  function prefersReduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
     9. Hero assembly sequence
     ----------------------------------------------------------------------
     Eight frames of one house, stacked, revealed over each other as the
     visitor scrolls.

     Every layer's state is a pure function of one number: how far through
     the hero's scroll track we are. Nothing is triggered, queued or played,
     so scrolling back up is not a reverse animation — it is the same
     function evaluated at a smaller number, and the house comes apart slab
     by slab exactly the way it went together. Stop halfway and it stops
     halfway.

     The markup ships with every layer visible and the pin inert. This adds
     the class that switches the sequence on, so a JS failure, an old
     browser or reduced motion all resolve to the finished house with the
     name in place.
     ====================================================================== */
  /* ======================================================================
     9. Hero video
     ----------------------------------------------------------------------
     One video, played once on load, holding on its last frame.

     It never loops. A build that restarts every ten seconds reads as a
     glitch and throws away the finished-home ending, which is the frame
     the business name sits on.

     Nobody is held hostage by it either: the first scroll, tap or keypress
     jumps to the end. That matters more than the animation does - this is
     a contractor's site and the visitor came for a phone number, which
     stays in the sticky header throughout.

     Every failure lands on the poster frame: no file yet, a codec the
     browser refuses, autoplay blocked by the OS, JavaScript off, or
     reduced motion. There is no state where the hero is a blank box.
     ====================================================================== */
  function heroVideo() {
    var hero = $("#hero");
    var video = $("#hero-video");
    if (!hero || !video) { return; }

    // The stage sits under the sticky header. Measure it rather than
    // hard-coding: the header is two rows on a phone and one on a desktop.
    var header = document.querySelector("header");
    function setHeaderVar() {
      var h = header ? Math.round(header.getBoundingClientRect().height) : 0;
      document.documentElement.style.setProperty("--hdr", h + "px");
    }
    setHeaderVar();
    window.addEventListener("resize", setHeaderVar);

    video.loop = false;
    video.muted = true;             // set in the markup too; autoplay needs it
    video.playsInline = true;

    /* --------------------------------------------------------------------
       Parking on the last frame.

       Assigning currentTime near the duration looks like it should be
       enough, and is not: a browser can only seek inside what it has
       buffered, and a seek past that is silently dropped and the video
       resets to zero. That put the SKETCH on screen instead of the
       finished house - the worst possible frame to land on, and the one
       every fallback path uses.

       So: seek as far as the buffer currently allows, then keep trying as
       more of the file arrives, and stop as soon as we are actually there.
       -------------------------------------------------------------------- */
    var wantEnd = false;
    var lastTarget = -1;
    var WATCH = ["loadedmetadata", "loadeddata", "progress", "canplaythrough", "seeked"];

    function atEnd() {
      var d = video.duration;
      return isFinite(d) && d > 0 && video.currentTime >= d - 0.25;
    }

    function stopWatching() {
      WATCH.forEach(function (ev) { video.removeEventListener(ev, tryEnd); });
    }

    function tryEnd() {
      if (!wantEnd) { return; }
      if (atEnd()) { stopWatching(); return; }

      var d = video.duration;
      if (!isFinite(d) || d <= 0) { return; }        // metadata not in yet

      var target = d - 0.05;
      var sk = video.seekable;
      if (sk && sk.length) {
        var buffered = sk.end(sk.length - 1);
        if (buffered < target) { target = buffered - 0.05; }
      }
      if (target <= 0) { return; }

      // Only seek when the buffer has actually grown. Without this, `seeked`
      // re-fires tryEnd, which seeks to the same spot, which fires `seeked`
      // again - a tight loop that pins the main thread and never settles.
      if (target <= lastTarget + 0.01) { return; }
      lastTarget = target;
      try { video.currentTime = target; } catch (e) {}
    }

    function goToEnd() {
      wantEnd = true;
      // Each of these means "there may be more of the file now".
      WATCH.forEach(function (ev) { video.addEventListener(ev, tryEnd); });
      tryEnd();
    }

    // Reduced motion: never play. Park on the final frame, so the still is
    // the finished house rather than a sketch nobody asked to sit through.
    if (prefersReduced()) {
      video.pause();
      goToEnd();
      return;
    }

    var done = false;

    function finish() {
      if (done) { return; }
      done = true;
      try { video.pause(); } catch (e) {}
      goToEnd();
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    }

    function skip(ev) {
      // A modifier-key shortcut is not an attempt to dismiss the opener.
      if (ev && ev.type === "keydown" && (ev.metaKey || ev.ctrlKey || ev.altKey)) { return; }
      finish();
    }

    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);

    // Played out on its own: hold, do not rewind and do not loop.
    video.addEventListener("ended", function () {
      done = true;
      goToEnd();
    });

    // A rejected play() is not an error worth surfacing: a blocked autoplay
    // leaves the poster showing, which is a perfectly good hero.
    var attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {});
    }
  }

  /* ======================================================================
     10. Boot
     ====================================================================== */
  // Blocks first: everything after this point expects the page to exist.
  // applyConfig fills in phone links, the language switch reads the text,
  // and the lightbox binds to the photographs — none of which are in the
  // document until the blocks are rendered.
  if (window.RENDER) {
    window.RENDER.blocks(document.getElementById("canvas"), window.BLOCKS);
    window.RENDER.nav(window.BLOCKS);
  }

  applyConfig();
  heroVideo();

  var yr = $("#yr");
  if (yr) { yr.textContent = String(new Date().getFullYear()); }

  var saved = null;
  try { saved = localStorage.getItem("cc-lang"); } catch (e) {}
  if (!saved && (navigator.language || "").toLowerCase().indexOf("es") === 0) { saved = "es"; }
  if (saved === "es") { setLang("es"); }
})();
