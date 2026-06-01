export interface ProspectSource {
  id: string;
  type: 'url';
  value: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string | null;
}

export type ExtractionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Prospect {
  id: string;
  name: string;
  jobTitle: string | null;
  company: string | null;
  extractionStatus: ExtractionStatus;
  createdAt: Date;
  metadata: {
    profileImageUrl?: string | null;
    location?: string | null;
  } | null;
  sources: ProspectSource[];
  sourceUrl?: string | null;
  sourceType?: string | null;
}

export interface ProspectDetail extends Prospect {
  updatedAt: Date;
  companyDescription: string | null;
  bio: string | null;
  painPoints: string | null;
  skills: string | null;
  rawExtractedData: string | null;
}
