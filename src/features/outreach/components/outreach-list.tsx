'use client';

import { useRouter } from 'next/navigation';
import { OutreachCard } from './outreach-card';

interface OutreachListProps {
  outreaches: {
    id: string;
    offeringId: string | null;
    prospectId: string | null;
    subjectLine: string | null;
    content: string;
    tone: string | null;
    status: string;
    createdAt: Date;
    offeringName: string | null;
    prospectName: string | null;
  }[];
}

export function OutreachList({ outreaches }: OutreachListProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {outreaches.map((outreach) => (
        <OutreachCard key={outreach.id} {...outreach} />
      ))}
    </div>
  );
}
