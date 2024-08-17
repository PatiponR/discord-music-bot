import { Command } from '../types/index.js';

const ping: Command = {
  name: 'ping',
  description: 'Ping to test if this is working!',
  execute: async (client, message) => {
    await message.reply('You Pinged me?');
  },
};

export default ping;