import { Message, Client } from 'discord.js';
import { Command } from '../types/index.js';
import { musicPlayer } from '../modules/MusicPlayer';
import { messageManager } from '../utils/messageManager';

const resume: Command = {
  name: 'resume',
  description: 'Resume the current song',
  execute: async (client: Client, message: Message, args: string[]) => {
    try {
      await musicPlayer.resume(message);
    } catch (error) {
      console.error('Error in resume command:', error);
      await messageManager.reply(message, 'errorResuming');
    }
  },
};

export default resume;