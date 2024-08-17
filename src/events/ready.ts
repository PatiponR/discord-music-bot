import { Client } from "discord.js";

export const ready = (client: Client): void => {
    console.log(`Logged in as ${client.user?.tag}!`);
};