import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard';
import { CreatePostDto } from 'src/posts/dto/create-post.dto/create-post.dto';
import { PostDto } from 'src/posts/dto/post.dto/post.dto';
import { PostsService } from 'src/posts/services/posts/posts.service';
import { AuthenticatedRequestDto } from 'src/shared/dto/authenticated-request.dto/authenticated-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  //Get all owner's posts
  @Get('my-posts')
  async getAllPostsByOwner(
    @Req() req: AuthenticatedRequestDto,
  ): Promise<PostDto[]> {
    const ownerId = req.user.id;
    // Only the owner can see his own posts
    return this.postsService.getAllPostsByOwner(ownerId);
  }

  //Create post
  @Post('create-post')
  async createPost(
    @Req()
    req: AuthenticatedRequestDto,
    @Body() createPostData: CreatePostDto,
  ): Promise<PostDto> {
    const ownerId = req.user.id;
    // Only the owner can create his own posts
    return this.postsService.createPost(ownerId, createPostData);
  }
}
