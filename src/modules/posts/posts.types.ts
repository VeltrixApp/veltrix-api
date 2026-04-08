import { Post, PostStatus } from '@prisma/client';

export interface FromUrlResult {
  post: Post;
  created: boolean;
}

export interface PostResponse {
  id: string;
  sourceUrl: string;
  status: PostStatus;
  title: string;
  summary: string;
  impactScore: number;
  riskScore: number;
  opportunityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export function toPostResponse(post: Post): PostResponse {
  return {
    id: post.id,
    sourceUrl: post.sourceUrl,
    status: post.status,
    title: post.title,
    summary: post.summary,
    impactScore: post.impactScore,
    riskScore: post.riskScore,
    opportunityScore: post.opportunityScore,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}
