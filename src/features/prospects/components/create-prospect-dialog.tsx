'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Trash2, Globe } from 'lucide-react';

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

import { createProspectWithSources } from '@/features/prospects/actions';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  sources: z.array(
    z.object({
      type: z.enum(['url']),
      urlValue: z.string().optional(),
    })
  ),
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
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      sources: [{ type: 'url', urlValue: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sources',
  });


  function handleOpenChange(value: boolean) {
    if (!value) reset();
    onOpenChange(value);
  }

  const validateFormFields = (values: FormValues): boolean => {
    if (values.sources.length === 0) {
      toast.error('Please add at least one URL.');
      return false;
    }
    for (let i = 0; i < values.sources.length; i++) {
      const source = values.sources[i];
      if (!source.urlValue || source.urlValue.trim() === '') {
        toast.error(`Source #${i + 1} is empty.`);
        return false;
      }
      try {
        new URL(source.urlValue);
      } catch (_) {
        toast.error(`Source #${i + 1} is not a valid URL (include https://).`);
        return false;
      }
    }
    return true;
  };

  function onSubmit(values: FormValues) {
    if (!validateFormFields(values)) return;

    startTransition(async () => {
      const toastId = toast.loading('Extracting prospect details…');
      try {
        const finalSources = values.sources.map((s) => ({
          type: 'url' as const,
          value: s.urlValue!.trim(),
        }));

        await createProspectWithSources({
          userId,
          name: values.name,
          sources: finalSources,
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
        <Button size="sm" variant="outline" className="gap-1.5 font-medium rounded-lg border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700">
          <Plus className="size-4" />
          Extract from URL
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Extract from URL</DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
            Add profile URLs or websites. We&apos;ll extract key details automatically.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-prospect-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-2"
        >
          {/* Prospect Name */}
          <div className="space-y-1.5">
            <Label htmlFor="prospect-name" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="prospect-name"
              placeholder="e.g. Ayush"
              className="h-10 rounded-xl border-zinc-200 focus:border-violet-500 dark:border-zinc-800 focus:ring-violet-500/20 bg-zinc-50/50 dark:bg-zinc-900/50"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Sources Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b pb-2 border-zinc-100 dark:border-zinc-800/80">
              <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Input Sources <span className="text-rose-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => append({ type: 'url', urlValue: '' })}
                className="text-xs font-semibold h-7 rounded-lg border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors"
              >
                <Plus className="size-3.5 mr-1" />
                Add Source
              </Button>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {fields.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className="flex gap-2 items-center bg-zinc-50/40 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 p-2.5 rounded-xl hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors duration-200 relative group animate-in fade-in-50"
                  >
                    <div className="relative flex-1 min-w-0">
                      <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
                      <Input
                        placeholder="LinkedIn URL, GitHub, Portfolio..."
                        className="h-8 pl-8 rounded-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:border-violet-500"
                        {...register(`sources.${index}.urlValue` as const)}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="shrink-0 h-8 w-8 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </form>

        <DialogFooter className="border-t pt-4 border-zinc-100 dark:border-zinc-800">
          <div className="flex w-full items-center justify-between gap-4">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              {isPending ? 'Processing...' : '* Required'}
            </span>
            <div className="flex gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-9 px-4 rounded-xl font-medium border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-colors"
              >
                Close
              </Button>
              <Button
                type="submit"
                form="create-prospect-form"
                disabled={isPending}
                className="bg-primary hover:bg-primary/80 text-white px-5 rounded-xl font-semibold h-9 shadow-md shadow-violet-500/10 transition-all hover:shadow-violet-500/20"
              >
                {isPending ? 'Extracting...' : 'Extract'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
