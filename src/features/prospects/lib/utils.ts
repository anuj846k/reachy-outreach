export type ProspectSourceType =
  | 'manual'
  | 'website'
  | 'linkedin'
  | 'company'
  | 'mixed';

export type ExtractionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Prospect {
  id: string;
  name: string;
  jobTitle: string | null;
  company: string | null;
  sourceUrl: string | null;
  sourceType: ProspectSourceType;
  extractionStatus: ExtractionStatus;
  createdAt: Date;
  metadata: {
    profileImageUrl?: string | null;
    location?: string | null;
  } | null;
}

export interface ProspectDetail extends Prospect {
  updatedAt: Date;
  companyDescription: string | null;
  bio: string | null;
  painPoints: string | null;
  skills: string | null;
  rawExtractedData: string | null;
}
