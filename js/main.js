// ===== Toyota Đồng Tháp — Site scripts =====

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initModelFilter();
  initContactForm();
  initFooterYear();
  initFabMenu();
  initModelDetail();
  initTestDrivePrefill();
  initHeroCarousel();
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

// Contact / test-drive form: submits to Gmail via FormSubmit.co (no backend needed)
function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const successBox = document.querySelector("#form-success");
  const errorBox = document.querySelector("#form-error");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (errorBox) errorBox.classList.remove("show");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Đang gửi...";
    }

    const data = {
      "Họ và tên": form.name.value,
      "Số điện thoại": form.phone.value,
      "Mẫu xe quan tâm": form.model.value || "Chưa chọn",
      "Nhu cầu": form.service.options[form.service.selectedIndex].text,
      "Lời nhắn": form.message.value || "(không có)",
      _subject: "Yêu cầu mới từ website - " + form.name.value,
      _template: "table",
      _captcha: "false",
    };

    // Fire-and-forget: also log the lead into Google Sheets via Apps Script.
    // no-cors means we can't read the response, but the sheet still gets the row.
    fetch("https://script.google.com/macros/s/AKfycbybC8xNSGxuZVjUuoqyfBv-y21stp88ubxiD1MuCpehQjLzScDkRdAYswR5yc3YFjscZA/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        name: form.name.value,
        phone: form.phone.value,
        model: form.model.value || "Chưa chọn",
        service: form.service.options[form.service.selectedIndex].text,
        message: form.message.value || "",
      }),
    }).catch(() => {});

    fetch("https://formsubmit.co/ajax/toyota66dongthap@gmail.com", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        if (successBox) {
          successBox.classList.add("show");
          successBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        form.reset();
      })
      .catch(() => {
        if (errorBox) {
          errorBox.classList.add("show");
          errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Gửi yêu cầu";
        }
      });
  });
}

function initFooterYear() {
  const el = document.querySelector("#year");
  if (el) el.textContent = new Date().getFullYear();
}

// Floating multi-action contact button (call / zalo / mail / test-drive)
function initFabMenu() {
  const menu = document.querySelector("#fab-menu");
  const toggle = document.querySelector("#fab-toggle");
  if (!menu || !toggle) return;

  toggle.addEventListener("click", () => menu.classList.toggle("open"));

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) menu.classList.remove("open");
  });
}

function formatVnd(amount) {
  return amount.toLocaleString("vi-VN") + " ₫";
}

