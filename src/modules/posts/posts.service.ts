import { Injectable } from '@nestjs/common';
import { PostStatus, Prisma } from '@prisma/client';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { FromUrlResult } from './posts.types';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async createDraftFromUrl(sourceUrl: string): Promise<FromUrlResult> {
    const existing = await this.prisma.post.findUnique({ where: { sourceUrl } });
    if (existing) {
      return { post: existing, created: false };
    }

    const enrichment = this.aiService.enrichFromUrl(sourceUrl);

    try {
      const created = await this.prisma.post.create({
        data: {
          sourceUrl,
          status: PostStatus.DRAFT,
          title: enrichment.title,
          summary: enrichment.summary,
          impactScore: enrichment.impactScore,
          riskScore: enrichment.riskScore,
          opportunityScore: enrichment.opportunityScore,
        },
      });

      return { post: created, created: true };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const post = await this.prisma.post.findUniqueOrThrow({ where: { sourceUrl } });
        return { post, created: false };
      }

      throw error;
    }
  }
}
