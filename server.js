require("dotenv").config(); // WAJIB di baris pertama!

const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sajikan file statis dari folder "web-compro"
app.use(express.static(__dirname));

// Route GET /
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/web-compro/index.html");
});

// Twilio setup pakai .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// (Tambahin route POST /send-message kalau ada)

// Nomor WhatsApp
const fromNumber = process.env.FROM_NUMBER;
const toNumber = process.env.TO_NUMBER;

// Kirim pesan WhatsApp
app.post("/send-message", async (req, res) => {
  const { message } = req.body;

  try {
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber,
    });

    res.json({ success: true, reply: "Pesan berhasil dikirim ke WhatsApp!" });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ success: false, reply: "Gagal mengirim pesan." });
  }
});

// Webhook dari Twilio
app.post("/whatsapp-webhook", async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const incomingMsg = req.body.Body;
  const fromNumber = req.body.From;

  console.log("Pesan masuk:", incomingMsg, "Dari:", fromNumber);

  let responseText = "";

  if (incomingMsg.toLowerCase().includes("halo")) {
    responseText = "Halo juga! Ada yang bisa kami bantu?";
  } else if (incomingMsg.toLowerCase().includes("info")) {
    responseText = "Ini adalah chatbot otomatis dari Kilas Fakta. Untuk bantuan ketik 'bantuan'.";
  } else {
    responseText = "Maaf, saya belum paham maksudnya. Ketik 'info' untuk bantuan.";
  }

  twiml.message(responseText);
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

// Endpoint buat frontend chatbot
app.post("/chatbot", (req, res) => {
  const { userMessage } = req.body;
  console.log("Pesan dari web:", userMessage);

  // Logika balasan lebih banyak
  let replyText = "";

  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("halo") || lowerMessage.includes("hai")) {
    replyText = "Halo! 👋 Ada yang bisa kami bantu hari ini?";
  } else if (lowerMessage.includes("layanan")) {
    replyText = "Kami menyediakan jasa pembuatan website, aplikasi mobile, toko online, dan konsultasi digital marketing.";
  } else if (lowerMessage.includes("harga") || lowerMessage.includes("biaya")) {
    replyText = "Untuk info harga, silakan kunjungi halaman pricing kami atau hubungi tim sales.";
  } else if (lowerMessage.includes("kontak") || lowerMessage.includes("hubungi")) {
    replyText = "Anda bisa menghubungi kami di WhatsApp 0812-3456-7890 atau email ke support@contoh.com.";
  } else if (lowerMessage.includes("alamat")) {
    replyText = "Alamat kantor kami di Jl. Raya Teknologi No.123, Jakarta.";
  } else if (lowerMessage.includes("portofolio") || lowerMessage.includes("projek")) {
    replyText = "Kami sudah mengerjakan lebih dari 100+ projek website, aplikasi, dan sistem ERP.";
  } else if (lowerMessage.includes("bantuan") || lowerMessage.includes("help")) {
    replyText = `
Berikut beberapa hal yang bisa Anda tanyakan:
- Layanan
- Harga/Biaya
- Kontak/Hubungi
- Alamat
- Portofolio/Projek
Silakan ketik salah satu untuk informasi lebih lanjut!
    `;
  } else {
    // Jika pertanyaan ngawur atau tidak dikenali
    replyText = `
Maaf, saya belum paham maksud Anda. 🤔

Berikut beberapa hal yang bisa Anda tanyakan:
- Layanan
- Harga/Biaya
- Kontak/Hubungi
- Alamat
- Portofolio/Projek
Silakan ketik salah satu kata kunci di atas.
    `;
  }

  res.json({ reply: replyText });
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
