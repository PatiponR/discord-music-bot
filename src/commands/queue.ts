import { Message, Client, EmbedBuilder } from 'discord.js';
import { Command } from '../types/index.js';
import { musicPlayer } from '../modules/MusicPlayer';
import { messageManager } from '../utils/messageManager';

const queue: Command = {
    name: 'queue',
    description: 'Display the current music queue',
    execute: async (client: Client, message: Message, args: string[]) => {
      const { current, upcoming } = musicPlayer.getQueue();
  
      if (!current && upcoming.length === 0) {
        await messageManager.reply(message, 'queueEmpty');
        return;
      }
  
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Music Queue')
        .setTimestamp();
  
      if (current) {
        embed.addFields({ name: 'Now Playing', value: current.title });
      }
  
      if (upcoming.length > 0) {
        const queueList = upcoming.map((track, index) => `${index + 1}. ${track.title}`).join('\n');
        embed.addFields({ name: 'Up Next', value: queueList.slice(0, 1024) });
      }
  
      await message.channel.send({ embeds: [embed] });
    },
  };

export default queue;