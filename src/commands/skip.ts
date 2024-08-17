import { Command } from '../types';
import { musicPlayer } from '../modules/musicPlayer';

const skip: Command = {
  name: 'skip',
  description: 'Skip the current song',
  execute: async (client, message) => {
    await musicPlayer.skip();
  },
};

export default skip;