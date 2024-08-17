import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadCommands = async (): Promise<Map<string, Command>> => {
  const commands = new Map<string, Command>();
  const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of commandFiles) {
    const { default: command } = await import(`../commands/${file}`);
    commands.set(command.name, command);
  }

  return commands;
};