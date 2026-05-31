'use client';

import { useState } from 'react';
import { GenerateOutreachDialog } from './generate-outreach-dialog';
import { EmptyOutreach } from './empty-outreach';
import { OutreachList } from './outreach-list';

interface OutreachViewProps {
  userId: string;
  offerings: { id: string; name: string }[];
  prospects: { id: string; name: string }[];
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

export function OutreachView({
  userId,
  offerings,
  prospects,
  outreaches,
}: OutreachViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Outreach</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate and manage personalized outreach messages
          </p>
        </div>
        <GenerateOutreachDialog
          userId={userId}
          offerings={offerings}
          prospects={prospects}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>

      {outreaches.length === 0 ? (
        <EmptyOutreach onCreateClick={() => setDialogOpen(true)} />
      ) : (
        <OutreachList outreaches={outreaches} />
      )}
    </div>
  );
}
