// ============================================================
// script.js — Mahalakshmi Portfolio
// All interactive behaviour: menu, typewriter, scroll reveal,
// counters, carousels, lightboxes, EmailJS contact form,
// back-to-top progress ring, resume lightbox.
// ============================================================

// ============================================================
// 1. MOBILE MENU TOGGLE
// Opens/closes the sidebar from the hamburger button.
// The overlay click and any sidebar nav-link also close it.
// ============================================================

const menuBtn  = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const sidebar  = document.getElementById("sidebar");
const overlay  = document.getElementById("overlay");

const SLIDE_DURATION = 300; // matches sidebar CSS transition-duration

function openMenu() {
  overlay.classList.remove("hidden");
  sidebar.classList.remove("-translate-x-full");
}

function closeMenu() {
  sidebar.classList.add("-translate-x-full");
  // Hide overlay after the slide-out animation completes
  setTimeout(() => overlay.classList.add("hidden"), SLIDE_DURATION);
}

menuBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

// Close sidebar when any nav link inside it is clicked (smooth-scroll destination)
document.querySelectorAll("#sidebar .nav-link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// ============================================================
// 2. CURSOR GLOW
// Tracks mouse and repositions the radial-gradient glow div.
// Hidden automatically on touch-only devices (no mouse events).
// ============================================================

const glow = document.getElementById("cursor-glow");

document.addEventListener("mousemove", (e) => {
  if (!glow) return;
  glow.style.left = e.clientX + "px";
  glow.style.top  = e.clientY + "px";
});

// ============================================================
// 3. TYPEWRITER EFFECT
// Cycles through the `roles` array, typing then deleting each
// word before moving on. Inject into #typed-text span.
// ============================================================

const roles = [
  "Web Developer",
  "WordPress Plugin Developer",
  "MERN Stack Learner",
  "UI/UX Enthusiast",
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;

const typedEl = document.getElementById("typed-text");

function type() {
  if (!typedEl) return;

  const word = roles[roleIndex];

  if (!isDeleting) {
    // Typing forward
    typedEl.textContent = word.slice(0, ++charIndex);

    if (charIndex === word.length) {
      // Pause at the end before deleting
      isDeleting = true;
      setTimeout(type, 1200);
      return;
    }
  } else {
    // Deleting backward
    typedEl.textContent = word.slice(0, --charIndex);

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(type, isDeleting ? 50 : 90);
}

type();

// ============================================================
// 4. SCROLL REVEAL
// Single IntersectionObserver watches all .reveal elements.
// Adds .visible class which triggers the CSS transition.
// ============================================================

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

// ============================================================
// 5. ACTIVE NAV LINK HIGHLIGHT
// Listens to scroll and marks the nav link whose section is
// currently in view (offset by navbar height ~120px).
// ============================================================

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY + 120;

  sections.forEach((sec) => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach((l) => l.classList.remove("text-green-400"));
      const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (active) active.classList.add("text-green-400");
    }
  });
});

// ============================================================
// 6. COUNTER ANIMATION
// Counts from 0 → data-target using rAF when the About
// section enters the viewport (fires once via unobserve).
// ============================================================

const counters = document.querySelectorAll(".counter");

function animateCounters() {
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    let count    = 0;

    function update() {
      const increment = target / 40;
      if (count < target) {
        count += increment;
        counter.innerText = Math.ceil(count);
        requestAnimationFrame(update);
      } else {
        counter.innerText = target; // snap to exact value at the end
      }
    }

    update();
  });
}

// Trigger counters only once when the about section is 50 % visible
const aboutSection = document.getElementById("about");
if (aboutSection) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counterObserver.observe(aboutSection);
}

// ============================================================
// 7. CAROUSEL FACTORY
// Generic reusable carousel builder.
// ============================================================

