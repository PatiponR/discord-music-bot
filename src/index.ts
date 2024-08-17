import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { handleCommand } from './commandHandler.js';
import defaultConfig from './config/default.js';
import uatConfig from './config/uat.js';
import productionConfig from './config/production.js';

// Load environment-specific .env file
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// Choose environment-specific configuration
const config = process.env.NODE_ENV === 'production'
  ? productionConfig
  : uatConfig;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}! (${config.environment} environment)`);
});

client.on('messageCreate', async (message) => {
  await handleCommand(message);
});

client.login(process.env.DISCORD_TOKEN);