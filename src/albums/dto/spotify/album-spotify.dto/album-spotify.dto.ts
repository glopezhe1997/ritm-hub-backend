export class AlbumSpotifyDto {
  id: string; // This is the Spotify ID
  name: string;
  images: { url: string }[];
  artists: { id: string }[];
  total_tracks: number;
}
