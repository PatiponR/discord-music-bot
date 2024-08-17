import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import { loadCommands } from './utils/loadCommands';
import { loadEvents } from './utils/loadEvents';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

console.log(`Running in ${process.env.NODE_ENV} environment`);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

async function main() {
  try {
    const commands = await loadCommands();
    loadEvents(client, commands);
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main().catch(console.error);