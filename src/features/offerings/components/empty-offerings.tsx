'use client';

import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface EmptyOfferingsProps {
  onCreateClick: () => void;
}

export function EmptyOfferings({ onCreateClick }: EmptyOfferingsProps) {
  return (
    <Empty className="min-h-[360px] border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Briefcase className="size-5" />
        </EmptyMedia>
        <EmptyTitle>No offerings yet</EmptyTitle>
        <EmptyDescription>
          Create your first offering to extract key details from a website or LinkedIn page.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" onClick={onCreateClick}>
          <Plus />
          Create Offering
        </Button>
      </EmptyContent>
    </Empty>
  );
}
