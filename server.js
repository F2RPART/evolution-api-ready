import express from "express";
import { makeWASocket, useMultiFileAuthState } from "baileys";
import qrcode from "qrcode-terminal";

const app = express();
app.use(express.json());

let sock;
let connected = false;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  sock = makeWASocket({ auth: state });
  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;
    if (qr) qrcode.generate(qr, { small: true });
    if (connection === "open") {
      connected = true;
      console.log("✅ WhatsApp conectado!");
    }
  });
}

app.get("/instance/list", (req, res) => {
  res.json({ connected });
});

app.post("/message/send", async (req, res) => {
  try {
    if (!connected || !sock) return res.status(400).json({ error: "Não conectado" });
    const { number, text } = req.body;
    await sock.sendMessage(`${number}@s.whatsapp.net`, { text });
    res.json({ ok: true, message: "Mensagem enviada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao enviar mensagem" });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log("🚀 Servidor Evolution API rodando na porta", process.env.PORT || 8080);
  connectToWhatsApp();
});
