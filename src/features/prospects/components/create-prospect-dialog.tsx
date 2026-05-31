'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createProspectWithExtraction } from '@/features/prospects/actions';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  sourceUrl: z
    .string()
    .min(1, 'Source URL is required')
    .url('Please enter a valid URL'),
});

type FormValues = z.infer<typeof schema>;

interface CreateProspectDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProspectDialog({ userId, open, onOpenChange }: CreateProspectDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', sourceUrl: '' },
  });

  function handleOpenChange(value: boolean) {
    if (!value) reset();
    onOpenChange(value);
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const toastId = toast.loading('Starting extraction…');
      try {
        await createProspectWithExtraction({
          name: values.name,
          sourceUrl: values.sourceUrl,
          userId,
        });

        toast.success('Prospect created! Extraction is running.', { id: toastId });
        reset();
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong.';
        toast.error(message, { id: toastId });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus />
          Extract from URL
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add prospect from URL</DialogTitle>
          <DialogDescription>
            Paste a LinkedIn profile or website URL. We&apos;ll extract key details automatically.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-prospect-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-1"
        >
          <div className="space-y-1.5">
            <Label htmlFor="prospect-name">Name</Label>
            <Input
              id="prospect-name"
              placeholder="e.g. John Doe"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prospect-source-url">Source URL</Label>
            <Input
              id="prospect-source-url"
              type="url"
              placeholder="https://linkedin.com/in/… or https://example.com"
              {...register('sourceUrl')}
            />
            {errors.sourceUrl && (
              <p className="text-xs text-destructive">{errors.sourceUrl.message}</p>
            )}
          </div>
        </form>

        <DialogFooter showCloseButton>
          <Button type="submit" form="create-prospect-form" disabled={isPending}>
            {isPending ? 'Creating…' : 'Add prospect'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
