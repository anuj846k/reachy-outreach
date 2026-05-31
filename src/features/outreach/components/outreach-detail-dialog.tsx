'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Copy, Check, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { updateOutreach } from '@/features/outreach/actions';

const schema = z.object({
  subjectLine: z.string().min(1, 'Subject line is required').max(200),
  content: z.string().min(1, 'Content is required'),
});

type FormValues = z.infer<typeof schema>;

interface OutreachDetailDialogProps {
  outreach: {
    id: string;
    subjectLine: string | null;
    content: string;
    tone: string | null;
    status: string;
    offeringName: string | null;
    prospectName: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OutreachDetailDialog({
  outreach,
  open,
  onOpenChange,
}: OutreachDetailDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      subjectLine: outreach.subjectLine || '',
      content: outreach.content,
    },
  });

  const currentSubject = watch('subjectLine');
  const currentContent = watch('content');

  async function handleCopy() {
    const textToCopy = currentSubject
      ? `Subject: ${currentSubject}\n\n${currentContent}`
      : currentContent;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSave(values: FormValues) {
    startTransition(async () => {
      try {
        await updateOutreach(outreach.id, {
          subjectLine: values.subjectLine,
          content: values.content,
          status: outreach.status as 'draft' | 'sent' | 'archived',
        });
        toast.success('Outreach saved successfully.');
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to save changes.',
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] flex flex-col p-6 overflow-hidden'>
        <DialogHeader className='pb-2 border-b border-border/50 shrink-0'>
          <div className='flex flex-wrap items-center gap-2 mb-1.5'>
            <Badge variant={outreach.status === 'sent' ? 'default' : 'outline'}>
              {outreach.status.charAt(0).toUpperCase() +
                outreach.status.slice(1)}
            </Badge>
            {outreach.tone && (
              <Badge variant='secondary' className='text-xs'>
                {outreach.tone}
              </Badge>
            )}
          </div>
          <DialogTitle className='text-xl'>
            Customize outreach template
          </DialogTitle>
          <DialogDescription className='text-xs mt-0.5'>
            {outreach.offeringName && outreach.prospectName
              ? `Tailoring for ${outreach.offeringName} to ${outreach.prospectName}`
              : 'Customize the AI-generated subject and content before sending.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id='update-outreach-form'
          onSubmit={handleSubmit((values) => handleSave(values))}
          className='flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar-thin'
        >
          <div className='space-y-1.5'>
            <Label
              htmlFor='edit-subject'
              className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'
            >
              Subject Line
            </Label>
            <Input
              id='edit-subject'
              placeholder='Enter subject line...'
              aria-invalid={!!errors.subjectLine}
              {...register('subjectLine')}
              className='font-medium text-foreground text-sm'
            />
            {errors.subjectLine && (
              <p className='text-xs text-destructive'>
                {errors.subjectLine.message}
              </p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label
              htmlFor='edit-content'
              className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'
            >
              Email Body
            </Label>
            <div className='rounded-lg border bg-card p-2 shadow-inner focus-within:ring-1 focus-within:ring-ring'>
              <Textarea
                id='edit-content'
                rows={12}
                placeholder='Write email content here...'
                aria-invalid={!!errors.content}
                {...register('content')}
                className='font-mono text-sm leading-relaxed text-foreground border-0 shadow-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none min-h-[300px]'
              />
            </div>
            {errors.content && (
              <p className='text-xs text-destructive'>
                {errors.content.message}
              </p>
            )}
          </div>
        </form>

        <div className='pt-4 border-t border-border/50 shrink-0 flex items-center justify-between w-full'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleCopy}
            className='gap-1.5 text-xs h-9 shrink-0'
          >
            {copied ? (
              <Check className='size-3.5' />
            ) : (
              <Copy className='size-3.5' />
            )}
            {copied ? 'Copied' : 'Copy email'}
          </Button>

          <div className='flex items-center gap-2 shrink-0'>
            <DialogClose asChild>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='text-xs h-9'
              >
                Close
              </Button>
            </DialogClose>
            <Button
              type='submit'
              form='update-outreach-form'
              size='sm'
              disabled={isPending}
              className='gap-1.5 text-xs h-9'
            >
              <Save className='size-3.5' />
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
