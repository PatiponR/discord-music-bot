import { Command } from '../types';
import { musicPlayer } from '../modules/MusicPlayer';
import { messageManager } from '../utils/messageManager';

const play: Command = {
  name: 'play',
  description: 'Play a song from YouTube',
  execute: async (client, message, args) => {
    if (!args.length) {
      await messageManager.reply(message, 'provideSongOrUrl');
      return;
    }

    const query = args.join(' ');
    
    try {
      await musicPlayer.join(message);
      await musicPlayer.play(message, query);
    } catch (error) {
      await messageManager.reply(message, 'errorPlayingSong');
    }
  },
};

export default play;