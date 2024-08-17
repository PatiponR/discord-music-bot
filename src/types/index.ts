import { Client, Message } from 'discord.js';

export interface Command {
  name: string;
  description: string;
  execute: (client: Client, message: Message, args: string[]) => Promise<void>;
}

export interface Config {
  prefix: string;
  environment: string;
}