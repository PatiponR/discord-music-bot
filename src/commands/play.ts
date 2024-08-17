import { Command } from '../types';
import { musicPlayer } from '../modules/musicPlayer';
import { searchYoutube } from 'youtube-search-api';
import ytdl from 'ytdl-core';

const play: Command = {
  name: 'play',
  description: 'Play a song from YouTube',
  execute: async (client, message, args) => {
    if (!args.length) {
      await message.reply('Please provide a song name or YouTube URL!');
      return;
    }

    let query = args.join(' ');
    
    try {
      if (!ytdl.validateURL(query)) {
        const searchResults = await searchYoutube(query);
        if (searchResults.items.length > 0) {
          const videoId = searchResults.items[0].id;
          query = `https://www.youtube.com/watch?v=${videoId}`;
        } else {
          await message.reply('No results found for your query.');
          return;
        }
      }

      await musicPlayer.join(message);
      await musicPlayer.play(query);
    } catch (error) {
      console.error('Error in play command:', error);
      await message.reply('An error occurred while trying to play the song.');
    }
  },
};

export default play;