import { Message, Client } from 'discord.js';
import { Command } from '../types/index.js';
import { musicPlayer } from '../modules/MusicPlayer';
import { messageManager } from '../utils/messageManager';

const pause: Command = {
  name: 'pause',
  description: 'Pause the current song',
  execute: async (client: Client, message: Message, args: string[]) => {
    try {
      await musicPlayer.pause(message);
    } catch (error) {
      console.error('Error in pause command:', error);
      await messageManager.reply(message, 'errorPausing');
    }
  },
};

export default pause;