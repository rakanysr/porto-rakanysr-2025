// script.js — global for index/projects/contact
// Requires GSAP + ScrollTrigger loaded in the page.

(function () {
  // Elements
  const menuBtn = document.getElementById("menuButton");
  const navMenu = document.getElementById("navMenu");
  const yearEl = document.getElementById("year");
  const contactForm = document.getElementById("contact-form");

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menu toggle (works across pages)
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("open");
      navMenu.classList.toggle("open");
    });
    // close when clicking a nav link
    navMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        if (navMenu.classList.contains("open")) {
          menuBtn.classList.remove("open");
          navMenu.classList.remove("open");
        }
      });
    });
  }

  // Contact form demo handler
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.getElementById("form-status");
      status.textContent = "Thanks! This is a demo form — connect to your email/backend to receive messages.";
      status.classList.add("text-green-600");
      contactForm.reset();
    });
  }

  // GSAP
  if (typeof gsap !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance (if h1 present)
    gsap.utils.toArray("h1").forEach((h, i) => {
      gsap.from(h, { y: 80, opacity: 0, duration: 1.2, delay: i * 0.05, ease: "power3.out" });
    });
    gsap.utils.toArray("header p, header a").forEach((el, i) => {
      gsap.from(el, { y: 30, opacity: 0, duration: 0.9, delay: 0.2 + i * 0.05, ease: "power3.out" });
    });

    // Parallax circles in header (if present)
    gsap.utils.toArray(".circle-yellow").forEach((c, idx) => {
      gsap.to(c, {
        y: (idx % 2 === 0) ? 30 : -30,
        ease: "none",
        scrollTrigger: { trigger: "header", start: "top top", end: "bottom top", scrub: true }
      });
    });

    // Cards reveal on scroll
    const cards = gsap.utils.toArray(".card-3d");
    if (cards.length) {
      gsap.set(cards, { autoAlpha: 0, y: 40 });
      cards.forEach((card, i) => {
        gsap.to(card, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%" }
        });
      });
    }

    // 3D Tilt on pointer move for elements with data-tilt
    const tiltElements = document.querySelectorAll("[data-tilt]");
    tiltElements.forEach((el) => {
      const max = parseFloat(el.getAttribute("data-tilt-max")) || 12; // degrees
      const scale = parseFloat(el.getAttribute("data-tilt-scale")) || 1.03;

      // smoothing vars
      let mouseX = 0, mouseY = 0, ww = window.innerWidth, wh = window.innerHeight;
      el.style.transformStyle = "preserve-3d";
      el.style.transition = "transform 0.12s ease-out";

      function updateTransform(clientX, clientY) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const px = dx / (rect.width / 2);
        const py = dy / (rect.height / 2);
        const rotY = (-px) * max;
        const rotX = (py) * max;
        // compose transform
        el.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
      }

      // pointer move
      el.addEventListener("pointermove", (ev) => {
        updateTransform(ev.clientX, ev.clientY);
      });

      // reset on leave
      el.addEventListener("pointerleave", () => {
        el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
      });

      // touch: small tilt based on center when touchstart
      el.addEventListener("touchstart", (e) => {
        if (e.touches && e.touches.length) {
          updateTransform(e.touches[0].clientX, e.touches[0].clientY);
        }
      });
      el.addEventListener("touchend", () => {
        el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
      });
    });

    // Slight parallax on background images / decorative shapes (if exist)
    gsap.utils.toArray(".parallax").forEach((el) => {
      gsap.to(el, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  } // end gsap
})(); // IIFE
