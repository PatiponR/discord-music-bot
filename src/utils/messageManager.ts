import { Message } from 'discord.js';
import { ResponseMessages } from './responseMessages';

export class MessageManager {
    private static instance: MessageManager;
  
    private constructor() {}
  
    public static getInstance(): MessageManager {
      if (!MessageManager.instance) {
        MessageManager.instance = new MessageManager();
      }
      return MessageManager.instance;
    }
  
    async reply(message: Message, key: keyof typeof ResponseMessages): Promise<void> {
      try {
        await message.reply(ResponseMessages[key]);
      } catch (error) {
        console.error('Error sending reply:', error);
      }
    }
  
    async send(message: Message, content: string): Promise<void> {
      try {
        await message.channel.send(content);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  
    getContent(key: keyof typeof ResponseMessages): string {
      return ResponseMessages[key];
    }
  }
  
  export const messageManager = MessageManager.getInstance();