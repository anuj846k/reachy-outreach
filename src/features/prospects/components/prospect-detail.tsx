'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

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
import { ProspectDetail } from '@/features/prospects/lib/utils';
import { EditProspectDialog } from './edit-prospect-dialog';

interface ProspectDetailProps {
  prospect: ProspectDetail;
}

function InsightSection({ title, content }: { title: string; content: string | null }) {
  if (!content) return null;
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
        {content}
      </p>
    </div>
  );
}

export function ProspectDetailView({ prospect }: ProspectDetailProps) {
  const [markdownExpanded, setMarkdownExpanded] = useState(false);

  const {
    name,
    jobTitle,
    company,
    companyDescription,
    bio,
    painPoints,
    skills,
    sources,
    extractionStatus,
    createdAt,
    rawExtractedData,
    metadata,
  } = prospect;

  const urlSource = sources?.find((s) => s.type === 'url');
  const urlSourcesCount = sources?.filter((s) => s.type === 'url').length || 0;
  const deducedSourceType = urlSourcesCount > 1
    ? 'mixed'
    : urlSource
    ? (urlSource.value.includes('linkedin.com') ? 'linkedin' : 'website')
    : (sources?.length > 0 ? 'mixed' : 'manual');

  const hasInsights =
    companyDescription || bio || painPoints || skills;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/dashboard/prospects">
          <ArrowLeft />
          Back to Prospects
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <ExtractionStatusBadge status={extractionStatus} />
                <Badge variant="outline">
                  {deducedSourceType.charAt(0).toUpperCase() + deducedSourceType.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                {metadata?.profileImageUrl ? (
                  <img
                    src={metadata.profileImageUrl}
                    alt=""
                    className="size-12 rounded-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-lg">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <CardTitle className="text-xl">{name}</CardTitle>
                  {(jobTitle || company) && (
                    <CardDescription className="line-clamp-1">
                      {jobTitle}{jobTitle && company ? ' at ' : ''}{company}
                    </CardDescription>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <EditProspectDialog
                prospectId={prospect.id}
                defaultValues={{
                  name,
                  jobTitle: jobTitle || '',
                  company: company || '',
                  companyDescription: companyDescription || '',
                  bio: bio || '',
                  painPoints: painPoints || '',
                  skills: skills || '',
                }}
              />
              {sources
                ?.filter((s) => s.type === 'url')
                .map((source, index) => {
                  let hostname = 'Source';
                  try {
                    hostname = new URL(source.value).hostname.replace('www.', '');
                  } catch (_) {}
                  return (
                    <Button key={source.id || index} variant="outline" size="sm" asChild>
                      <a href={source.value} target="_blank" rel="noopener noreferrer" className="gap-1.5">
                        <ExternalLink className="size-3.5" />
                        {hostname}
                      </a>
                    </Button>
                  );
                })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 text-xs text-muted-foreground">
          Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          {metadata?.location && ` · ${metadata.location}`}
        </CardContent>
      </Card>

      {extractionStatus === 'completed' && hasInsights ? (
        <Card>
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-base">Profile Insights</CardTitle>
            <CardDescription>
              Automatically extracted or manually entered details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-5">
            <InsightSection title="Company Description" content={companyDescription} />
            {companyDescription && (bio || painPoints || skills) && <Separator />}
            <InsightSection title="Bio" content={bio} />
            {bio && (painPoints || skills) && <Separator />}
            <InsightSection title="Pain Points" content={painPoints} />
            {painPoints && skills && <Separator />}
            <InsightSection title="Skills" content={skills} />
          </CardContent>
        </Card>
      ) : extractionStatus === 'pending' || extractionStatus === 'processing' ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Extraction is in progress. This page will update automatically.
            </p>
          </CardContent>
        </Card>
      ) : extractionStatus === 'failed' ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-destructive">
              Extraction failed. Please delete this prospect and try again.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {rawExtractedData && (
        <Card>
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Raw Extracted Content</CardTitle>
                <CardDescription className="mt-0.5">
                  Source data extracted from the prospect profile
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMarkdownExpanded((v) => !v)}
                className="shrink-0 gap-1.5 text-xs"
              >
                {markdownExpanded ? (
                  <>
                    <ChevronUp className="size-3.5" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-3.5" />
                    Expand
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-0">
            <div className="relative">
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
                  className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="flex justify-center py-3 border-t border-border/40 mt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMarkdownExpanded((v) => !v)}
                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                {markdownExpanded ? (
                  <>
                    <ChevronUp className="size-3.5" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-3.5" />
                    Show full content
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
