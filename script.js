const burger = document.getElementById("burger");
const navLinks = document.querySelector(".nav-links");

burger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  burger.classList.toggle("active");
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.2, // muncul saat 20% terlihat
  }
);

document.querySelectorAll(".fade-in-left").forEach((el) => observer.observe(el));
const fadeElements = document.querySelectorAll(".scroll-fade-up");

const handleFadeScroll = () => {
  fadeElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight - 100) {
      el.classList.add("visible");
    }
  });
};

window.addEventListener("scroll", handleFadeScroll);
window.addEventListener("load", handleFadeScroll);
const cards = document.querySelectorAll(".service-card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    // hilangkan "active" dari semua kartu
    cards.forEach((c) => c.classList.remove("active"));

    // tambahkan "active" ke kartu yang diklik
    card.classList.add("active");
  });
});
// Toggle chatbot popup
function toggleChatbot() {
  const chatbotPopup = document.getElementById("chatbotPopup");
  chatbotPopup.style.display = chatbotPopup.style.display === "none" || chatbotPopup.style.display === "" ? "block" : "none";
}

// Kirim pesan ke server (menggunakan fetch API)
async function sendMessageToServer(message) {
  try {
    const response = await fetch("http://localhost:3000/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userMessage: message }),
    });

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Error sending message:", error);
    return "Maaf, terjadi kesalahan karna apikey tidak tersedia.";
  }
}

// Menangani pengiriman form
document.getElementById("chatForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // Mencegah reload page saat submit form

  const userInput = document.getElementById("userInput").value;
  if (userInput.trim() !== "") {
    // Tampilkan pesan user di chat
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML += `<div class="user-msg">${userInput}</div>`;

    // Kirim pesan ke server dan dapatkan balasan chatbot
    const botReply = await sendMessageToServer(userInput);

    // Tampilkan balasan bot di chat
    chatMessages.innerHTML += `<div class="bot-msg">${botReply}</div>`;

    // Scroll ke pesan terbaru
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Kosongkan input
    document.getElementById("userInput").value = "";
  }
});

document.getElementById("chatForm").addEventListener("keydown", async function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    // Deteksi Enter tanpa Shift
    e.preventDefault(); // Mencegah baris baru
    const userInput = document.getElementById("userInput").value;
    if (userInput.trim() !== "") {
      // Tampilkan pesan user di chat
      const chatMessages = document.getElementById("chatMessages");
      chatMessages.innerHTML += `<div class="user-msg">${userInput}</div>`;

      // Kirim pesan ke server dan dapatkan balasan chatbot
      const botReply = await sendMessageToServer(userInput);

      // Tampilkan balasan bot di chat
      chatMessages.innerHTML += `<div class="bot-msg">${botReply}</div>`;

      // Scroll ke pesan terbaru
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Kosongkan input
      document.getElementById("userInput").value = "";
    }
  }
});
