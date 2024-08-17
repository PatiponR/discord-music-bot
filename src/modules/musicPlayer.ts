import { VoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import { Message, TextChannel } from 'discord.js';
import youtubeDl from 'youtube-dl-exec';
import { spawn } from 'child_process';
import { Readable } from 'stream';
import sodium from 'sodium-native';
import { messageManager } from '../utils/messageManager';
import * as YoutubeSearchApi from 'youtube-search-api';
import { isValidHttpUrl } from '../utils/urlValidator';
import { SongInfo } from '../types';

const ytDlp = youtubeDl.create('yt-dlp');

class MusicPlayer {
  private connection: VoiceConnection | null = null;
  private audioPlayer = createAudioPlayer();
  private queue: SongInfo[] = [];
  private currentTrack: SongInfo | null = null;
  private textChannel: TextChannel | null = null;

  constructor() {
    if (!sodium) {
      console.error('Failed to load sodium');
    }
  }

  private async searchSong(query: string): Promise<SongInfo | null> {
    try {
      const searchResults = await YoutubeSearchApi.GetListByKeyword(query, false, 1);
      if (searchResults.items && searchResults.items.length > 0) {
        const videoId = searchResults.items[0].id;
        const videoName = searchResults.items[0].title;
        return { 
            url: `https://www.youtube.com/watch?v=${videoId}`,
            title: videoName
        };
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
      await messageManager.reply(message, 'notInVoiceChannel');
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
      await messageManager.reply(message, 'notInVoiceChannel')
      return;
    }

    let songInfo: SongInfo;
    if (isValidHttpUrl(query)) {
        songInfo = { title: 'Unknown Title', url: query };
    } else {
        const searchResult = await this.searchSong(query);
        if (searchResult) {
          songInfo = searchResult;
          await messageManager.send(message, `Found song: ${songInfo.title}`);
        } else {
          await messageManager.reply(message, 'songNotFound');
          return;
        }
    }

    this.queue.push(songInfo);

    if (!this.currentTrack) {
      this.processQueue();
    } else {
        const position = this.queue.length;
        await messageManager.send(message, `Added to queue at position ${position}: ${songInfo.title}`)
    }
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.currentTrack = null;
      return;
    }

    this.currentTrack = this.queue.shift()!;
    try {
      const output = await ytDlp(this.currentTrack.url, {
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
        this.currentTrack.url
      ]);

      const stream = Readable.from(process.stdout);
      const resource = createAudioResource(stream);

      this.audioPlayer.play(resource);

      this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
        this.processQueue();
      });

      await this.textChannel?.send(`Now playing: ${this.currentTrack.title}`);
    } catch (error) {
      console.error('Error playing track:', error);
      await this.textChannel?.send(`An error occurred while trying to play ${this.currentTrack.title}. Skipping to the next one.`);
      this.processQueue();
    }
  }

  async pause(message: Message): Promise<void> {
    if (!this.connection || !this.currentTrack) {
      await messageManager.reply(message, 'nothingPlaying');
      return;
    }

    if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      await messageManager.reply(message, 'alreadyPaused');
      return;
    }

    this.audioPlayer.pause();
    await messageManager.send(message, `Paused: ${this.currentTrack.title}`);
  }

  async resume(message: Message): Promise<void> {
    if (!this.connection || !this.currentTrack) {
      await messageManager.reply(message, 'nothingPlaying');
      return;
    }

    if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
      await messageManager.reply(message, 'alreadyPlaying');
      return;
    }

    this.audioPlayer.unpause();
    await messageManager.send(message, `Resumed: ${this.currentTrack.title}`);
  }


  async skip(message: Message): Promise<void> {
    if (!this.connection || !this.currentTrack) {
      await messageManager.reply(message, 'nothingPlaying');
      return;
    }
  
    const skippedTrack = this.currentTrack;
  
    this.audioPlayer.stop();
    await messageManager.send(message, `Skipped: ${skippedTrack.title}`);
  
    if (this.queue.length > 0) {
      this.processQueue();
    } else {
      this.currentTrack = null;
      await messageManager.send(message, 'queueEmpty');
    }
  }

  async stop(): Promise<void> {
    this.queue = [];
    this.audioPlayer.stop();
    this.currentTrack = null;
    await this.textChannel?.send('Stopped playback and cleared the queue.');
  }

  getQueue(): { current: SongInfo | null, upcoming: SongInfo[] } {
    return { 
        current: this.currentTrack,
        upcoming: [...this.queue]
    }
  }

}

export const musicPlayer = new MusicPlayer();