/* ============================================================
   main.js — small, dependency-free interactions
   Keep it minimal; add to it as the site grows.
   ============================================================ */
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelectorAll(".nav__links a");

  /* ---- Current year in footer ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Theme toggle (light/dark) ----
     The initial theme is applied pre-paint by the inline <head> script.
     Here we wire the button and keep tracking the system preference
     until the user makes an explicit choice. */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");

  const setTheme = (t) => {
    root.dataset.theme = t;
    try {
      localStorage.setItem("theme", t);
    } catch (e) {}
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(t === "dark"));
  };

  if (themeToggle) {
    // Sync the button to the pre-paint theme, but do NOT persist here —
    // writing localStorage on load would freeze a passive visitor's theme
    // and stop the system-preference listener below from ever firing.
    themeToggle.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
    themeToggle.addEventListener("click", () => {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", (e) => {
    let stored = null;
    try {
      stored = localStorage.getItem("theme");
    } catch (err) {}
    if (!stored) {
      root.dataset.theme = e.matches ? "dark" : "light";
      if (themeToggle) themeToggle.setAttribute("aria-pressed", String(e.matches));
    }
  });

  /* ---- Shadow/border on nav once scrolled + reading progress ---- */
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.style.setProperty("--scroll", max > 0 ? Math.min(window.scrollY / max, 1) : 0);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* ---- Mobile menu toggle ---- */
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    // Close menu after tapping a link
    navLinks.forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Active link highlighting via section in view ----
     A thin horizontal band near the top of the viewport activates
     whichever section is crossing it, so exactly one link stays
     active — including on short sections the old 50% threshold
     could never satisfy. */
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    const linkFor = (id) =>
      document.querySelector('.nav__links a[href="#' + id + '"]');
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkFor(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));

    // Clear all active links at the very top (hero in view).
    const clearAtTop = () => {
      if (window.scrollY < 4) navLinks.forEach((a) => a.classList.remove("is-active"));
    };
    clearAtTop();
    window.addEventListener("scroll", clearAtTop, { passive: true });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---- Hero data grid: light up dots around the cursor ----
     Feeds --mx/--my into the CSS mask on .hero::after. rAF-throttled. */
  const hero = document.querySelector(".hero");
  if (hero && finePointer && !reduceMotion) {
    let mx = -999, my = -999, queued = false;
    const paint = () => {
      queued = false;
      hero.style.setProperty("--mx", mx + "px");
      hero.style.setProperty("--my", my + "px");
    };
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    });
    hero.addEventListener("mouseleave", () => {
      mx = -999; my = -999;
      requestAnimationFrame(paint);
    });
  }

  /* ---- Count-up stats ----
     Any numeric dd in the stat strip / project stats counts up from 0
     when scrolled into view, preserving prefix, commas, decimals, and
     suffix ("37K+", "20.4%", "27,164"). Non-numeric values are skipped. */
  const statEls = document.querySelectorAll(".stat-strip dd, .stats dd");
  if (statEls.length && "IntersectionObserver" in window && !reduceMotion) {
    const animateCount = (el) => {
      const original = el.textContent;
      const m = original.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
      if (!m) return;
      const [, prefix, num, suffix] = m;
      const target = parseFloat(num.replace(/,/g, ""));
      const decimals = (num.split(".")[1] || "").length;
      const useCommas = num.indexOf(",") !== -1;
      const start = performance.now();
      const dur = 1200;
      // rAF pauses in hidden/occluded tabs — make sure the exact final
      // value lands regardless.
      setTimeout(() => { el.textContent = original; }, dur + 100);
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        let v = (target * eased).toFixed(decimals);
        if (useCommas) v = Number(v).toLocaleString("en-US", { minimumFractionDigits: decimals });
        el.textContent = prefix + v + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = original;
      };
      requestAnimationFrame(tick);
    };
    const counter = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            counter.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    statEls.forEach((el) => counter.observe(el));
  }

  /* ---- Eyebrow scramble-in ----
     Letters settle from noise, left to right — a small data-flavored
     signature. Skipped entirely under reduced motion. */
  const eyebrow = document.getElementById("eyebrow");
  if (eyebrow && !reduceMotion) {
    const finalText = eyebrow.textContent;
    const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01";
    const dur = 900;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const settled = Math.floor(t * finalText.length);
      let out = "";
      for (let i = 0; i < finalText.length; i++) {
        const ch = finalText[i];
        out += i < settled || !/[a-z]/i.test(ch)
          ? ch
          : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      eyebrow.textContent = out;
      if (t < 1) requestAnimationFrame(tick);
      else eyebrow.textContent = finalText;
    };
    requestAnimationFrame(tick);
  }

  /* ---- Magnetic buttons ----
     Hero CTAs lean gently toward the cursor. Fine pointers only. */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + dx * 0.12 + "px, " + dy * 0.3 + "px)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---- Local time in footer (Amherst, MA = Eastern) ---- */
  const timeEl = document.getElementById("localTime");
  if (timeEl) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric", minute: "2-digit", timeZone: "America/New_York",
    });
    const showTime = () => { timeEl.textContent = fmt.format(new Date()) + " ET"; };
    showTime();
    setInterval(showTime, 30000);
  }
})();
