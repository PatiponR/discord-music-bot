import { Client } from "discord.js";
import { ready } from "../events/ready.js";
import { messageCreate } from "../events/messageCreate.js";
import { Command, Config } from '../types/index.js';


export const loadEvents = (client: Client, commands: Map<string, Command>, config: Config): void => {
    client.once('ready', () => ready(client));
    client.on('messageCreate', messageCreate(client, commands, config));
};