// Design work images (used in the Creative section)
const designImages = [
  // ── CS Department Events ──
  { src: "./assets/images/design_work/CS_Admission_2026_2027.jpg",            title: "CS Admission 2026-2027",              category: "College Work" },
  { src: "./assets/images/design_work/CS_Farewell_Last_Login_2026.jpeg",      title: "CS Farewell - Last Login 2026",       category: "College Work" },
  { src: "./assets/images/design_work/CS_Association_Valedictory_2026.jpg",   title: "CS Association Valedictory 2026",     category: "College Work" },
  { src: "./assets/images/design_work/CS_GuestLecture_2026.jpg",              title: "CS Guest Lecture 2026",               category: "College Work" },
  { src: "./assets/images/design_work/CS_Symposium_Excelsior_2026.jpg",       title: "CS Symposium - Excelsior 2026",       category: "College Work" },
  { src: "./assets/images/design_work/CS_Workshop_2026.jpg",                  title: "CS Workshop 2026",                    category: "College Work" },
  { src: "./assets/images/design_work/CS_Commenoration_Day_2026.jpg",         title: "CS Commemoration Day 2026",           category: "College Work" },
  { src: "./assets/images/design_work/CS_Sadakath_Outreach_Programme_2026.png", title: "Sadakaath Outreach Programme 2026", category: "College Work" },
  // ── SAC Events ──
  { src: "./assets/images/design_work/Sac_Admission_2026_2027.png",           title: "SAC Admission 2026–2027",             category: "College Work" },
  { src: "./assets/images/design_work/Sac_Porunai_Ilakkiya_Thirvizha.jpeg",   title: "Porunai Ilakkiya Thiruvizha",         category: "College Work" },
  { src: "./assets/images/design_work/Sac_Ifthar_Get_Together.jpg",           title: "SAC Iftar Get Together",              category: "College Work" },
  { src: "./assets/images/design_work/Sac_Republic_Day_2026.jpg",             title: "Republic Day 2026",                   category: "College Work" },
  { src: "./assets/images/design_work/Sac_Sadhavathani_Speech.jpg",           title: "Sadhavathani Speech",                 category: "College Work" },
  { src: "./assets/images/design_work/Sac_LKSMeeran_Speech_Entrance_Banner.jpg", title: "LKS Meeran Speech Entrance Banner", category: "College Work" },
  { src: "./assets/images/design_work/Sac_LKSMeeran_Speech.jpg",              title: "LKS Meeran Speech Event",             category: "College Work" },
  // ── Academic / Awareness ──
  { src: "./assets/images/design_work/Sadaakath_Clinic_and_Laboratory_First_Year_Anniversary.jpg", title: "Sadaakath Clinic Anniversary", category: "College Work" },
  { src: "./assets/images/design_work/Sadakaath_Clinic_and_Laboratory.png",   title: "Clinic Branding Design",              category: "College Work" },
  { src: "./assets/images/design_work/Women_In_Space.jpg",                    title: "Women In Space Poster",               category: "College Work" },
  { src: "./assets/images/design_work/eco_bag_use.jpg",                       title: "Eco Bag Awareness Design",            category: "College Work" },
  // ── Client Work ──
  { src: "./assets/images/design_work/FoodProcessing_Technology_BookCover.jpg",       title: "Food Processing Technology Book Cover",         category: "Client Work" },
  { src: "./assets/images/design_work/Medical_Laboratory_Technology_Bookcover.jpg",   title: "Medical Laboratory Technology Book Cover",      category: "Client Work" },
  { src: "./assets/images/design_work/Sulochana_Fashionz.png",                        title: "Sulochana Fashionz Branding",                   category: "Client Work" },
  { src: "./assets/images/design_work/Sulochana_Tution_Center.jpg",                   title: "Sulochana Tuition Center Poster",               category: "Client Work" },
];

// Certificate images (used in the Certifications section)
const certImages = [
  { src: "./assets/images/certificates/DATA_ANALYTICS_BY_DELOITTE.jpg",         title: "Data Analytics Job Simulation", issuer: "Deloitte (Forage)" },
  { src: "./assets/images/certificates/Design_Thinking_With_Hci_By_NPTEL.jpg",  title: "Human-Computer Interaction",    issuer: "NPTEL Elite — MoE" },
  { src: "./assets/images/certificates/Research_Methodology_By_NPTEL.jpg",      title: "Research Methodology",          issuer: "NPTEL Elite — MoE" },
  { src: "./assets/images/certificates/Javascript_By_POSTULATE.jpg",             title: "JavaScript Programming",        issuer: "Postulate" },
];

