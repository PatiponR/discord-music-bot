import { Command } from '../types';
import { musicPlayer } from '../modules/musicPlayer';

const play: Command = {
  name: 'play',
  description: 'Play a song from YouTube',
  execute: async (client, message, args) => {
    if (!args.length) {
      await message.reply('Please provide a song name or YouTube URL!');
      return;
    }

    const query = args.join(' ');
    
    try {
      await musicPlayer.join(message);
      await musicPlayer.play(query);
    } catch (error) {
      console.error('Error in play command:', error);
      await message.reply('An error occurred while trying to play the song.');
    }
  },
};

export default play;