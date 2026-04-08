import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreatePostFromUrlDto } from './dto/create-post-from-url.dto';
import { PostsService } from './posts.service';
import { PostResponse, toPostResponse } from './posts.types';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('from-url')
  async fromUrl(
    @Body() dto: CreatePostFromUrlDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<PostResponse> {
    const result = await this.postsService.createDraftFromUrl(dto.sourceUrl);
    response.status(result.created ? HttpStatus.CREATED : HttpStatus.OK);

    return toPostResponse(result.post);
  }
}
