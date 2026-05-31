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
import { createManualProspect } from '@/features/prospects/actions';

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
        await createManualProspect({
          userId,
          name: values.name,
          jobTitle: values.jobTitle,
          company: values.company,
          companyDescription: values.companyDescription,
          bio: values.bio,
          painPoints: values.painPoints,
          skills: values.skills,
        });

        toast.success('Prospect created.');
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
        <Button size="sm">
          <PenLine />
          Create manually
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create prospect manually</DialogTitle>
          <DialogDescription>
            Enter the prospect&apos;s details directly. All fields except name are optional.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-prospect-manual-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-1"
        >
          <div className="space-y-1.5">
            <Label htmlFor="manual-name">Name *</Label>
            <Input id="manual-name" {...register('name')} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="manual-job-title">Job Title</Label>
              <Input id="manual-job-title" {...register('jobTitle')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="manual-company">Company</Label>
              <Input id="manual-company" {...register('company')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="manual-company-desc">Company Description</Label>
            <Textarea id="manual-company-desc" rows={2} {...register('companyDescription')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="manual-bio">Bio / About</Label>
            <Textarea id="manual-bio" rows={3} {...register('bio')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="manual-pain-points">Inferred Pain Points</Label>
            <Textarea id="manual-pain-points" rows={2} {...register('painPoints')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="manual-skills">Skills</Label>
            <Input id="manual-skills" placeholder="e.g. React, Node.js, AWS" {...register('skills')} />
          </div>
        </form>

        <DialogFooter showCloseButton>
          <Button type="submit" form="create-prospect-manual-form" disabled={isPending}>
            {isPending ? 'Creating…' : 'Create prospect'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
