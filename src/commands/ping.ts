import { Command } from '../types/index.js';

const ping: Command = {
  name: 'ping',
  description: 'Replies with Pong!',
  execute: async (client, message) => {
    await message.reply('Pong!');
  },
};

export default ping;