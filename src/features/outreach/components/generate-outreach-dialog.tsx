'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Braces,
  CircleCheckIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { generateOutreach } from '@/features/outreach/actions';
import { DEFAULT_OUTREACH_TEMPLATE } from '@/lib/prompt-template';

const schema = z.object({
  offeringId: z.string().min(1, 'Select an offering'),
  prospectId: z.string().min(1, 'Select a prospect'),
  tone: z.string().min(1, 'Tone is required'),
  customContext: z.string().optional(),
  customTemplate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const TONE_PRESETS = [
  'professional',
  'casual',
  'enthusiastic',
  'direct',
  'friendly',
  'formal',
];

interface GenerateOutreachDialogProps {
  userId: string;
  offerings: { id: string; name: string }[];
  prospects: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateOutreachDialog({
  userId,
  offerings,
  prospects,
  open,
  onOpenChange,
}: GenerateOutreachDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [showTemplate, setShowTemplate] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      offeringId: '',
      prospectId: '',
      tone: 'professional',
      customContext: '',
      customTemplate: DEFAULT_OUTREACH_TEMPLATE,
    },
  });

  const selectedTone = watch('tone');

  function handleOpenChange(value: boolean) {
    if (!value) reset();
    onOpenChange(value);
  }

  function handleInsertVariable(variable: string) {
    const textarea = document.getElementById(
      'custom-template',
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newVal = before + variable + after;
      setValue('customTemplate', newVal);

      textarea.focus();
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + variable.length;
      }, 0);
    } else {
      const current = watch('customTemplate') || '';
      setValue('customTemplate', current + variable);
    }
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const toastId = toast.loading('Generating outreach message...');
      try {
        await generateOutreach({
          offeringId: values.offeringId,
          prospectId: values.prospectId,
          tone: values.tone,
          customContext: values.customContext,
          customTemplate:
            values.customTemplate !== DEFAULT_OUTREACH_TEMPLATE
              ? values.customTemplate
              : undefined,
          userId,
        });

        toast.success('Outreach message generated!', { id: toastId });
        reset();
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong.';
        toast.error(message, { id: toastId });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size='sm'>
          <Plus />
          New Outreach
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-lg max-h-[90vh] flex flex-col p-6 overflow-hidden'>
        <DialogHeader className='shrink-0 pb-2 border-b border-border/50'>
          <DialogTitle>Generate outreach message</DialogTitle>
          <DialogDescription>
            Select an offering and prospect, then choose a tone. Our AI will
            write a personalized message.
          </DialogDescription>
        </DialogHeader>

        <form
          id='generate-outreach-form'
          onSubmit={handleSubmit(onSubmit)}
          className='flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar-thin'
        >
          <div className='space-y-1.5'>
            <Label htmlFor='offering'>Offering *</Label>
            <Select onValueChange={(v) => setValue('offeringId', v)}>
              <SelectTrigger>
                <SelectValue placeholder='Select what you sell' />
              </SelectTrigger>
              <SelectContent>
                {offerings.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type='hidden' {...register('offeringId')} />
            {errors.offeringId && (
              <p className='text-xs text-destructive'>
                {errors.offeringId.message}
              </p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='prospect'>Prospect *</Label>
            <Select onValueChange={(v) => setValue('prospectId', v)}>
              <SelectTrigger>
                <SelectValue placeholder='Select who to reach out to' />
              </SelectTrigger>
              <SelectContent>
                {prospects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type='hidden' {...register('prospectId')} />
            {errors.prospectId && (
              <p className='text-xs text-destructive'>
                {errors.prospectId.message}
              </p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='tone'>Tone of voice *</Label>
            <div className='flex flex-wrap gap-2'>
              {TONE_PRESETS.map((tone) => (
                <Button
                  key={tone}
                  type='button'
                  size='xs'
                  variant={selectedTone === tone ? 'default' : 'outline'}
                  onClick={() => setValue('tone', tone)}
                >
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </Button>
              ))}
            </div>
            <Input
              placeholder='Or type a custom tone...'
              {...register('tone')}
              className='mt-2'
            />
            {errors.tone && (
              <p className='text-xs text-destructive'>{errors.tone.message}</p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='custom-context'>
              Additional context (optional)
            </Label>
            <Textarea
              id='custom-context'
              placeholder="e.g. Met at SaaStr, they're hiring, recent Series B..."
              rows={2}
              {...register('customContext')}
            />
          </div>

          <div className='border-t border-border/50 pt-4'>
            <button
              type='button'
              onClick={() => setShowTemplate((v) => !v)}
              className='flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors'
            >
              {showTemplate ? (
                <ChevronUp className='size-3.5' />
              ) : (
                <ChevronDown className='size-3.5' />
              )}
              <Braces className='size-3.5' />
              {showTemplate ? 'Hide' : 'Edit'} System Prompt Template
            </button>

            {showTemplate && (
              <div className='mt-4 space-y-3 rounded-lg border bg-muted/30 p-3.5 animate-in fade-in-50 duration-200'>
                <div className='space-y-1'>
                  <Label
                    htmlFor='custom-template'
                    className='text-xs font-medium text-foreground'
                  >
                    System Prompt Template
                  </Label>
                  <Textarea
                    id='custom-template'
                    rows={10}
                    className='font-mono text-xs leading-relaxed bg-background'
                    {...register('customTemplate')}
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider'>
                    <CircleCheckIcon className='size-3' /> Click variables to
                    insert at cursor
                  </div>

                  <div className='space-y-2.5 text-[11px]'>
                    <div>
                      <span className='font-medium text-muted-foreground block mb-1'>
                        Prospect:
                      </span>
                      <div className='flex flex-wrap gap-1.5'>
                        {[
                          { name: 'Name', token: '{{prospectName}}' },
                          { name: 'Job Title', token: '{{prospectJobTitle}}' },
                          { name: 'Company', token: '{{prospectCompany}}' },
                          { name: 'Bio', token: '{{prospectBio}}' },
                          {
                            name: 'Pain Points',
                            token: '{{prospectPainPoints}}',
                          },
                        ].map((v) => (
                          <Badge
                            key={v.token}
                            variant='outline'
                            className='cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-[10px] font-mono py-0.5 px-1.5'
                            onClick={() => handleInsertVariable(v.token)}
                          >
                            {v.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className='font-medium text-muted-foreground block mb-1'>
                        Offering:
                      </span>
                      <div className='flex flex-wrap gap-1.5'>
                        {[
                          { name: 'Name', token: '{{offeringName}}' },
                          { name: 'Summary', token: '{{offeringSummary}}' },
                          { name: 'ICP', token: '{{idealCustomerProfile}}' },
                          {
                            name: 'Differentiators',
                            token: '{{keyDifferentiators}}',
                          },
                        ].map((v) => (
                          <Badge
                            key={v.token}
                            variant='outline'
                            className='cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-[10px] font-mono py-0.5 px-1.5'
                            onClick={() => handleInsertVariable(v.token)}
                          >
                            {v.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className='font-medium text-muted-foreground block mb-1'>
                        Context & Style:
                      </span>
                      <div className='flex flex-wrap gap-1.5'>
                        {[
                          { name: 'Tone', token: '{{tone}}' },
                          {
                            name: 'Custom Context',
                            token: '{{customContext}}',
                          },
                        ].map((v) => (
                          <Badge
                            key={v.token}
                            variant='outline'
                            className='cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-[10px] font-mono py-0.5 px-1.5'
                            onClick={() => handleInsertVariable(v.token)}
                          >
                            {v.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        <DialogFooter
          showCloseButton
          className='shrink-0 pt-4 border-t border-border/50'
        >
          <Button
            type='submit'
            form='generate-outreach-form'
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Sparkles className='mr-1.5 size-3.5 animate-pulse' />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className='mr-1.5 size-3.5' />
                Generate message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
