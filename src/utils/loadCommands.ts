import fs from 'fs';
import path from 'path';
import { Command } from '../types';

export async function loadCommands(): Promise<Map<string, Command>> {
  const commands = new Map<string, Command>();
  const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`).default;
    commands.set(command.name, command);
  }

  return commands;
}