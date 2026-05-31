'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, MoreHorizontal, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ExtractionStatusBadge } from './extraction-status-badge';
import { deleteOffering } from '@/features/offerings/actions';
import { Offering, formatUrlHostname } from '@/features/offerings/lib/utils';
import { SourceIcon } from './source-icon';

export function OfferingCard({
  id,
  name,
  sourceUrl,
  sourceType,
  extractionStatus,
  createdAt,
  metadata,
}: Offering) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const displayUrl = sourceUrl ? formatUrlHostname(sourceUrl) : null;

  const favicon = metadata?.faviconUrl;

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteOffering(id);
        toast.success('Offering deleted.');
      } catch {
        toast.error('Failed to delete offering. Please try again.');
      }
    });
  }

  return (
    <Card className="group/card transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          {favicon ? (
            <img
              src={favicon}
              alt=""
              className="size-5 rounded-sm object-contain shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-muted">
              <SourceIcon sourceType={sourceType} />
            </div>
          )}
          <ExtractionStatusBadge status={extractionStatus} />
        </div>
        <CardTitle className="mt-2 line-clamp-1 text-sm font-semibold">{name}</CardTitle>
        <CardAction>
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 group-hover/card:opacity-100 transition-opacity"
                  aria-label="Offering actions"
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/offerings/${id}`}>
                    <Eye />
                    View details
                  </Link>
                </DropdownMenuItem>
                {sourceUrl && (
                  <DropdownMenuItem asChild>
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink />
                      Open source URL
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem variant="destructive">
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Trash2 className="text-destructive" />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete offering?</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong className="font-medium text-foreground">{name}</strong> will be
                  permanently deleted. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {isPending ? 'Deleting…' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-3">
        {displayUrl ? (
          <a
            href={sourceUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors truncate max-w-full"
          >
            <SourceIcon sourceType={sourceType} />
            <span className="truncate">{displayUrl}</span>
            <ExternalLink className="size-3 shrink-0" />
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">No source URL</span>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
        <Button
          variant="ghost"
          size="xs"
          asChild
          className="h-auto px-1.5 py-0.5 text-xs"
        >
          <Link href={`/dashboard/offerings/${id}`}>
            View <Eye className="ml-0.5 size-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
