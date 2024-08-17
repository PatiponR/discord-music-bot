import { Message } from 'discord.js';

interface Command {
  name: string;
  execute: (message: Message, args: string[]) => Promise<void>;
}

const prefix = '!'; // You can change this to your preferred prefix

const commands: Map<string, Command> = new Map();

export function registerCommand(command: Command) {
  commands.set(command.name, command);
}

export async function handleCommand(message: Message) {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = commands.get(commandName);

  if (!command) {
    await message.reply('Unknown command. Type !help for a list of commands.');
    return;
  }

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    await message.reply('There was an error trying to execute that command!');
  }
}

// Example command registration
registerCommand({
  name: 'ping',
  execute: async (message) => {
    await message.reply('Pong!');
  },
});