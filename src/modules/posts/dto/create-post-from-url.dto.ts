import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreatePostFromUrlDto {
  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  sourceUrl!: string;
}
