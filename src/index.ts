import dotenv from 'dotenv';
import { createClient } from './client.js';
import { loadCommands } from './utils/loadCommands.js';
import { loadEvents } from './utils/loadEvents.js';
import defaultConfig from './config/default.js';
import uatConfig from './config/uat.js';
import productionConfig from './config/production.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const config = process.env.NODE_ENV === 'production'
  ? { ...defaultConfig, ...productionConfig }
  : { ...defaultConfig, ...uatConfig };

const client = createClient(config);
loadCommands().then(commands => {
  loadEvents(client, commands, config);
  client.login(process.env.DISCORD_TOKEN);
});