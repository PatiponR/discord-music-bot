import { Client } from 'discord.js';
import { Command, Config } from '../types';
import { messageCreate } from '../events/messageCreate';


export function loadEvents(client: Client, commands: Map<string, Command>, config: Config): void {
  client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on('messageCreate', messageCreate(client, commands, config));
}