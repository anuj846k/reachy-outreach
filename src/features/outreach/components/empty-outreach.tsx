'use client';

import { MailPlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface EmptyOutreachProps {
  onCreateClick: () => void;
}

export function EmptyOutreach({ onCreateClick }: EmptyOutreachProps) {
  return (
    <Empty className="min-h-[360px] border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MailPlus className="size-5" />
        </EmptyMedia>
        <EmptyTitle>No outreach messages yet</EmptyTitle>
        <EmptyDescription>
          Generate your first personalized outreach message by combining an
          offering with a prospect.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" onClick={onCreateClick}>
          <Sparkles className="mr-1.5 size-3.5" />
          Generate message
        </Button>
      </EmptyContent>
    </Empty>
  );
}
