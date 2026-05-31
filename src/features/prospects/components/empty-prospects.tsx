'use client';

import { Users, Plus, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface EmptyProspectsProps {
  onAutoClick: () => void;
  onManualClick: () => void;
}

export function EmptyProspects({ onAutoClick, onManualClick }: EmptyProspectsProps) {
  return (
    <Empty className="min-h-[360px] border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users className="size-5" />
        </EmptyMedia>
        <EmptyTitle>No prospects yet</EmptyTitle>
        <EmptyDescription>
          Add your first prospect by extracting from a URL or entering details manually.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onAutoClick}>
          <Plus />
          Extract from URL
        </Button>
        <Button size="sm" onClick={onManualClick}>
          <PenLine />
          Create manually
        </Button>
      </EmptyContent>
    </Empty>
  );
}
