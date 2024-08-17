import { VoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import { Message, TextChannel } from 'discord.js';
import youtubeDl from 'youtube-dl-exec';
import { spawn } from 'child_process';
import { Readable } from 'stream';
import sodium from 'sodium-native';
import { messageManager } from '../utils/messageManager';
import * as YoutubeSearchApi from 'youtube-search-api';
import { isValidHttpUrl } from '../utils/urlValidator';

const ytDlp = youtubeDl.create('yt-dlp');

class MusicPlayer {
  private connection: VoiceConnection | null = null;
  private audioPlayer = createAudioPlayer();
  private queue: string[] = [];
  private currentTrack: string | null = null;
  private textChannel: TextChannel | null = null;

  constructor() {
    if (!sodium) {
      console.error('Failed to load sodium');
    }
  }

  private async searchSong(query: string): Promise<string | null> {
    try {
      const searchResults = await YoutubeSearchApi.GetListByKeyword(query, false, 1);
      if (searchResults.items && searchResults.items.length > 0) {
        const videoId = searchResults.items[0].id;
        return `https://www.youtube.com/watch?v=${videoId}`;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error searching for song:', error);
      return null;
    }
  }

  async join(message: Message): Promise<void> {
    if (!message.member?.voice.channel) {
      await messageManager.send(message, 'notInVoiceChannel');
      return;
    }

    this.connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild!.id,
      adapterCreator: message.guild!.voiceAdapterCreator,
      selfDeaf: true,
    });

    this.textChannel = message.channel as TextChannel;
    this.connection.subscribe(this.audioPlayer);

  }

  async play(message: Message, query: string): Promise<void> {
    if (!this.connection) {
      await messageManager.send(message, 'notInVoiceChannel')
      return;
    }

    let url: string;
    if (isValidHttpUrl(query)) {
      url = query;
    } else {
      const searchResult = await this.searchSong(query);
      if (searchResult) {
        url = searchResult;
        await this.textChannel?.send(`Found song: ${url}`);
      } else {
        await messageManager.send(message, 'songNotFound');
        return;
      }
    }

    this.queue.push(url);

    if (!this.currentTrack) {
      this.processQueue();
    } else {
        await messageManager.send(message, 'addedToQueue');
    }
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.currentTrack = null;
      return;
    }

    this.currentTrack = this.queue.shift()!;
    try {
      const output = await ytDlp(this.currentTrack, {
        dumpSingleJson: true,
        skipDownload: true,
        youtubeSkipDashManifest: true,
        preferFreeFormats: true,
        noCheckCertificates: true,
      });

      const audioFormats = output.formats.filter((format: any) => format.acodec !== 'none' && format.vcodec === 'none');
      const bestAudioFormat = audioFormats.sort((a: any, b: any) => b.abr - a.abr)[0];

      if (!bestAudioFormat) {
        throw new Error('No suitable audio format found');
      }

      const process = spawn('yt-dlp', [
        '--no-check-certificate',
        '-o', '-',
        '-f', bestAudioFormat.format_id,
        this.currentTrack
      ]);

      const stream = Readable.from(process.stdout);
      const resource = createAudioResource(stream);

      this.audioPlayer.play(resource);

      this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
        this.processQueue();
      });

      await this.textChannel?.send(`Now playing: ${output.title}`);
    } catch (error) {
      console.error('Error playing track:', error);
      await this.textChannel?.send('An error occurred while trying to play the track. Skipping to the next one.');
      this.processQueue();
    }
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