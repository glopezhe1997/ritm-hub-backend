import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from 'src/posts/dto/create-post.dto/create-post.dto';
import { PostDto } from 'src/posts/dto/post.dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  //Get all Owner's posts
  async getAllPostsByOwner(ownerId: number): Promise<PostDto[]> {
    const posts = await this.postsRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner', 'track'],
    });
    return this.toPostsDto(posts);
  }

  // Create posts
  async createPost(
    ownerId: number,
    createPostData: CreatePostDto,
  ): Promise<PostDto> {
    const newPost = this.postsRepository.create({
      ...createPostData,
      owner: { id: ownerId }, // Relaciona el post con el usuario
    });
    const savedPost = await this.postsRepository.save(newPost);
    return this.toPostDto(savedPost);
  }

  private toPostDto(post: Post): PostDto {
    return {
      post_id: post.post_id,
      title: post.title,
      content: post.content,
      status: post.status,
      createdAt: post.createdAt,
      owner: post.owner,
      track: post.track
        ? {
            ...post.track,
            preview_url: post.track.preview_url ?? '',
          }
        : undefined,
    };
  }

  private toPostsDto(posts: Post[]): PostDto[] {
    return posts.map((post) => this.toPostDto(post));
  }
}