// Filter categories shown as pill buttons above the design carousel
const filterCategories = ["All", "College Work", "Client Work", "Social Media", "UI/UX"];
let activeFilter = "All";

/** Returns how many slides should be visible at once based on viewport width */
function visibleCount() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640)  return 2;
  return 1;
}

/**
 * makeCarousel — builds and manages a single carousel instance.
 * @param {HTMLElement} trackEl   - The sliding track element
 * @param {HTMLElement} dotsEl    - Dot indicators container
 * @param {HTMLElement} prevEl    - Previous button
 * @param {HTMLElement} nextEl    - Next button
 * @param {Function}   getSlides - Returns array of slide data objects
 * @param {Object}     opts       - { cert: boolean }
 * @returns {{ rebuild: Function }}
 */
function makeCarousel(trackEl, dotsEl, prevEl, nextEl, getSlides, opts = {}) {
  let current   = 0;
  let autoTimer;

  /** Maximum valid slide index (prevents over-scrolling) */
  function maxIdx() {
    return Math.max(0, getSlides().length - visibleCount());
  }

  /** Renders all slides into the track; resets dots and position */
  function buildSlides() {
    trackEl.innerHTML = "";
    const items = getSlides();

    if (!items.length) {
      // Show an empty state if no slides match the active filter
      trackEl.innerHTML = `<div class="empty-state">— no items in this category —</div>`;
      dotsEl.innerHTML = "";
      const c = document.getElementById("slide-count");
      if (c && !opts.cert) c.textContent = "";
      return;
    }

    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "carousel-slide" + (opts.cert ? " cert-slide" : "");
      div.setAttribute("role", "button");
      div.setAttribute("tabindex", "0");

      // Click or Enter opens the lightbox for this slide
      div.addEventListener("click", () => openLightbox(item));
      div.addEventListener("keydown", (e) => {
        if (e.key === "Enter") openLightbox(item);
      });

      // Placeholder shown while image loads or if src is missing
      const ph = document.createElement("div");
      ph.className = "slide-placeholder";
      ph.innerHTML = `<i class="ti ti-photo" aria-hidden="true"></i><span>${item.title}</span>`;

      if (item.src) {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.title;
        img.loading = "lazy"; // native lazy-load to improve performance
        img.onerror = function () {
          // Image failed to load — show placeholder instead
          this.remove();
          ph.style.display = "flex";
        };
        div.appendChild(img);
        ph.style.display = "none";
      }

      div.appendChild(ph);

      // Label bar at the bottom of each slide
      const lbl = document.createElement("div");
      lbl.className = "slide-label";
      lbl.innerHTML = `<span>${item.title}</span><span class="slide-cat">${opts.cert ? item.issuer : item.category}</span>`;
      div.appendChild(lbl);

      trackEl.appendChild(div);
    });

    buildDots();
    goTo(Math.min(current, maxIdx()));
  }

  /** Rebuilds pagination dots to match current slide count */
  function buildDots() {
    dotsEl.innerHTML = "";
    const n = maxIdx() + 1;

    for (let i = 0; i < n; i++) {
      const d = document.createElement("button");
      d.className = "carousel-dot" + (i === current ? " active" : "");
      d.setAttribute("aria-label", `Slide ${i + 1}`);
      d.addEventListener("click", () => { goTo(i); resetAuto(); });
      dotsEl.appendChild(d);
    }

    // Update the slide count badge (design carousel only)
    const c = document.getElementById("slide-count");
    if (c && !opts.cert) {
      const n2 = getSlides().length;
      c.textContent = n2 ? `${n2} project${n2 > 1 ? "s" : ""}` : "";
    }
  }

  /** Translates the track to show slide at `idx` */
  function goTo(idx) {
    const items = getSlides();
    if (!items.length) return;

    current = Math.max(0, Math.min(idx, maxIdx()));
    const slides = trackEl.querySelectorAll(".carousel-slide");
    if (!slides.length) return;

    // Measure actual rendered width + gap
    const slideWidth = slides[0].getBoundingClientRect().width + 16;
    trackEl.style.transform = `translateX(-${current * slideWidth}px)`;

    // Sync active dot
    dotsEl.querySelectorAll(".carousel-dot")
      .forEach((d, i) => d.classList.toggle("active", i === current));
  }

  /** Auto-advance every 3.8 s */
  function startAuto() {
    autoTimer = setInterval(() => {
      goTo(current >= maxIdx() ? 0 : current + 1);
    }, 3800);
  }

  /** Restart auto-advance after a manual action */
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // Button click handlers
  prevEl.addEventListener("click", () => { goTo(current - 1); resetAuto(); });
  nextEl.addEventListener("click", () => { goTo(current + 1); resetAuto(); });

  // Touch swipe support
  let touchStartX = 0;
  trackEl.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  trackEl.addEventListener("touchend", (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAuto();
    }
  });

  // Recalculate on resize (e.g. rotation, window resize)
  window.addEventListener("resize", () => {
    current = 0;
    buildDots();
    goTo(0);
  });

  // Initial render
  buildSlides();
  startAuto();

  return { rebuild: buildSlides };
}

