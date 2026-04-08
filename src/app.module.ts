import { Module } from '@nestjs/common';
import { AiModule } from './modules/ai/ai.module';
import { PostsModule } from './modules/posts/posts.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AiModule, PostsModule],
})
export class AppModule {}
