import { VoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import { Message, TextChannel } from 'discord.js';

class MusicPlayer {
  private connection: VoiceConnection | null = null;
  private audioPlayer = createAudioPlayer();
  private queue: string[] = [];
  private currentTrack: string | null = null;
  private textChannel: TextChannel | null = null;

  async join(message: Message): Promise<void> {
    if (!message.member?.voice.channel) {
      await message.reply('You need to be in a voice channel to use this command!');
      return;
    }
5
    this.connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild!.id,
      adapterCreator: message.guild!.voiceAdapterCreator,
    });

    this.textChannel = message.channel as TextChannel;
    this.connection.subscribe(this.audioPlayer);

    await message.reply('Joined the voice channel!');
  }

  async play(url: string): Promise<void> {
    if (!this.connection) {
      await this.textChannel?.send('I\'m not in a voice channel!');
      return;
    }

    this.queue.push(url);

    if (!this.currentTrack) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.currentTrack = null;
      return;
    }

    this.currentTrack = this.queue.shift()!;
    const stream = ytdl(this.currentTrack, { filter: 'audioonly' });
    const resource = createAudioResource(stream);

    this.audioPlayer.play(resource);

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      this.processQueue();
    });

    await this.textChannel?.send(`Now playing: ${this.currentTrack}`);
  }

  async skip(): Promise<void> {
    this.audioPlayer.stop();
    await this.textChannel?.send('Skipped the current track.');
  }

  async stop(): Promise<void> {
    this.queue = [];
    this.audioPlayer.stop();
    this.currentTrack = null;
    await this.textChannel?.send('Stopped playback and cleared the queue.');
  }
}

export const musicPlayer = new MusicPlayer();