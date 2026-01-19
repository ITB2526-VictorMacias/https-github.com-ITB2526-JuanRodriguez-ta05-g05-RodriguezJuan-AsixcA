(() => {
  const root = document.documentElement;

  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const setNeon = (mode) => {
    root.setAttribute("data-neon", mode);
    try { localStorage.setItem("neon_mode", mode); } catch (_) {}
    const label = qs("[data-neon-label]");
    if (label) label.textContent = mode === "off" ? "OFF" : "ON";
  };

  const initNeonToggle = () => {
    let mode = "on";
    try {
      const saved = localStorage.getItem("neon_mode");
      if (saved === "off" || saved === "on") mode = saved;
    } catch (_) {}
    setNeon(mode);

    qsa("[data-neon-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = root.getAttribute("data-neon") === "off" ? "off" : "on";
        setNeon(current === "on" ? "off" : "on");
      });
    });
  };

  const initCounters = () => {
    const els = qsa("[data-counter]");
    if (!els.length) return;

    const animate = (el) => {
      const target = clamp(parseInt(el.getAttribute("data-counter"), 10) || 0, 0, 9999);
      const start = 0;
      const duration = 900;
      const t0 = performance.now();

      const step = (t) => {
        const p = clamp((t - t0) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = Math.round(start + (target - start) * eased);
        el.textContent = value.toString();
        if (p < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          animate(e.target);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.35 }
    );

    els.forEach((el) => io.observe(el));
  };

  const setFieldState = (input, ok, msg) => {
    input.classList.remove("is-valid", "is-invalid");
    if (ok === true) input.classList.add("is-valid");
    if (ok === false) input.classList.add("is-invalid");

    const field = input.closest(".field");
    if (!field) return;
    const msgEl = qs(".field-msg", field);
    if (msgEl) msgEl.textContent = msg || "";
  };

  const getMessageForInput = (input) => {
    const name = (input.getAttribute("name") || "").toLowerCase();
    const type = (input.getAttribute("type") || "").toLowerCase();
    const tag = input.tagName.toLowerCase();

    if (input.validity.valueMissing) return "Este campo es obligatorio.";

    if (tag === "textarea" && input.validity.tooShort) {
      const min = input.getAttribute("minlength") || "0";
      return `Escribe al menos ${min} caracteres.`;
    }

    if (input.validity.patternMismatch) {
      if (name === "name") return "Solo letras y espacios (2 a 40).";
      if (name === "phone") return "Usa entre 9 y 15 dígitos (solo números).";
      return "Formato no válido.";
    }

    if (type === "email" && input.validity.typeMismatch) {
      return "Email no válido. Ej: correo@email.com";
    }

    if (tag === "select" && input.validity.valueMissing) {
      return "Selecciona un asunto.";
    }

    return "";
  };

  const validateInput = (input) => {
    if (input.type === "checkbox") return input.checked;
    return input.checkValidity();
  };

  const initContactForm = () => {
    const form = qs("[data-contact-form]");
    if (!form) return;

    const status = qs("[data-form-status]", form) || qs("[data-form-status]");
    const inputs = qsa("input, select, textarea", form);

    const validateOne = (input, showOK = false) => {
      if (input.type === "submit" || input.disabled) return true;

      const ok = validateInput(input);
      const msg = ok ? "" : getMessageForInput(input);

      if (ok) setFieldState(input, showOK ? true : null, "");
      else setFieldState(input, false, msg);

      return ok;
    };

    const validateAll = (showOK = false) => {
      let ok = true;
      inputs.forEach((inp) => {
        const isOk = validateOne(inp, showOK);
        if (!isOk) ok = false;
      });
      return ok;
    };

    inputs.forEach((inp) => {
      const evt = inp.tagName.toLowerCase() === "select" ? "change" : "input";
      inp.addEventListener(evt, () => {
        validateOne(inp, false);
        if (status) {
          status.textContent = "";
          status.classList.remove("ok", "bad");
        }
      });

      inp.addEventListener("blur", () => validateOne(inp, true));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const ok = validateAll(true);

      if (!ok) {
        if (status) {
          status.textContent = "Revisa los campos marcados. Hay datos que no cumplen.";
          status.classList.remove("ok");
          status.classList.add("bad");
        }
        const firstBad = qs(".is-invalid", form);
        if (firstBad) firstBad.focus({ preventScroll: false });
        return;
      }

      if (status) {
        status.textContent = "Listo. Mensaje preparado (demo). Gracias por contactar.";
        status.classList.remove("bad");
        status.classList.add("ok");
      }

      try {
        const count = parseInt(localStorage.getItem("contact_submits") || "0", 10) + 1;
        localStorage.setItem("contact_submits", String(count));
      } catch (_) {}

      form.reset();
      inputs.forEach((inp) => setFieldState(inp, null, ""));
      const label = qs("[data-neon-label]");
      if (label) label.textContent = (root.getAttribute("data-neon") === "off") ? "OFF" : "ON";
    });
  };

  const initProjectSearch = () => {
    const input = qs("[data-project-search]");
    const grid = qs("[data-project-grid]");
    const countEl = qs("[data-project-count]");
    const clearBtn = qs("[data-clear-search]");
    const emptyHint = qs("[data-empty-state]");

    if (!input || !grid) return;

    const cards = qsa("[data-project-card]", grid);

    const normalize = (s) =>
      (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const apply = () => {
      const q = normalize(input.value);
      let shown = 0;

      cards.forEach((card) => {
        const text = normalize(card.textContent);
        const tags = normalize(card.getAttribute("data-tags") || "");
        const ok = q === "" || text.includes(q) || tags.includes(q);

        card.style.display = ok ? "" : "none";
        if (ok) shown++;
      });

      if (countEl) countEl.textContent = String(shown);
      if (emptyHint) emptyHint.hidden = shown !== 0;
    };

    input.addEventListener("input", apply);

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        input.value = "";
        apply();
        input.focus();
      });
    }

    apply();
  };

  const initMobileNav = () => {
    const toggle = qs(".nav-toggle");
    const nav = qs("#navMenu");
    if (!toggle || !nav) return;

    const close = () => {
      nav.style.display = "";
      toggle.setAttribute("aria-expanded", "false");
    };

    const open = () => {
      nav.style.display = "flex";
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) close();
      else open();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) close();
    });

    qsa("a", nav).forEach((a) => a.addEventListener("click", close));
  };

  const initVisitCounter = () => {
    try {
      const k = "site_visits";
      const n = parseInt(localStorage.getItem(k) || "0", 10) + 1;
      localStorage.setItem(k, String(n));
    } catch (_) {}
  };

  document.addEventListener("DOMContentLoaded", () => {
    initNeonToggle();
    initMobileNav();
    initCounters();
    initContactForm();
    initProjectSearch();
    initVisitCounter();
  });
})();