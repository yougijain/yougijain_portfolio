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

  /* ---- Shadow/border on nav once scrolled ---- */
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

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
})();
