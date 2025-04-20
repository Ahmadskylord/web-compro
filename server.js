require('dotenv').config(); // WAJIB di baris pertama!

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Route GET /
app.get('/', (req, res) => {
  res.send('Server aktif! Gunakan POST ke /send-message untuk kirim pesan.');
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
app.post('/send-message', async (req, res) => {
  const { message } = req.body;

  try {
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber
    });

    res.json({ success: true, reply: "Pesan berhasil dikirim ke WhatsApp!" });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ success: false, reply: "Gagal mengirim pesan." });
  }
});

// Webhook dari Twilio
app.post('/whatsapp-webhook', async (req, res) => {
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
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

// Endpoint buat frontend chatbot
app.post('/chatbot', (req, res) => {
  const { userMessage } = req.body;
  console.log("Pesan dari web:", userMessage);

  let replyText = "Bot aktif! Lo nanya: " + userMessage;
  res.json({ reply: replyText });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
