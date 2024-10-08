import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import { loadCommands } from './utils/loadCommands';
import { loadEvents } from './utils/loadEvents';
import { generateDependencyReport } from '@discordjs/voice';
import defaultConfig from './config/default';
import uatConfig from './config/uat';
import productionConfig from './config/production';

//this project requires ffmpeg and yt-dlp to be installed in your machine to make it work

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
console.log(generateDependencyReport());
console.log(`Running in ${process.env.NODE_ENV} environment`);

// Choose environment-specific configuration
const config = process.env.NODE_ENV === 'production'
  ? { ...defaultConfig, ...productionConfig }
  : { ...defaultConfig, ...uatConfig };

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
    loadEvents(client, commands, config);
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main().catch(console.error);