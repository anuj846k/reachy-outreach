export type OfferingSourceType =
  | 'manual'
  | 'website'
  | 'linkedin'
  | 'company'
  | 'mixed';

export type ExtractionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Offering {
  id: string;
  name: string;
  sourceUrl: string | null;
  sourceType: OfferingSourceType;
  extractionStatus: ExtractionStatus;
  createdAt: Date;
  metadata: {
    pageTitle?: string | null;
    pageDescription?: string | null;
    faviconUrl?: string | null;
    ogImageUrl?: string | null;
  } | null;
}

export interface OfferingDetail extends Offering {
  updatedAt: Date;
  offeringSummary: string | null;
  idealCustomerProfile: string | null;
  customerProblems: string | null;
  keyDifferentiators: string | null;
  proofPoints: string | null;
  rawExtractedData: string | null;
}

export function formatUrlHostname(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
}