// ── Build filter buttons for the design carousel ──
const filtersEl = document.getElementById("filters");
filterCategories.forEach((f) => {
  const btn = document.createElement("button");
  btn.className = "filter-btn" + (f === "All" ? " active" : "");
  btn.textContent = f;
  btn.addEventListener("click", () => {
    activeFilter = f;
    filtersEl.querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.toggle("active", b.textContent === f));
    dc.rebuild(); // re-render with the new filter
  });
  filtersEl.appendChild(btn);
});

// ── Instantiate design carousel ──
const dc = makeCarousel(
  document.getElementById("carousel-track"),
  document.getElementById("carousel-dots"),
  document.getElementById("carousel-prev"),
  document.getElementById("carousel-next"),
  () => activeFilter === "All" ? designImages : designImages.filter((i) => i.category === activeFilter)
);

// ── Instantiate certifications carousel ──
makeCarousel(
  document.getElementById("cert-track"),
  document.getElementById("cert-dots"),
  document.getElementById("cert-prev"),
  document.getElementById("cert-next"),
  () => certImages,
  { cert: true }
);

// ============================================================
// 8. LIGHTBOX — for certificates and design work
// Opens when a carousel slide is clicked.
// Closed by close button, clicking outside, or Escape key.
// ============================================================

/**
 * Opens the shared lightbox with the given item's image.
 * @param {{ src: string, title: string, issuer?: string, category?: string }} item
 */
function openLightbox(item) {
  document.getElementById("lb-img").src    = item.src;
  document.getElementById("lb-img").alt    = item.title;
  document.getElementById("lb-title").textContent  = item.title;
  document.getElementById("lb-issuer").textContent = item.issuer || item.category || "";
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden"; // prevent background scroll
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.getElementById("lb-img").src = ""; // free memory
  document.body.style.overflow = "";
}

document.getElementById("lb-close").addEventListener("click", closeLightbox);

// Click outside the image to close
document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target === document.getElementById("lightbox")) closeLightbox();
});

// Escape key closes lightbox (also handles resume lightbox via shared handler)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
    closeResumeLightbox();
  }
});

// ============================================================
// 9. RESUME LIGHTBOX
// Triggered by the "View Resume" button in the hero section.
// Shows a download-focused panel for the .docx resume file.
// ============================================================

const resumeLb      = document.getElementById("resume-lb");
const openResumeBtn = document.getElementById("open-resume-btn");
const resumeCloseBtn = document.getElementById("resume-lb-close");

