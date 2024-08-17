import { Client, GatewayIntentBits } from 'discord.js';
import { Config } from './types';

export const createClient = (config: Config) => {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
    ]
  });
};