// ===== Toyota Đồng Tháp — Chatbot hỗ trợ khách hàng (mô phỏng, không có backend thật) =====

document.addEventListener("DOMContentLoaded", () => {
  injectChatbot();
  initChatbot();
});

function injectChatbot() {
  const launcher = document.createElement("button");
  launcher.className = "chatbot-launcher hidden";
  launcher.id = "chatbot-launcher";
  launcher.setAttribute("aria-label", "Mở hỗ trợ trực tuyến");
  launcher.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

  const widget = document.createElement("div");
  widget.className = "chatbot-widget";
  widget.id = "chatbot-widget";
  widget.innerHTML = `
    <div class="chatbot-header">
      <span>Hỗ trợ trực tuyến</span>
      <button class="chatbot-close" id="chatbot-close" aria-label="Thu nhỏ">&times;</button>
    </div>
    <div class="chatbot-agent">
      <span class="avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="#eb0a1e" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
        <span class="online-dot"></span>
      </span>
      <span>
        <strong>Admin</strong>
        <span>Hỗ trợ trực tuyến</span>
      </span>
    </div>
    <div class="chatbot-messages" id="chatbot-messages"></div>
    <div class="chatbot-quick-actions">
      <button data-action="price">Xem bảng giá</button>
      <button data-action="testdrive">Đăng ký lái thử</button>
      <button data-action="call">Gọi ngay</button>
      <button data-action="zalo">Chat Zalo</button>
    </div>
    <form class="chatbot-input" id="chatbot-form">
      <input type="text" id="chatbot-text" placeholder="Nhập nội dung..." autocomplete="off" />
      <button type="submit">Gửi</button>
    </form>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(widget);
}

function nowLabel() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return hh + ":" + mm;
}

function addBotMessage(text) {
  const box = document.querySelector("#chatbot-messages");
  if (!box) return;
  const div = document.createElement("div");
  div.className = "chat-msg bot";
  div.innerHTML = '<span class="bubble">' + text + "</span>";
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function addUserMessage(text) {
  const box = document.querySelector("#chatbot-messages");
  if (!box) return;
  const div = document.createElement("div");
  div.className = "chat-msg user";
  div.innerHTML = '<span class="bubble">' + text + '</span><span class="meta">✓ Đã gửi lúc ' + nowLabel() + "</span>";
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function initChatbot() {
  const launcher = document.querySelector("#chatbot-launcher");
  const widget = document.querySelector("#chatbot-widget");
  const closeBtn = document.querySelector("#chatbot-close");
  const form = document.querySelector("#chatbot-form");
  const input = document.querySelector("#chatbot-text");
  const quickActions = document.querySelectorAll(".chatbot-quick-actions button");

  if (!launcher || !widget) return;

  function openWidget() {
    widget.classList.add("open");
    launcher.classList.add("hidden");
  }

  function closeWidget() {
    widget.classList.remove("open");
    launcher.classList.remove("hidden");
  }

  launcher.addEventListener("click", openWidget);
  closeBtn.addEventListener("click", closeWidget);

  // Auto-greet once per browser session
  if (!sessionStorage.getItem("chatbotGreeted")) {
    setTimeout(() => {
      openWidget();
      addBotMessage("Dạ! Em xin hỗ trợ mình ạ! 👋");
      setTimeout(() => {
        addBotMessage("Anh/Chị đang tham khảo dòng xe nào ạ? Em sẽ tư vấn giá và ưu đãi tốt nhất ngay ạ.");
      }, 900);
    }, 1800);
    sessionStorage.setItem("chatbotGreeted", "1");
  } else {
    launcher.classList.remove("hidden");
    addBotMessage("Dạ! Anh/Chị đang tham khảo dòng xe nào ạ?");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = "";
    setTimeout(() => {
      addBotMessage(
        "Dạ em đã ghi nhận thông tin! Để được tư vấn nhanh nhất, Anh/Chị có thể gọi hotline <strong>077 222 3330</strong>, nhắn Zalo hoặc để lại số điện thoại, nhân viên sẽ liên hệ lại ngay ạ."
      );
    }, 1000);
  });

  quickActions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      if (action === "price") {
        window.location.href = "xe.html";
      } else if (action === "testdrive") {
        window.location.href = "lien-he.html#dat-lich";
      } else if (action === "call") {
        window.location.href = "tel:0772223330";
      } else if (action === "zalo") {
        window.open("https://zalo.me/0772223330", "_blank");
      }
    });
  });
}
