import { Message, Client } from 'discord.js';
import { Command, Config } from '../types/index.js';
import { messageManager } from '../utils/messageManager';


export const messageCreate = (client: Client, commands: Map<string, Command>, config: Config) => {
  return async (message: Message): Promise<void> => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = commands.get(commandName);

    if (!command) {
      await messageManager.send(message, 'unknownCommand');
      return;
    }

    try {
      await command.execute(client, message, args);
    } catch (error) {
      console.error(error);
      await messageManager.send(message,'errorExecutingCommand');
    }
  };
};