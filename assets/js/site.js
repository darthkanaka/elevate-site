/* ==========================================================================
   Elevate Media HI

   One IIFE per effect so any of them can be deleted without touching the
   others. GSAP is optional throughout: where it is missing, the effect either
   degrades to a CSS transition or does not run at all, and the page stays
   complete either way.

   Three rules every effect here follows, because the reference build we took
   these from broke all three:
     1. Nothing animates when the visitor asked for reduced motion.
     2. No loop runs while its section is off screen or the tab is hidden.
     3. Content is never left hidden if the script fails.
   ========================================================================== */

(function () {
  "use strict";

  /* -- Shared gate ------------------------------------------------------- */

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  var wide = window.matchMedia("(min-width: 901px)");
  var hasGsap = typeof window.gsap !== "undefined";
  var hasST = hasGsap && typeof window.ScrollTrigger !== "undefined";

  if (hasST) window.gsap.registerPlugin(window.ScrollTrigger);

  function motionOK() { return !reduced.matches; }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function debounce(fn, ms) {
    var t;
    return function () {
      var a = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, a); }, ms || 160);
    };
  }

  /* A loop that only runs while its element is on screen and the tab is
     visible. Every canvas and marquee in this file goes through it, which is
     the single fix for the always-on animation problem. */
  function visibleLoop(el, step) {
    var raf = 0, onScreen = false;

    function frame(t) {
      if (!onScreen || document.hidden) { raf = 0; return; }
      step(t);
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(frame); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        onScreen ? start() : stop();
      }, { rootMargin: "120px" }).observe(el);
    } else {
      onScreen = true;
      start();
    }

    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });

    return { stop: stop, start: start };
  }

  /* Sizes a canvas to its box in real device pixels. Skipping this is why the
     reference build rendered blurry on every Retina screen. */
  function fitCanvas(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: r.width, h: r.height };
  }

  /* -- 01  Nav ----------------------------------------------------------- */

  (function nav() {
    var bar = $(".nav");
    if (!bar) return;

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        bar.classList.toggle("stuck", window.scrollY > 50);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var burger = $(".burger");
    var menu = $(".nav-menu");
    if (!burger || !menu) return;

    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      menu.hidden = false;
      burger.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
      var first = $("a, button", menu);
      if (first) first.focus();
    }
    function close() {
      menu.hidden = true;
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      if (lastFocus) lastFocus.focus();
    }
    function isOpen() { return burger.getAttribute("aria-expanded") === "true"; }

    burger.addEventListener("click", function () { isOpen() ? close() : open(); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });

    document.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      // Keep focus inside the open menu.
      var items = $$("a, button", menu).filter(function (n) { return n.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // A resize past the breakpoint should not leave the overlay stranded.
    window.addEventListener("resize", debounce(function () {
      if (window.innerWidth > 860 && isOpen()) close();
    }, 200));
  })();

  /* -- 02  Reveal on scroll ---------------------------------------------- */
  /* Attribute driven, so new sections need no new JavaScript. Fires once,
     then stops observing. */

  (function reveal() {
    var items = $$("[data-reveal], .line");
    if (!items.length) return;

    function showAll() { items.forEach(function (el) { el.classList.add("in"); }); }

    if (!motionOK() || !("IntersectionObserver" in window)) { showAll(); return; }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (el, i) {
      // Stagger siblings without needing a delay on every element in the HTML.
      if (!el.style.getPropertyValue("--d")) {
        var sibs = el.parentElement ? $$("[data-reveal], .line", el.parentElement) : [];
        var idx = sibs.indexOf(el);
        if (idx > 0) el.style.setProperty("--d", Math.min(idx, 6) * 90 + "ms");
      }
      io.observe(el);
    });
  })();

  /* -- 03  Count up ------------------------------------------------------ */

  (function counters() {
    var nums = $$("[data-count]");
    if (!nums.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      if (isNaN(target)) return;
      if (!motionOK()) { el.textContent = target + suffix; return; }

      var start = performance.now(), dur = 1600;
      (function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    }

    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* -- 04  Hero particle field ------------------------------------------- */
  /* Drifting points joined by short lines, pushed away by the cursor. The
     count scales with viewport area and is hard capped, the neighbour search
     is skipped entirely on small screens, and the whole loop is gated. */

  (function particles() {
    var canvas = $("#hero-canvas");
    if (!canvas || !motionOK()) { if (canvas) canvas.remove(); return; }

    var size = fitCanvas(canvas);
    var ctx = size.ctx, W = size.w, H = size.h;
    var link = W > 700;
    var pts = [];
    var pointer = { x: -999, y: -999 };

    function build() {
      var n = Math.min(Math.round(W * H / 16000), link ? 90 : 34);
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.24,
          vy: (Math.random() - 0.5) * 0.24,
          r: Math.random() * 1.4 + 0.5
        });
      }
    }
    build();

    window.addEventListener("resize", debounce(function () {
      size = fitCanvas(canvas);
      ctx = size.ctx; W = size.w; H = size.h; link = W > 700;
      build();
    }, 220));

    if (fine.matches) {
      canvas.parentElement.addEventListener("pointermove", function (e) {
        var r = canvas.getBoundingClientRect();
        pointer.x = e.clientX - r.left;
        pointer.y = e.clientY - r.top;
      }, { passive: true });
      canvas.parentElement.addEventListener("pointerleave", function () {
        pointer.x = pointer.y = -999;
      }, { passive: true });
    }

    visibleLoop(canvas, function () {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // Push out of a radius around the cursor.
        var dx = p.x - pointer.x, dy = p.y - pointer.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 22500 && d2 > 0.01) {
          var d = Math.sqrt(d2), f = (150 - d) / 150 * 1.6;
          p.x += dx / d * f; p.y += dy / d * f;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fillStyle = "rgba(255,124,26,.55)";
        ctx.fill();

        if (!link) continue;
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j];
          var ax = p.x - q.x, ay = p.y - q.y;
          var a2 = ax * ax + ay * ay;
          if (a2 > 12100) continue;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = "rgba(255,124,26," + (0.12 * (1 - a2 / 12100)).toFixed(3) + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });
  })();

  /* -- 05  Magnetic buttons ---------------------------------------------- */

  (function magnetic() {
    if (!motionOK() || !fine.matches) return;
    var els = $$("[data-magnetic]");
    if (!els.length) return;

    els.forEach(function (el) {
      var raf = 0, tx = 0, ty = 0;

      function apply() { el.style.transform = "translate3d(" + tx + "px," + ty + "px,0)"; raf = 0; }

      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        var dist = Math.hypot(dx, dy);
        var reach = Math.max(r.width, r.height) * 0.9;
        if (dist > reach) return;
        tx = dx * 0.28; ty = dy * 0.34;
        if (!raf) raf = requestAnimationFrame(apply);
      }, { passive: true });

      el.addEventListener("pointerleave", function () {
        tx = ty = 0;
        el.style.transition = "transform .55s cubic-bezier(.22,1,.36,1)";
        if (!raf) raf = requestAnimationFrame(apply);
        setTimeout(function () { el.style.transition = ""; }, 560);
      }, { passive: true });
    });
  })();

  /* -- 06  Tilt cards with glare ----------------------------------------- */
  /* The glare gradient angle is read from the cursor position. Box shadow is
     deliberately not animated here: it is not compositor accelerated and
     repainting it on every pointer move is what made the reference build
     stutter. */

  (function tilt() {
    if (!motionOK() || !fine.matches) return;
    var cards = $$("[data-tilt]");
    if (!cards.length) return;

    cards.forEach(function (card) {
      var glare = $(".card-glare", card);
      var raf = 0, rx = 0, ry = 0, ga = 0, gx = 50, gy = 50;

      function apply() {
        card.style.transform =
          "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
        if (glare) {
          glare.style.background =
            "linear-gradient(" + ga.toFixed(0) + "deg, rgba(255,124,26,.30) 0%, rgba(255,255,255,.06) 42%, transparent 68%)";
          glare.style.opacity = "1";
        }
        raf = 0;
      }

      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        ry = (px - 0.5) * 11;
        rx = (0.5 - py) * 11;
        gx = px * 100; gy = py * 100;
        ga = Math.atan2(py - 0.5, px - 0.5) * 180 / Math.PI + 90;
        if (!raf) raf = requestAnimationFrame(apply);
      }, { passive: true });

      card.addEventListener("pointerleave", function () {
        rx = ry = 0;
        card.style.transition = "transform .7s cubic-bezier(.22,1,.36,1)";
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
        if (glare) glare.style.opacity = "0";
        setTimeout(function () { card.style.transition = ""; }, 720);
      }, { passive: true });
    });
  })();

  /* -- 07  Service card video on hover ----------------------------------- */

  (function cardVideo() {
    $$(".card-media video").forEach(function (v) {
      var card = v.closest(".card");
      if (!card) return;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;

      if (!motionOK() || !fine.matches) { v.remove(); return; }

      card.addEventListener("pointerenter", function () {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      });
      card.addEventListener("pointerleave", function () { v.pause(); });
    });
  })();

  /* -- 08  Kinetic type -------------------------------------------------- */
  /* The track scrolls forever while characters shift away from the cursor.

     Position cannot be cached here. The marquee moves continuously, so a
     rectangle measured even a moment ago is already wrong, and caching all of
     them is what made the reference version feel offset. Measuring all of them
     every frame is the other extreme: there are a couple of hundred spans.

     So hit test for the word under the pointer and measure only that word and
     its two neighbours. Around twenty rectangles a frame, always current. The
     test targets the word rather than the character because characters slide
     out from under the cursor, and hit testing a moving target makes them
     flicker between pushed and released. */

  (function kinetic() {
    var band = document.querySelector(".kinetic");
    if (!band) return;

    // Split every word into characters up front. This runs even when the
    // repulsion does not, so the markup stays identical in both cases.
    $$(".kword", band).forEach(function (w) {
      var text = w.textContent;
      w.textContent = "";
      for (var i = 0; i < text.length; i++) {
        var c = document.createElement("span");
        c.className = "kchar";
        c.textContent = text[i];
        w.appendChild(c);
      }
    });

    if (!motionOK() || !fine.matches) return;

    var RADIUS = 150;
    var PUSH = 24;
    var moved = [];
    var raf = 0, mx = -9999, my = -9999;

    function release() {
      for (var i = 0; i < moved.length; i++) moved[i].style.transform = "";
      moved.length = 0;
    }

    function push() {
      raf = 0;
      release();
      if (mx < 0) return;

      // Probe left, centre and right. A single probe finds nothing while the
      // pointer sits in the gap between two words, which left dead patches
      // along the band even though characters were well inside the radius.
      var group = [];
      for (var k = -1; k <= 1; k++) {
        var hit = document.elementFromPoint(mx + k * RADIUS * 0.6, my);
        var w = hit && hit.closest ? hit.closest(".kword") : null;
        if (w && group.indexOf(w) === -1) group.push(w);
      }
      if (!group.length) return;

      for (var g = 0; g < group.length; g++) {
        var chars = group[g].getElementsByClassName("kchar");
        for (var i = 0; i < chars.length; i++) {
          var c = chars[i];
          var r = c.getBoundingClientRect();
          var dx = r.left + r.width / 2 - mx;
          var dy = r.top + r.height / 2 - my;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d >= RADIUS || d < 0.01) continue;
          var f = (RADIUS - d) / RADIUS * PUSH;
          c.style.transform =
            "translate(" + (dx / d * f).toFixed(1) + "px," + (dy / d * f).toFixed(1) + "px)";
          moved.push(c);
        }
      }
    }

    band.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(push);
    }, { passive: true });

    band.addEventListener("pointerleave", function () {
      mx = my = -9999;
      if (!raf) raf = requestAnimationFrame(push);
    }, { passive: true });
  })();

  /* -- 09  Cursor spotlight on the peak pattern -------------------------- */

  (function spotlight() {
    if (!motionOK() || !fine.matches) return;
    $$("[data-spotlight]").forEach(function (sec) {
      var raf = 0, x = 0, y = 0;

      function apply() {
        sec.style.setProperty("--mx", x + "px");
        sec.style.setProperty("--my", y + "px");
        raf = 0;
      }

      sec.addEventListener("pointermove", function (e) {
        var r = sec.getBoundingClientRect();
        x = e.clientX - r.left; y = e.clientY - r.top;
        sec.classList.add("pat-lit");
        if (!raf) raf = requestAnimationFrame(apply);
      }, { passive: true });

      sec.addEventListener("pointerleave", function () {
        sec.classList.remove("pat-lit");
      }, { passive: true });
    });
  })();

  /* -- 10  Pinned horizontal work rail ----------------------------------- */
  /* Desktop with a real pointer only. Everywhere else the CSS turns the same
     markup into a native scroll-snap row, which is far more reliable on touch
     than hijacking the scroll. */

  (function hscroll() {
    var sec = $(".hscroll");
    var track = $(".hs-track");
    if (!sec || !track) return;
    if (!hasST || !motionOK() || !wide.matches || !fine.matches) return;

    var bar = $(".hs-bar i");

    window.gsap.to(track, {
      x: function () { return -(track.scrollWidth - window.innerWidth + 40); },
      ease: "none",
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: function () { return "+=" + (track.scrollWidth - window.innerWidth + 40); },
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          if (bar) bar.style.transform = "scaleX(" + (0.14 + self.progress * 6.1).toFixed(3) + ")";
        }
      }
    });

    window.addEventListener("resize", debounce(function () {
      window.ScrollTrigger.refresh();
    }, 250));
  })();

  /* -- 11  SVG path drawing ---------------------------------------------- */

  (function drawPaths() {
    var paths = $$("[data-draw] path");
    if (!paths.length) return;

    if (!motionOK() || !("IntersectionObserver" in window)) return;

    paths.forEach(function (p) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$("path", e.target).forEach(function (p, i) {
          p.style.transition = "stroke-dashoffset 2s cubic-bezier(.16,1,.3,1) " + (i * 0.28) + "s";
          p.style.strokeDashoffset = "0";
        });
        obs.unobserve(e.target);
      });
    }, { threshold: 0.25 });

    $$("[data-draw]").forEach(function (svg) { io.observe(svg); });
  })();

  /* -- 12  Anchor scrolling ---------------------------------------------- */
  /* A bare "#" is not a selector. Not guarding for it is what made every
     footer link in the reference build throw on click. */

  (function anchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href || href === "#") return;
      var target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: motionOK() ? "smooth" : "auto", block: "start" });
      if (history.replaceState) history.replaceState(null, "", href);
    });
  })();

  /* -- 13  Contact form -------------------------------------------------- */
  /* No backend is wired yet, so the form says so plainly instead of playing an
     animation and pretending. TODO-LAUNCH: post to the real endpoint. */

  (function form() {
    var f = $(".form");
    if (!f) return;
    var status = $(".form-status", f);

    f.addEventListener("submit", function (e) {
      if (!f.getAttribute("action")) {
        e.preventDefault();
        if (!status) return;
        status.hidden = false;
        status.textContent =
          "This form is not connected yet. Email kawika@elevatemediahi.com or call 808 232 6959 and you will get a reply the same day.";
        status.focus && status.focus();
      }
    });
  })();

  /* -- 14  Footer year --------------------------------------------------- */

  (function year() {
    var el = $("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  })();
})();
