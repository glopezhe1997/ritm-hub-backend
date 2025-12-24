export class CreatePlaylistDto {
  name: string;
  description?: string;
  images?: string[];
  is_public?: boolean;
}