function openResumeLightbox() {
  if (!resumeLb) return;
  resumeLb.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeResumeLightbox() {
  if (!resumeLb) return;
  resumeLb.classList.remove("open");
  document.body.style.overflow = "";
}

if (openResumeBtn)   openResumeBtn.addEventListener("click", openResumeLightbox);
if (resumeCloseBtn)  resumeCloseBtn.addEventListener("click", closeResumeLightbox);

// Click on backdrop (outside the inner box) closes resume lightbox
if (resumeLb) {
  resumeLb.addEventListener("click", (e) => {
    if (e.target === resumeLb) closeResumeLightbox();
  });
}

// ============================================================
// 10. EMAILJS — initialise SDK once
// Credentials are injected here; keep service/template IDs
// up to date if the EmailJS account changes.
// ============================================================

const EMAILJS_PUBLIC_KEY  = "7ssdE6EvucfhJNiZu";
const EMAILJS_SERVICE_ID  = "service_u79pw72";
const EMAILJS_TEMPLATE_ID = "template_e055g3p";

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ============================================================
// 11. CONTACT FORM — validation + EmailJS submission
// Validates name, email (regex), and message fields.
// Shows a toast on success or failure.
// ============================================================

async function submitForm() {
  const nameInput    = document.getElementById("cf-name");
  const emailInput   = document.getElementById("cf-email");
  const subjectInput = document.getElementById("cf-subject");
  const messageInput = document.getElementById("cf-message");
  const btn          = document.getElementById("submit-btn");
  const label        = document.getElementById("submit-label");

  // ── Field validation ──
  const checks = [
    ["err-name",  nameInput.value.trim() === ""],
    ["err-email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)],
    ["err-msg",   messageInput.value.trim() === ""],
  ];

  let valid = true;
  checks.forEach(([id, isErr]) => {
    const errEl = document.getElementById(id);
    if (!errEl) return;
    errEl.classList.toggle("hidden", !isErr);
    if (isErr) valid = false;
  });

  if (!valid) return;

  // ── Send via EmailJS ──
  btn.disabled = true;
  label.textContent = "Sending…";

  const templateParams = {
    from_name:  nameInput.value.trim(),
    from_email: emailInput.value.trim(),
    subject:    subjectInput.value.trim() || "Portfolio contact",
    message:    messageInput.value.trim(),
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

    showToast("✓ Message sent! I'll get back to you soon.", "success");

    // Clear all form fields on success
    ["cf-name", "cf-email", "cf-subject", "cf-message"].forEach((id) => {
      const field = document.getElementById(id);
      if (field) field.value = "";
    });

  } catch (error) {
    console.error("EmailJS error:", error);
    showToast("✗ Couldn't send. Please email me directly.", "error");
  } finally {
    btn.disabled = false;
    label.textContent = "Send Message";
  }
}

/**
 * Displays a toast notification.
 * @param {string} message - Text to show
 * @param {"success"|"error"} type
 */
function showToast(message, type) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.style.borderColor = type === "error" ? "#f87171" : "";
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.style.borderColor = "";
  }, 4000);
}

// ============================================================
// 12. BACK TO TOP  +  SCROLL PROGRESS RING
// Button appears after 200 px of scroll and shows how far
// down the page the user has scrolled via an SVG ring stroke.
// ============================================================

const backTop       = document.querySelector(".back-top");
const progressRing  = document.querySelector(".progress-ring");

const RING_RADIUS        = 22;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Initialise stroke to fully hidden (will fill as user scrolls)
progressRing.style.strokeDasharray  = `${RING_CIRCUMFERENCE}`;
progressRing.style.strokeDashoffset = `${RING_CIRCUMFERENCE}`;

function updateProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPct  = docHeight > 0 ? scrollTop / docHeight : 0;
  const offset     = RING_CIRCUMFERENCE - scrollPct * RING_CIRCUMFERENCE;

  progressRing.style.strokeDashoffset = offset;

  // Show/hide button based on scroll depth
  if (scrollTop > 200) {
    backTop.classList.add("back-top-show");
  } else {
    backTop.classList.remove("back-top-show");
  }
}

window.addEventListener("scroll", updateProgress, { passive: true });

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
