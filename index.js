const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

// Health check route (important for Render)
app.get("/", (req, res) => {
  res.send("Discord Bot Bridge Running ✅");
});

app.post("/discord-webhook", async (req, res) => {
  try {
    const message = req.body;

    // Ignore bot messages
    if (message.author?.bot) {
      return res.sendStatus(200);
    }

    const content = message.content;

    // Only accept numbers
    if (!/^\d+$/.test(content)) {
      return res.sendStatus(200);
    }

    console.log("Received quantity:", content);

    await axios.post(N8N_WEBHOOK_URL, {
      quantity: content,
      raw: message
    });

    return res.sendStatus(200);

  } catch (error) {
    console.error("Error:", error.message);
    return res.sendStatus(500);
  }
});

// 🔥 IMPORTANT: Use Render's dynamic port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
