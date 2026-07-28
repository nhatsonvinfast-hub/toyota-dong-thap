// ===== Toyota Đồng Tháp — Site scripts =====

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initModelFilter();
  initContactForm();
  initFooterYear();
});

// Mobile nav toggle
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

// Filter model cards by category (data-category attribute)
function initModelFilter() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      cards.forEach((card) => {
        const show = filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = show ? "" : "none";
      });
    });
  });
}

// Contact / test-drive form: client-side only demo submission
function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const successBox = document.querySelector("#form-success");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (successBox) {
      successBox.classList.add("show");
      successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    form.reset();
  });
}

function initFooterYear() {
  const el = document.querySelector("#year");
  if (el) el.textContent = new Date().getFullYear();
}
