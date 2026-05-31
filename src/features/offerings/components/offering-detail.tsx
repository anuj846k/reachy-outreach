'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Pencil,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExtractionStatusBadge } from './extraction-status-badge';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import type { OfferingDetail } from '@/features/offerings/lib/utils';
import { formatUrlHostname } from '@/features/offerings/lib/utils';
import { SourceIcon } from './source-icon';
import { EditOfferingDialog } from './edit-offering-dialog';

interface OfferingDetailProps {
  offering: OfferingDetail;
}

function InsightSection({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  if (!content) return null;
  return (
    <div className='space-y-1.5'>
      <h3 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
        {title}
      </h3>
      <p className='text-sm leading-relaxed whitespace-pre-wrap text-foreground'>
        {content}
      </p>
    </div>
  );
}

export function OfferingDetail({ offering }: OfferingDetailProps) {
  const [markdownExpanded, setMarkdownExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const {
    name,
    sourceUrl,
    sourceType,
    extractionStatus,
    createdAt,
    offeringSummary,
    idealCustomerProfile,
    customerProblems,
    keyDifferentiators,
    proofPoints,
    rawExtractedData,
    metadata,
  } = offering;

  const hasInsights =
    offeringSummary ||
    idealCustomerProfile ||
    customerProblems ||
    keyDifferentiators ||
    proofPoints;

  const displayUrl = sourceUrl ? formatUrlHostname(sourceUrl) : null;

  return (
    <div className='space-y-6'>
      <Button variant='ghost' size='sm' asChild className='-ml-2'>
        <Link href='/dashboard/offerings'>
          <ArrowLeft />
          Back to Offerings
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
            <div className='space-y-2'>
              <div className='flex flex-wrap items-center gap-2'>
                <ExtractionStatusBadge status={extractionStatus} />
                <Badge variant='outline' className='gap-1'>
                  <SourceIcon sourceType={sourceType} />
                  {sourceType.charAt(0).toUpperCase() + sourceType.slice(1)}
                </Badge>
              </div>
              <CardTitle className='text-xl'>{name}</CardTitle>
              {metadata?.pageDescription && (
                <CardDescription className='line-clamp-2'>
                  {metadata.pageDescription}
                </CardDescription>
              )}
            </div>

            <div className='flex  flex-col gap-2 self-center'>
              {sourceUrl && (
                <Button
                  variant='outline'
                  size='sm'
                  asChild
                  className='shrink-0'
                >
                  <a href={sourceUrl} target='_blank' rel='noopener noreferrer'>
                    <ExternalLink />
                    {displayUrl}
                  </a>
                </Button>
              )}
              <Button
                variant='outline'
                size='sm'
                className='shrink-0'
                onClick={() => setEditOpen(true)}
              >
                <Pencil />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className='pt-0 text-xs text-muted-foreground'>
          Created{' '}
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </CardContent>
      </Card>

      {extractionStatus === 'completed' && hasInsights ? (
        <Card>
          <CardHeader className='border-b border-border/50 pb-4'>
            <CardTitle className='text-base'>Extracted Insights</CardTitle>
            <CardDescription>
              Automatically extracted from the source URL.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6 pt-5'>
            <InsightSection
              title='Offering Summary'
              content={offeringSummary}
            />
            {offeringSummary &&
              (idealCustomerProfile ||
                customerProblems ||
                keyDifferentiators ||
                proofPoints) && <Separator />}
            <InsightSection
              title='Ideal Customer Profile'
              content={idealCustomerProfile}
            />
            {idealCustomerProfile &&
              (customerProblems || keyDifferentiators || proofPoints) && (
                <Separator />
              )}
            <InsightSection
              title='Customer Problems'
              content={customerProblems}
            />
            {customerProblems && (keyDifferentiators || proofPoints) && (
              <Separator />
            )}
            <InsightSection
              title='Key Differentiators'
              content={keyDifferentiators}
            />
            {keyDifferentiators && proofPoints && <Separator />}
            <InsightSection title='Proof Points' content={proofPoints} />
          </CardContent>
        </Card>
      ) : extractionStatus === 'pending' ||
        extractionStatus === 'processing' ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <p className='text-sm text-muted-foreground'>
              Extraction is in progress. This page will update automatically.
            </p>
          </CardContent>
        </Card>
      ) : extractionStatus === 'failed' ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <p className='text-sm text-destructive'>
              Extraction failed. Please delete this offering and try again.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {rawExtractedData && (
        <Card>
          <CardHeader className='border-b border-border/50 pb-4'>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-base'>
                  Raw Extracted Content
                </CardTitle>
                <CardDescription className='mt-0.5'>
                  Source data extracted from the URL
                </CardDescription>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setMarkdownExpanded((v) => !v)}
                className='shrink-0 gap-1.5 text-xs'
              >
                {markdownExpanded ? (
                  <>
                    <ChevronUp className='size-3.5' />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className='size-3.5' />
                    Expand
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className='pt-4 pb-0'>
            <div className='relative'>
              <pre
                className={[
                  'w-full max-w-full whitespace-pre-wrap break-all text-xs leading-relaxed text-muted-foreground font-mono overflow-hidden transition-all duration-500 ease-in-out',
                  markdownExpanded
                    ? 'max-h-[600px] overflow-y-auto pb-4'
                    : 'max-h-[9rem]',
                ].join(' ')}
              >
                {rawExtractedData}
              </pre>

              {!markdownExpanded && (
                <div
                  className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none'
                  aria-hidden='true'
                />
              )}
            </div>

            <div className='flex justify-center py-3 border-t border-border/40 mt-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setMarkdownExpanded((v) => !v)}
                className='h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground'
              >
                {markdownExpanded ? (
                  <>
                    <ChevronUp className='size-3.5' />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className='size-3.5' />
                    Show full content
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <EditOfferingDialog
        offering={offering}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
