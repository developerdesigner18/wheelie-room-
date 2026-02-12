const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

// Create Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

// When bot is ready
client.once("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

// Listen to messages
client.on("messageCreate", async (message) => {
  try {
    // Ignore bot messages
    if (message.author.bot) return;

    const content = message.content.trim();

    // Only allow numbers
    if (!/^\d+$/.test(content)) return;

    console.log("Valid quantity received:", content);

    // Send to n8n
    await axios.post(N8N_WEBHOOK_URL, {
      quantity: content,
      raw: {
        id: message.id,
        channelId: message.channelId,
        guildId: message.guildId,
        authorId: message.author.id
      }
    });

    console.log("Sent to n8n successfully");

  } catch (error) {
    console.error("Error processing message:", error.message);
  }
});

// Login bot
client.login(DISCORD_BOT_TOKEN);
