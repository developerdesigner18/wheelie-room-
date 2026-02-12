const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
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

    console.log("Quantity sent to n8n:", content);

  } catch (error) {
    console.error("Error:", error);
  }
});

client.login(DISCORD_BOT_TOKEN);
