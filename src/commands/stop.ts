import { Command } from '../types';
import { musicPlayer } from '../modules/musicPlayer';

const stop: Command = {
  name: 'stop',
  description: 'Stop playback and clear the queue',
  execute: async (client, message) => {
    await musicPlayer.stop();
  },
};

export default stop;