// Model detail page (xe-chi-tiet.html?xe=<slug>) — reads js/models-data.js
function initModelDetail() {
  const titleEl = document.querySelector("#detail-title");
  if (!titleEl || typeof MODELS === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("xe");
  const model = MODELS[slug];

  const trimTable = document.querySelector("#trim-table");
  const colorGrid = document.querySelector("#color-grid");
  const categoryEl = document.querySelector("#detail-category");
  const crumbEl = document.querySelector("#crumb-model");
  const heroImg = document.querySelector("#detail-hero-img");
  const mailCta = document.querySelector("#cta-mail");
  const testDriveCta = document.querySelector("#cta-testdrive");

  if (!model) {
    titleEl.textContent = "Không tìm thấy mẫu xe";
    if (categoryEl) categoryEl.textContent = "Vui lòng quay lại bảng giá xe để chọn mẫu xe khác.";
    if (trimTable) trimTable.innerHTML = '<div class="trim-empty">Không có dữ liệu.</div>';
    if (colorGrid) colorGrid.innerHTML = '<div class="color-empty">Không có dữ liệu.</div>';
    return;
  }

  document.title = model.name + " | Toyota Đồng Tháp";
  titleEl.textContent = model.name;
  if (categoryEl) categoryEl.textContent = model.category;
  if (crumbEl) crumbEl.textContent = model.name;
  if (heroImg) {
    heroImg.src = model.hero;
    heroImg.alt = model.name;
  }

  if (mailCta) {
    const subject = encodeURIComponent("Yêu cầu báo giá " + model.name);
    const body = encodeURIComponent(
      "Chào Toyota Đồng Tháp,\n\nTôi muốn được tư vấn báo giá chi tiết cho xe " + model.name + ".\nHọ tên:\nSố điện thoại:\n\nCảm ơn."
    );
    mailCta.href = "mailto:toyota66dongthap@gmail.com?subject=" + subject + "&body=" + body;
  }

  [document.querySelector("#cta-testdrive"), document.querySelector("#cta-testdrive-top")].forEach((el) => {
    if (el) el.href = "lien-he.html?xe=" + encodeURIComponent(slug) + "#dat-lich";
  });

  const introEl = document.querySelector("#detail-intro");
  if (introEl) introEl.textContent = model.intro || "Đang cập nhật thông tin giới thiệu cho mẫu xe này.";

  const specsEl = document.querySelector("#detail-specs");
  if (specsEl) {
    if (model.specs && model.specs.length) {
      specsEl.innerHTML = model.specs
        .map((s) => '<div class="spec-row"><span>' + s.label + "</span><span>" + s.value + "</span></div>")
        .join("");
    } else {
      specsEl.innerHTML = '<div class="trim-empty">Chưa có dữ liệu, vui lòng liên hệ hotline để được tư vấn.</div>';
    }
  }

  const featuresEl = document.querySelector("#detail-features");
  if (featuresEl) {
    if (model.features && model.features.length) {
      featuresEl.innerHTML = model.features.map((f) => '<div class="feature-card">' + f + "</div>").join("");
    } else {
      featuresEl.innerHTML = '<div class="trim-empty">Chưa có dữ liệu, vui lòng liên hệ hotline để được tư vấn.</div>';
    }
  }

  if (trimTable) {
    if (model.trims && model.trims.length) {
      trimTable.innerHTML = model.trims
        .map(
          (t) =>
            '<div class="trim-row"><span class="trim-name">' +
            t.name +
            '</span><span class="trim-price">' +
            formatVnd(t.price) +
            "</span></div>"
        )
        .join("");
      if (model.note) {
        trimTable.innerHTML += '<p class="form-note">' + model.note + "</p>";
      }
    } else {
      trimTable.innerHTML = '<div class="trim-empty">Chưa có dữ liệu phiên bản chi tiết, vui lòng liên hệ hotline để được tư vấn.</div>';
    }
  }

  if (colorGrid) {
    if (model.colors && model.colors.length) {
      colorGrid.innerHTML = model.colors
        .map((c) => {
          const photo = model.colorPhotos && model.colorPhotos[c];
          const visual = photo
            ? '<img class="color-photo" src="' + photo + '" alt="Toyota màu ' + c + '" loading="lazy" />'
            : '<div class="color-dot" style="background:' + (COLOR_HEX[c] || "#ccc") + '"></div>';
          return '<div class="color-card">' + visual + '<div class="color-name">' + c + "</div></div>";
        })
        .join("");
    } else {
      colorGrid.innerHTML = '<div class="color-empty">Đại lý sẽ cập nhật đầy đủ tùy chọn màu sắc, vui lòng liên hệ hotline 077 222 3330 để được tư vấn màu sắc hiện có.</div>';
    }
  }
}

// Homepage banner carousel (auto-advance + manual controls)
function initHeroCarousel() {
  const track = document.querySelector("#carousel-track");
  const prevBtn = document.querySelector("#carousel-prev");
  const nextBtn = document.querySelector("#carousel-next");
  const dotsBox = document.querySelector("#carousel-dots");
  if (!track) return;

  const slides = track.querySelectorAll(".carousel-slide");
  const count = slides.length;
  let index = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", "Ảnh " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsBox.appendChild(dot);
  });

  function render() {
    track.style.transform = "translateX(-" + index * 100 + "%)";
    dotsBox.querySelectorAll("button").forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function goTo(i) {
    index = (i + count) % count;
    render();
    restartTimer();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function restartTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  render();
  restartTimer();
}

// Pre-select the model dropdown on lien-he.html when arriving via ?xe=<slug>
function initTestDrivePrefill() {
  const select = document.querySelector("#model");
  if (!select || typeof MODELS === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("xe");
  const model = MODELS[slug];
  if (!model) return;

  const option = Array.from(select.options).find((o) => o.value === model.name || o.textContent.trim() === model.name);
  if (option) select.value = option.value;
}
