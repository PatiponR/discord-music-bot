declare module 'youtube-search-api' {
  export interface SearchResult {
    id: string;
    title: string;
    thumbnail: {
      thumbnails: Array<{
        url: string;
        width: number;
        height: number;
      }>;
    };
    description: string;
    channelTitle: string;
    publishedAt: string;
    duration: string;
  }

  export interface SearchResponse {
    items: SearchResult[];
    nextPageToken: string;
    estimatedResults: number;
  }

  export function searchYoutube(
    query: string,
    options?: {
      maxResults?: number;
      regionCode?: string;
      type?: 'video' | 'channel' | 'playlist';
    }
  ): Promise<SearchResponse>;
}