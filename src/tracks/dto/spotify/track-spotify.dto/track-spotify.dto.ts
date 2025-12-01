export class TrackSpotifyDto {
  id: string; // Spotify ID
  name: string;
  duration_ms: number;
  preview_url: string | null;
  album: {
    id: string;
    name: string;
    images: { url: string }[];
  };
}
