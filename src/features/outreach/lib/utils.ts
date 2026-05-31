export type OutreachStatus = 'draft' | 'sent' | 'archived';

export interface OutreachMessage {
  id: string;
  offeringId: string | null;
  prospectId: string | null;
  subjectLine: string | null;
  content: string;
  tone: string | null;
  customContext: string | null;
  status: OutreachStatus;
  createdAt: Date;
}

export interface OutreachMessageDetail extends OutreachMessage {
  updatedAt: Date;
  offeringName?: string | null;
  prospectName?: string | null;
}
