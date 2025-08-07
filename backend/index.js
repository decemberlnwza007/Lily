const WebSocket = require('ws');
const askGemini = require('./gemini');

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
  console.log("✨ มี client เชื่อมต่อเข้ามา");

  ws.on('message', async (msg) => {
    const parsed = JSON.parse(msg);

    if (parsed.type === 'chat') {
      const userMsg = parsed.data.message;
      const sender = parsed.data.sender;

      const aiResponse = await askGemini(userMsg);

      ws.send(JSON.stringify({ type: "chat", data: { sender, message: userMsg } }));
      ws.send(JSON.stringify({ type: "chat", data: { sender: "Lily 🤖", message: aiResponse } }));
    }
  });
});
