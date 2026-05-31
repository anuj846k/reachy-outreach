'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Trash2, Eye, ExternalLink } from 'lucide-react';
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
import { deleteProspect } from '@/features/prospects/actions';
import { Prospect } from '@/features/prospects/lib/utils';

export function ProspectCard({
  id,
  name,
  jobTitle,
  company,
  sourceUrl,
  extractionStatus,
  createdAt,
  metadata,
}: Prospect) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const profileImage = metadata?.profileImageUrl;

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteProspect(id);
        toast.success('Prospect deleted.');
      } catch {
        toast.error('Failed to delete prospect.');
      }
    });
  }

  return (
    <Card className="group/card transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="border-b border-border/50 pb-3">
        <div className="flex items-center gap-3">
          {profileImage ? (
            <img
              src={profileImage}
              alt=""
              className="size-10 rounded-full object-cover shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold text-sm">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-1 text-sm font-semibold">{name}</CardTitle>
            {jobTitle && (
              <p className="text-xs text-muted-foreground truncate">{jobTitle}</p>
            )}
          </div>
          <ExtractionStatusBadge status={extractionStatus} />
        </div>

        <CardAction>
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 group-hover/card:opacity-100 transition-opacity"
                  aria-label="Prospect actions"
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/prospects/${id}`}>
                    <Eye />
                    View details
                  </Link>
                </DropdownMenuItem>
                {sourceUrl && (
                  <DropdownMenuItem asChild>
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink />
                      Open source
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
                <AlertDialogTitle>Delete prospect?</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong className="font-medium text-foreground">{name}</strong> will be
                  permanently deleted.
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
        {company && (
          <p className="text-sm text-muted-foreground">{company}</p>
        )}
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors truncate max-w-full mt-1"
          >
            <span className="truncate">{new URL(sourceUrl).hostname.replace('www.', '')}</span>
            <ExternalLink className="size-3 shrink-0" />
          </a>
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
          <Link href={`/dashboard/prospects/${id}`}>
            View <Eye className="ml-0.5 size-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
