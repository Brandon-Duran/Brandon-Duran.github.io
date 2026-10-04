/* brandonduran.dev — interactions (vanilla JS, no dependencies) */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Typing effect ----------
     Edit these roles (and the matching sr-only sentence in index.html). */
  const roles = ["IT Support Engineer @ Amazon", "Network Infrastructure", "Hardware Refresh Lead", "Disaster Response Volunteer"];
  const typedEl = document.getElementById("typed");
  if (typedEl && !reduceMotion) {
    let r = 0, i = roles[0].length, deleting = true;
    const tick = () => {
      const word = roles[r];
      typedEl.textContent = word.slice(0, i);
      let delay = deleting ? 45 : 90;
      if (deleting) {
        i--;
        if (i < 0) { deleting = false; r = (r + 1) % roles.length; i = 0; delay = 350; }
      } else {
        i++;
        if (i > roles[r].length) { deleting = true; i = roles[r].length; delay = 1800; }
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2200);
  }

  /* ---------- Sticky nav background ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Active section highlight ---------- */
  const links = [...document.querySelectorAll(".nav-link")];
  const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  const setActive = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = null;
    sections.forEach((s) => { if (s.offsetTop <= y) current = s.id; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections[sections.length - 1].id;
    links.forEach((l) => {
      const on = l.getAttribute("href") === "#" + current;
      l.classList.toggle("active", on);
      if (on) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
    });
  };
  setActive();
  window.addEventListener("scroll", setActive, { passive: true });

  /* ---------- Scroll reveal + counters ---------- */
  const fmt = (n, el) => n.toLocaleString("en-US") + (el.dataset.suffix || "");
  const countUp = (el) => {
    const target = +el.dataset.count;
    if (reduceMotion) { el.textContent = fmt(target, el); return; }
    const start = performance.now();
    const step = (t) => {
      const p = Math.min((t - start) / 1400, 1);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))), el);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
        el.style.transitionDelay = Math.min(siblings.indexOf(el), 4) * 90 + "ms";
        el.classList.add("visible");
        el.querySelectorAll("[data-count]").forEach(countUp);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
    document.querySelectorAll("[data-count]").forEach(countUp);
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Particle network background ---------- */
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas && canvas.getContext("2d");
  if (!ctx) return;
  let w, h, dpr, particles = [];
  const mouse = { x: -9999, y: -9999 };
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3 * dpr, vy: (Math.random() - 0.5) * 0.3 * dpr,
      r: (Math.random() * 1.4 + 0.6) * dpr,
    }));
  };
  const linkDist = () => 130 * dpr;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const ld = linkDist();
    for (let a = 0; a < particles.length; a++) {
      const p = particles[a];
      for (let b = a + 1; b < particles.length; b++) {
        const q = particles[b];
        const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
        if (d < ld) {
          ctx.strokeStyle = `rgba(124, 92, 255, ${0.22 * (1 - d / ld)})`;
          ctx.lineWidth = dpr * 0.8;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (md < ld * 1.4) {
        ctx.strokeStyle = `rgba(0, 224, 255, ${0.35 * (1 - md / (ld * 1.4))})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = "rgba(200, 210, 255, 0.7)";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
  };
  const update = () => {
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });
  };
  let raf;
  const loop = () => { update(); draw(); raf = requestAnimationFrame(loop); };
  resize();
  window.addEventListener("resize", () => { resize(); if (reduceMotion) draw(); });
  window.addEventListener("pointermove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; }, { passive: true });
  window.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  document.addEventListener("visibilitychange", () => {
    if (reduceMotion) return;
    if (document.hidden) cancelAnimationFrame(raf); else loop();
  });
  if (reduceMotion) draw(); else loop();
})();
