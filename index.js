const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

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

    await axios.post(N8N_WEBHOOK_URL, {
      quantity: content,
      raw: message
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
