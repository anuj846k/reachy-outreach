'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Trash2, Eye, Copy, Check } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
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
import { deleteOutreach } from '@/features/outreach/actions';
import { OutreachDetailDialog } from './outreach-detail-dialog';

interface OutreachCardProps {
  id: string;
  subjectLine: string | null;
  content: string;
  tone: string | null;
  status: string;
  createdAt: Date;
  offeringName: string | null;
  prospectName: string | null;
}

export function OutreachCard({
  id,
  subjectLine,
  content,
  tone,
  status,
  createdAt,
  offeringName,
  prospectName,
}: OutreachCardProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const preview = content.slice(0, 120) + (content.length > 120 ? '...' : '');

  async function handleCopy() {
    const textToCopy = subjectLine
      ? `Subject: ${subjectLine}\n\n${content}`
      : content;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteOutreach(id);
        toast.success('Outreach deleted.');
      } catch {
        toast.error('Failed to delete outreach.');
      }
    });
  }

  return (
    <>
      <Card
        className='group/card transition-all duration-200  border hover:border-primary/85 hover:shadow-lg cursor-pointer'
        onClick={() => setDetailOpen(true)}
      >
        <CardHeader className='border-b border-border/50 pb-3'>
          <div className='flex items-center gap-2'>
            <Badge variant={status === 'sent' ? 'default' : 'outline'}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            {tone && (
              <Badge variant='secondary' className='text-xs'>
                {tone}
              </Badge>
            )}
          </div>
          <CardTitle className='mt-2 line-clamp-1 text-sm font-semibold'>
            {subjectLine || 'No subject'}
          </CardTitle>
          <CardAction onClick={(e) => e.stopPropagation()}>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    className='opacity-0 group-hover/card:opacity-100 transition-opacity'
                    aria-label='Outreach actions'
                  >
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-44'>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      setDetailOpen(true);
                    }}
                  >
                    <Eye />
                    View details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopy}>
                    {copied ? (
                      <Check className='size-4' />
                    ) : (
                      <Copy className='size-4' />
                    )}
                    {copied ? 'Copied!' : 'Copy message'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem variant='destructive'>
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialogContent size='sm'>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <Trash2 className='text-destructive' />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete outreach?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This message will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant='destructive'
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

        <CardContent className='pt-3'>
          <p className='text-sm text-muted-foreground line-clamp-3'>
            {preview}
          </p>
          <div className='mt-2 flex flex-wrap gap-1 text-xs text-muted-foreground'>
            {offeringName && (
              <span className='truncate'>For: {offeringName}</span>
            )}
            {prospectName && offeringName && (
              <span className='text-border'>·</span>
            )}
            {prospectName && (
              <span className='truncate'>To: {prospectName}</span>
            )}
          </div>
        </CardContent>

        <CardFooter className='flex items-center justify-between gap-2 text-xs text-muted-foreground'>
          <span>
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
          <Button
            variant='ghost'
            size='xs'
            onClick={(e) => {
              e.stopPropagation();
              setDetailOpen(true);
            }}
            className='h-auto px-1.5 py-0.5 text-xs gap-0.5'
          >
            View <Eye className='size-3' />
          </Button>
        </CardFooter>
      </Card>

      <OutreachDetailDialog
        outreach={{
          id,
          subjectLine,
          content,
          tone,
          status,
          offeringName,
          prospectName,
        }}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
