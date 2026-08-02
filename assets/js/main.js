/* ============================================================
   Dhanvanth Kumar Gude — portfolio interactions
   No dependencies. Everything degrades gracefully.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Theme ---------- */
  var toggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
    try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      drawLattice();
    });
    applyTheme(root.getAttribute('data-theme') || 'dark');
  }

  /* ---------- 2. Mobile menu ---------- */
  var menuBtn = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 3. Scroll progress, sticky header, active link ---------- */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('scrollProgress');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.body.scrollHeight - window.innerHeight;

    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('is-stuck', y > 8);

    var currentId = '';
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop - 140 <= y) currentId = sections[i].id;
    }
    links.forEach(function (a) {
      a.classList.toggle('is-current', a.getAttribute('href') === '#' + currentId);
    });
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- 4. Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal, .zk-viz');

  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
      io.observe(el);
    });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 5. Headline resolve ---------- */
  var resolveEl = document.querySelector('.resolve');

  if (resolveEl) {
    var final = resolveEl.getAttribute('data-final') || resolveEl.textContent;
    if (reduced) {
      resolveEl.textContent = final;
    } else {
      var glyphs = '01#$%&*<>[]{}/\\@=+~';
      var frame = 0;
      resolveEl.classList.add('is-masked');

      var timer = setInterval(function () {
        frame++;
        var settled = Math.floor(frame / 2.2);
        var out = '';
        for (var i = 0; i < final.length; i++) {
          if (final[i] === ' ') { out += ' '; continue; }
          out += i < settled ? final[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
        }
        resolveEl.textContent = out;
        if (settled >= final.length) {
          clearInterval(timer);
          resolveEl.textContent = final;
          resolveEl.classList.remove('is-masked');
        }
      }, 45);
    }
  }

  /* ---------- 6. Lattice field (hero background) ---------- */
  var canvas = document.getElementById('lattice');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  var points = [];
  var raf = null;

  function buildPoints(w, h) {
    points = [];
    var step = w < 620 ? 62 : 48;
    for (var x = -step; x < w + step; x += step) {
      for (var y = -step; y < h + step; y += step) {
        points.push({ x: x, y: y, ox: x, oy: y, p: Math.random() * Math.PI * 2 });
      }
    }
  }

  function drawLattice() {
    if (!ctx) return;
    var styles = getComputedStyle(root);
    var dot = styles.getPropertyValue('--accent').trim() || '#587BFF';
    var w = canvas.width / (window.devicePixelRatio || 1);
    var h = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = dot;
    ctx.strokeStyle = dot;

    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      ctx.globalAlpha = 0.42;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.25, 0, Math.PI * 2);
      ctx.fill();

      for (var j = i + 1; j < points.length; j++) {
        var q = points[j];
        var dx = p.x - q.x, dy = p.y - q.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 4400) {
          ctx.globalAlpha = 0.14 * (1 - d2 / 4400);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  function sizeCanvas() {
    if (!canvas) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildPoints(rect.width, rect.height);
    drawLattice();
  }

  function animateLattice(t) {
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      p.x = p.ox + Math.sin(t / 2600 + p.p) * 7;
      p.y = p.oy + Math.cos(t / 3100 + p.p) * 7;
    }
    drawLattice();
    raf = window.requestAnimationFrame(animateLattice);
  }

  if (ctx) {
    sizeCanvas();
    if (!reduced && window.innerWidth > 620) raf = window.requestAnimationFrame(animateLattice);

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(sizeCanvas, 180);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = null; }
      else if (!document.hidden && !raf && !reduced && window.innerWidth > 620) {
        raf = window.requestAnimationFrame(animateLattice);
      }
    });
  }

  /* ---------- 7. Differential privacy console ---------- */
  var barsBox = document.getElementById('bars');
  var eps = document.getElementById('eps');

  if (barsBox && eps) {
    var N = 40;
    var SENSITIVITY = 1;
    var truth = [];
    for (var k = 0; k < N; k++) {
      // A stable, deterministic "true histogram" of tool calls per agent.
      truth.push(6 + 5 * Math.sin(k / 3.4) + 3 * Math.cos(k / 1.7) + (k % 5));
    }

    var barEls = [];
    for (var b = 0; b < N; b++) {
      var el = document.createElement('i');
      barsBox.appendChild(el);
      barEls.push(el);
    }

    function laplace(scale) {
      var u = Math.random() - 0.5;
      return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
    }

    var rEps = document.getElementById('rEps');
    var rB = document.getElementById('rB');
    var rErr = document.getElementById('rErr');
    var rLabel = document.getElementById('rLabel');
    var rRisk = document.getElementById('rRisk');
    var riskBar = document.getElementById('riskBar');

    function render() {
      var e = parseFloat(eps.value);
      var scale = SENSITIVITY / e;
      var total = 0;

      for (var i = 0; i < N; i++) {
        var noisy = truth[i] + laplace(scale);
        total += Math.abs(noisy - truth[i]);
        var pct = Math.max(4, Math.min(100, (noisy / 22) * 100));
        barEls[i].style.height = pct + '%';
        barEls[i].classList.toggle('ghost', noisy < 0);
      }

      var risk = ((Math.exp(e) - 1) / (Math.exp(e) + 1)) * 100;

      rEps.textContent = e.toFixed(2);
      rB.textContent = scale.toFixed(2);
      rErr.textContent = (total / N).toFixed(2);
      rRisk.textContent = Math.round(risk) + '%';
      riskBar.style.width = risk.toFixed(1) + '%';

      var verdict = e <= 0.5 ? 'strong' : e <= 2 ? 'moderate' : 'weak';
      rLabel.textContent = verdict;
      rLabel.className = 'verdict ' + verdict;
    }

    eps.addEventListener('input', render);
    render();

    // Gentle re-sampling so the noise reads as live, not static.
    if (!reduced) {
      setInterval(function () {
        if (!document.hidden) render();
      }, 1600);
    }
  }

  /* ---------- 8. Publication filter ---------- */
  var filters = document.querySelectorAll('.filter');
  var pubs = document.querySelectorAll('.pub');
  var emptyMsg = document.getElementById('pubsEmpty');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.getAttribute('data-filter');
      var shown = 0;

      filters.forEach(function (f) {
        var active = f === btn;
        f.classList.toggle('is-active', active);
        f.setAttribute('aria-pressed', String(active));
      });

      pubs.forEach(function (p) {
        var match = type === 'all' || p.getAttribute('data-type') === type;
        p.hidden = !match;
        if (match) { shown++; p.classList.add('in'); }
      });

      if (emptyMsg) emptyMsg.hidden = shown !== 0;
    });
  });

  /* ---------- 9. Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
