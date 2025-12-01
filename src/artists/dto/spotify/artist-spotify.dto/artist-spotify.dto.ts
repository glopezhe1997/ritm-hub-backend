export class ArtistSpotifyDto {
  id: string; // external id
  name: string;
  followers: { total: number };
  genres: string[];
  images: { url: string; height: number; width: number }[];
  type: string;
}
