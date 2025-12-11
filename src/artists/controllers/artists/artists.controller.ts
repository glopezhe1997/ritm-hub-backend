import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ArtistDto } from '../../dto/artist.dto/artist.dto';
import { DeleteResultDto } from '../../../shared/dto/delete-result.dto/delete-result.dto';
import { Artist } from '../../entities/artists.entity';
import { ArtistsService } from '../../services/artists/artists.service';
import { ArtistSpotifyDto } from 'src/artists/dto/spotify/artist-spotify.dto/artist-spotify.dto';

@Controller('artists')
export class ArtistsController {
  constructor(private artistService: ArtistsService) {}

  private toDto(artist: Artist): ArtistDto {
    return {
      id: artist.id,
      name: artist.name,
      external_id: artist.external_id,
      genres: artist.genres,
      followers: artist.followers,
      img_url: artist.img_url,
    };
  }

  @Get('trending')
  async getTrendingArtists(): Promise<ArtistSpotifyDto[]> {
    return this.artistService.getTrendingArtists();
  }

  @Get(':externalId')
  async getArtistByExternalId(
    @Param('externalId') externalId: string,
  ): Promise<ArtistDto | null> {
    const artist = await this.artistService.getArtistByExternalId(externalId);
    return artist ? this.toDto(artist) : null;
  }

  @Get('name/:artistName')
  async getArtistByName(
    @Param('artistName') artistName: string,
  ): Promise<ArtistDto | null> {
    const artist = await this.artistService.getArtistByName(artistName);
    return artist ? this.toDto(artist) : null;
  }

  @Get('insert/:externalId')
  async findOrCreateArtistByExternalId(
    @Param('externalId') externalId: string,
  ): Promise<ArtistDto | null> {
    const artist =
      await this.artistService.findOrCreateArtistByExternalId(externalId);
    return artist ? this.toDto(artist) : null;
  }

  @Delete(':internalId')
  async deleteArtistByInternalId(
    @Param('internalId') internalId: number,
  ): Promise<DeleteResultDto> {
    const artist = await this.artistService.getArtistByInternalId(internalId);
    if (!artist) {
      throw new NotFoundException('Artist not found'); // <-- Millor que Error genèric
    }
    return await this.artistService.deleteArtist(internalId);
  }
}
