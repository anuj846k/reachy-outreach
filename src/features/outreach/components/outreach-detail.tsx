'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Copy, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface OutreachDetailProps {
  message: {
    id: string;
    subjectLine: string | null;
    content: string;
    tone: string | null;
    customContext: string | null;
    status: string;
    createdAt: Date;
    offeringName?: string | null;
    prospectName?: string | null;
    prospectJobTitle?: string | null;
    prospectCompany?: string | null;
  };
}

export function OutreachDetail({ message }: OutreachDetailProps) {
  const [copied, setCopied] = useState(false);

  const {
    subjectLine,
    content,
    tone,
    customContext,
    status,
    createdAt,
    offeringName,
    prospectName,
    prospectJobTitle,
    prospectCompany,
  } = message;

  async function handleCopy() {
    const textToCopy = subjectLine
      ? `Subject: ${subjectLine}\n\n${content}`
      : content;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/dashboard/outreach">
          <ArrowLeft />
          Back to Outreach
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={status === 'sent' ? 'default' : 'outline'}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
                {tone && (
                  <Badge variant="secondary" className="text-xs">
                    {tone}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">
                {subjectLine || 'No subject line'}
              </CardTitle>
              <CardDescription>
                {offeringName && prospectName
                  ? `Outreach for ${offeringName} to ${prospectName}${
                      prospectJobTitle && prospectCompany
                        ? ` (${prospectJobTitle} at ${prospectCompany})`
                        : ''
                    }`
                  : 'Generated outreach message'}
              </CardDescription>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5"
              >
                {copied ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {customContext && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <span className="font-medium text-muted-foreground">
                Additional context:
              </span>{' '}
              {customContext}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Message
            </h3>
            <div className="rounded-lg border bg-card p-6">
              {subjectLine && (
                <p className="text-sm font-semibold text-foreground mb-4">
                  Subject: {subjectLine}
                </p>
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {content}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
