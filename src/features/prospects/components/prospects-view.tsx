'use client';

import { useState } from 'react';
import { CreateProspectDialog } from './create-prospect-dialog';
import { CreateProspectManualDialog } from './create-prospect-manual-dialog';
import { EmptyProspects } from './empty-prospects';
import { ProspectsList } from './prospects-list';
import { Prospect } from '@/features/prospects/lib/utils';

interface ProspectsViewProps {
  userId: string;
  prospects: Prospect[];
}

export function ProspectsView({ userId, prospects }: ProspectsViewProps) {
  const [autoDialogOpen, setAutoDialogOpen] = useState(false);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prospects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your outreach targets
          </p>
        </div>
        <div className="flex gap-2 animate-in fade-in-50 duration-200">
          <CreateProspectDialog
            userId={userId}
            open={autoDialogOpen}
            onOpenChange={setAutoDialogOpen}
          />
          <CreateProspectManualDialog
            userId={userId}
            open={manualDialogOpen}
            onOpenChange={setManualDialogOpen}
          />
        </div>
      </div>

      {prospects.length === 0 ? (
        <EmptyProspects
          onAutoClick={() => setAutoDialogOpen(true)}
          onManualClick={() => setManualDialogOpen(true)}
        />
      ) : (
        <ProspectsList prospects={prospects} />
      )}
    </div>
  );
}
