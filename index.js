const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("clientReady", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;

    const content = message.content.trim();

    if (!/^\d+$/.test(content)) return;

    await axios.post(N8N_WEBHOOK_URL, {
      quantity: content,
      raw: message
    });

  } catch (error) {
    console.error("Error sending to n8n:", error.message);
  }
});

client.login(DISCORD_BOT_TOKEN);
