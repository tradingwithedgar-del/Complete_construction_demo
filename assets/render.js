/* ==========================================================================
   Block renderer
   --------------------------------------------------------------------------
   Turns window.BLOCKS into the page below the hero.

   The live site and the editor both call this, so the editor canvas is the
   real page rather than an approximation of it. If a block looks right while
   you are editing it looks right on the site, because it is the same
   function producing the same markup.

   Every block is { id, type, nav?, props }. `nav` gives it an anchor and a
   navigation label; leave it off and the block has neither.

   EDIT MODE
   Set window.__EDIT__ = true before rendering and every piece of text comes
   out contenteditable, carrying a data-path that says which property it
   writes back to ("props.text", "props.items.2.title", …). That is the whole
   mechanism behind editing in place: there is no second copy of the content
   to keep in sync.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.SITE || {};
  function edit() { return window.__EDIT__ === true; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) { n.className = cls; }
    if (text != null) { n.textContent = text; }
    return n;
  }

  /* Bilingual text. A block stores `text` and optionally `textEs`; both go on
     the element as the data-en/data-es pair the language switch already
     understands, so translation keeps working with no extra wiring.
     `path` is only used in edit mode. */
  function bi(node, en, es, path) {
    node.textContent = en || "";
    node.setAttribute("data-en", en || "");
    node.setAttribute("data-es", (es && String(es).trim()) ? es : (en || ""));
    if (path && edit()) {
      node.setAttribute("contenteditable", "plaintext-only");
      node.setAttribute("data-path", path);
      node.setAttribute("spellcheck", "false");
    }
    return node;
  }

  function wrap(inner) {
    var w = el("div", "wrap");
    w.appendChild(inner);
    return w;
  }

  /* ---------------------------------------------------------------- */
  /* Block types                                                      */
  /* ---------------------------------------------------------------- */
  var TYPES = {

    heading: function (p) {
      var box = el("div", "b-head");
      box.appendChild(bi(el(p.level === "h3" ? "h3" : "h2"), p.text, p.textEs, "props.text"));
      if ((p.sub && p.sub.trim()) || edit()) {
        box.appendChild(bi(el("p", "b-sub"), p.sub, p.subEs, "props.sub"));
      }
      return box;
    },

    text: function (p) {
      var box = el("div", "b-text");
      box.appendChild(bi(el("p"), p.text, p.textEs, "props.text"));
      return box;
    },

    /* Editorial rows. Rows rather than a grid of identical cards, because a
       uniform card grid is a layout that says nothing about its contents. */
    rows: function (p) {
      var list = el("div", "b-rows");
      (p.items || []).forEach(function (item, i) {
        var row = el("article", "b-row");
        row.setAttribute("data-item", String(i));
        row.appendChild(bi(el("h3"), item.title, item.titleEs, "props.items." + i + ".title"));
        row.appendChild(bi(el("p"), item.body, item.bodyEs, "props.items." + i + ".body"));
        list.appendChild(row);
      });
      return list;
    },

    facts: function (p) {
      var ul = el("ul", "b-facts");
      (p.items || []).forEach(function (item, i) {
        var li = bi(el("li"), item.text, item.textEs, "props.items." + i + ".text");
        li.setAttribute("data-item", String(i));
        ul.appendChild(li);
      });
      return ul;
    },

    /* Two lists side by side. The proposal's Included / Not included. */
    ledger: function (p) {
      var g = el("div", "b-ledger");
      [
        { k: "a", title: p.titleA, titleEs: p.titleAEs, items: p.itemsA },
        { k: "b", title: p.titleB, titleEs: p.titleBEs, items: p.itemsB }
      ].forEach(function (col) {
        var c = el("div", "b-led b-led-" + col.k);
        var hd = el("div", "b-led-h");
        hd.appendChild(bi(el("h3"), col.title, col.titleEs,
          "props.title" + col.k.toUpperCase()));
        c.appendChild(hd);
        var ul = el("ul");
        (col.items || []).forEach(function (item, i) {
          var li = bi(el("li"), item.text, item.textEs,
            "props.items" + col.k.toUpperCase() + "." + i + ".text");
          li.setAttribute("data-item", col.k + i);
          ul.appendChild(li);
        });
        c.appendChild(ul);
        g.appendChild(c);
      });
      return g;
    },

    /* Photographs, drawn from the manifest in site.config.js so there is
       still exactly one place photos are listed. */
    gallery: function (p) {
      var box = el("div", "b-gal");
      var images = ((CFG.gallery && CFG.gallery.images) || []).filter(function (img) {
        if (img.pending === true) { return false; }
        return !p.category || p.category === "all" || img.category === p.category;
      });
      if (p.limit) { images = images.slice(0, Number(p.limit)); }

      if (!images.length) {
        box.appendChild(el("p", "b-empty", "No photographs in this category yet."));
        return box;
      }

      var grid = el("div", "b-grid");
      grid.setAttribute("data-gallery", "blk-" + (p.category || "all"));
      grid.style.setProperty("--cols", String(p.columns || 3));

      images.forEach(function (img, i) {
        var fig = el("figure", "b-tile");
        var btn = el("button");
        btn.type = "button";
        btn.setAttribute("data-full", img.src);
        btn.setAttribute("data-caption", img.alt || "");
        var im = el("img");
        im.src = img.src;
        im.alt = img.alt || "";
        im.loading = i < 4 ? "eager" : "lazy";
        im.decoding = "async";
        // A photo listed before its file is committed drops out rather than
        // leaving a broken tile on the page.
        im.addEventListener("error", function () { fig.remove(); });
        btn.appendChild(im);
        fig.appendChild(btn);
        grid.appendChild(fig);
      });
      box.appendChild(grid);
      return box;
    },

    image: function (p) {
      var fig = el("figure", "b-img");
      var im = el("img");
      im.src = p.src || "";
      im.alt = p.alt || "";
      im.loading = "lazy";
      im.decoding = "async";
      fig.appendChild(im);
      if ((p.caption && p.caption.trim()) || edit()) {
        fig.appendChild(bi(el("figcaption", "mono"), p.caption, p.captionEs, "props.caption"));
      }
      return fig;
    },

    buttons: function (p) {
      var box = el("div", "b-btns");
      (p.items || []).forEach(function (item, i) {
        var a = el("a", "btn " + (item.style === "ghost" ? "btn-ghost" : "btn-primary"));
        a.href = item.href || "#";
        a.appendChild(bi(el("span"), item.label, item.labelEs, "props.items." + i + ".label"));
        box.appendChild(a);
      });
      return box;
    },

    /* The number itself comes from site.config.js, so it is changed in one
       place and never retyped into a block. */
    phone: function (p) {
      var b = CFG.business || {};
      var a = el("a", "b-phone");
      a.href = "tel:" + (b.phoneE164 || "");
      a.setAttribute("data-phone-link", "");
      a.appendChild(bi(el("span", "mono"), p.label || "Call", p.labelEs || "Llame", "props.label"));
      var strong = el("strong", null, b.phoneDisplay || "");
      strong.setAttribute("data-phone-display", "");
      a.appendChild(strong);
      return a;
    },

    divider: function () { return el("div", "b-rule"); },

    spacer: function (p) {
      var d = el("div", "b-spacer");
      d.style.height = (Number(p.size) || 40) + "px";
      return d;
    }
  };

  /* Labels and the shape of a new one. The editor reads both, so adding a
     block type here is all it takes for it to appear in the palette. */
  var META = {
    heading:  { label: "Heading",        make: function () { return { text: "New heading", sub: "" }; } },
    text:     { label: "Paragraph",      make: function () { return { text: "New paragraph." }; } },
    rows:     { label: "Row list",       make: function () { return { items: [{ title: "Item", body: "Description." }] }; } },
    facts:    { label: "Marked list",    make: function () { return { items: [{ text: "First point" }] }; } },
    ledger:   { label: "Two columns",    make: function () { return { titleA: "Included", itemsA: [{ text: "First" }], titleB: "Not included", itemsB: [{ text: "First" }] }; } },
    gallery:  { label: "Photographs",    make: function () { return { category: "bathrooms", columns: 3, width: "wide" }; } },
    image:    { label: "Single image",   make: function () { return { src: "images/logo-badge.png", alt: "", caption: "" }; } },
    buttons:  { label: "Buttons",        make: function () { return { items: [{ label: "Call", href: "tel:+17328906244", style: "primary" }] }; } },
    phone:    { label: "Phone panel",    make: function () { return { label: "Call" }; } },
    divider:  { label: "Divider",        make: function () { return {}; } },
    spacer:   { label: "Spacer",         make: function () { return { size: 60 }; } }
  };

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */
  function renderBlock(block) {
    var build = TYPES[block.type];
    if (!build) { return null; }

    var p = block.props || {};
    var sec = document.createElement("section");
    sec.className = "blk blk-" + block.type;
    sec.setAttribute("data-block-id", block.id);
    if (p.background) { sec.classList.add("bg-" + p.background); }
    if (p.width)      { sec.classList.add("w-" + p.width); }
    if (p.align === "center") { sec.classList.add("is-center"); }
    if (p.tight)      { sec.classList.add("is-tight"); }

    if (block.nav && block.nav.id) { sec.id = block.nav.id; }

    sec.appendChild(wrap(build(p)));
    return sec;
  }

  function renderBlocks(host, blocks) {
    host = host || document.getElementById("canvas");
    if (!host) { return; }
    blocks = blocks || window.BLOCKS || [];
    host.textContent = "";
    blocks.forEach(function (b) {
      var node = renderBlock(b);
      if (node) { host.appendChild(node); }
    });
  }

  /* Navigation is derived from the blocks that asked for it, so adding a
     section adds its link and removing it removes the link. A nav pointing at
     a section that is no longer on the page is exactly the rot this avoids. */
  function renderNav(blocks) {
    blocks = blocks || window.BLOCKS || [];
    var linked = blocks.filter(function (b) { return b.nav && b.nav.id && b.nav.label; });

    [".nav-links", "#drawer nav"].forEach(function (sel) {
      var host = document.querySelector(sel);
      if (!host) { return; }
      host.textContent = "";
      linked.forEach(function (b) {
        var a = document.createElement("a");
        a.href = "#" + b.nav.id;
        bi(a, b.nav.label, b.nav.labelEs);
        host.appendChild(a);
      });
    });
  }

  window.RENDER = {
    blocks: renderBlocks,
    nav: renderNav,
    one: renderBlock,
    meta: META,
    types: Object.keys(TYPES)
  };
})();
