'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { PenLine } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  name: z.string().min(1, 'Name is required').max(100),
  jobTitle: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  companyDescription: z.string().max(500).optional(),
  bio: z.string().max(1000).optional(),
  painPoints: z.string().max(500).optional(),
  skills: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateProspectManualDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProspectManualDialog({
  userId,
  open,
  onOpenChange,
}: CreateProspectManualDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      jobTitle: '',
      company: '',
      companyDescription: '',
      bio: '',
      painPoints: '',
      skills: '',
    },
  });

  function handleOpenChange(value: boolean) {
    if (!value) reset();
    onOpenChange(value);
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        await createProspectWithSources({
          userId,
          name: values.name,
          sources: [], // Empty sources array means no extraction, created manually!
          jobTitle: values.jobTitle || undefined,
          company: values.company || undefined,
          companyDescription: values.companyDescription || undefined,
          bio: values.bio || undefined,
          painPoints: values.painPoints || undefined,
          skills: values.skills || undefined,
        });

        toast.success('Prospect created manually.');
        reset();
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong.';
        toast.error(message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary hover:bg-primary/80 text-white font-medium rounded-lg shadow-sm gap-1.5 transition-all">
          <PenLine className="size-4" />
          Create manually
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-xl animate-in fade-in-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Create prospect manually</DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
            Enter the prospect&apos;s details directly. All fields except name are optional.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-prospect-manual-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-2"
        >
          <div className="space-y-1.5">
            <Label htmlFor="manual-name" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Name *</Label>
            <Input id="manual-name" {...register('name')} className="h-10 rounded-xl" />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="manual-job-title" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Job Title</Label>
              <Input id="manual-job-title" {...register('jobTitle')} className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="manual-company" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Company</Label>
              <Input id="manual-company" {...register('company')} className="h-10 rounded-xl" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="manual-company-desc" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Company Description</Label>
            <Textarea id="manual-company-desc" rows={2} {...register('companyDescription')} className="rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="manual-bio" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Bio / About</Label>
            <Textarea id="manual-bio" rows={3} {...register('bio')} className="rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="manual-pain-points" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Inferred Pain Points</Label>
            <Textarea id="manual-pain-points" rows={2} {...register('painPoints')} className="rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="manual-skills" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Skills</Label>
            <Input id="manual-skills" placeholder="e.g. React, Node.js, AWS" {...register('skills')} className="h-10 rounded-xl" />
          </div>
        </form>

        <DialogFooter className="border-t pt-4 border-zinc-100 dark:border-zinc-800">
          <div className="flex w-full items-center justify-end gap-2">
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
              form="create-prospect-manual-form"
              disabled={isPending}
              className="bg-primary hover:bg-primary/80 text-white rounded-xl h-9 px-5 font-semibold transition-colors"
            >
              {isPending ? 'Creating…' : 'Create prospect'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
