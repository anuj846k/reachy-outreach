'use client';

import { useState } from 'react';
import { CreateOfferingDialog } from './create-offering-dialog';
import { EmptyOfferings } from './empty-offerings';
import { OfferingsList } from './offerings-list';
import { Offering } from '@/features/offerings/lib/utils';

interface OfferingsViewProps {
  userId: string;
  offerings: Offering[];
}

export function OfferingsView({ userId, offerings }: OfferingsViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Offerings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage what you sell and promote
          </p>
        </div>
        <CreateOfferingDialog
          userId={userId}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>

      {offerings.length === 0 ? (
        <EmptyOfferings onCreateClick={() => setDialogOpen(true)} />
      ) : (
        <OfferingsList offerings={offerings} />
      )}
    </div>
  );
}
