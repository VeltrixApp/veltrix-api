import { Injectable } from '@nestjs/common';
import { AiEnrichment } from './ai.types';

@Injectable()
export class AiService {
  enrichFromUrl(sourceUrl: string): AiEnrichment {
    const sanitizedUrl = new URL(sourceUrl);
    const host = sanitizedUrl.hostname.replace(/^www\./, '');
    const path = sanitizedUrl.pathname.replace(/\//g, ' ').trim();
    const readablePath = path.length > 0 ? path : 'latest update';

    return {
      title: `Draft from ${host}`,
      summary: `Stub enrichment for ${host}: ${readablePath}`,
      ...this.computeScores(sourceUrl),
    };
  }

  private computeScores(sourceUrl: string) {
    const lower = sourceUrl.toLowerCase();
    const impactScore = lower.includes('breaking') || lower.includes('release') ? 8 : 6;
    const riskScore = lower.includes('security') || lower.includes('incident') ? 7 : 3;
    const opportunityScore = lower.includes('ai') || lower.includes('oss') ? 8 : 5;

    return {
      impactScore,
      riskScore,
      opportunityScore,
    };
  }
}
