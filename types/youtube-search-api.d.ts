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
    nextPage: {
      nextPageToken: string;
      nextPageContext: any;
    };
    estimatedResults: number;
    continuation: boolean;
    refinements: string[];
  }

  export function GetListByKeyword(
    keyword: string,
    withDetail?: boolean,
    limit?: number,
    options?: {
      gl?: string;
      hl?: string;
    }
  ): Promise<SearchResponse>;

  export function GetSuggestData(keyword: string): Promise<string[]>;

  export function GetPlaylistData(
    playlistId: string,
    withDetail?: boolean,
    limit?: number
  ): Promise<SearchResponse>;

  export function GetVideoDetails(videoId: string): Promise<SearchResult>;
}