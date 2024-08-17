import { Message, Client } from 'discord.js'
import { Command } from '../types';
import { musicPlayer } from '../modules/MusicPlayer';
import { messageManager } from '../utils/messageManager';

const skip: Command = {
    name: 'skip',
    description: 'Skip the current song',
    execute: async (client: Client, message: Message, args: string[]) => {
      try {
        await musicPlayer.skip(message);
      } catch (error) {
        console.error('Error in skip command:', error);
        await messageManager.reply(message, 'errorSkipping');
      }
    },
  };
export default skip;