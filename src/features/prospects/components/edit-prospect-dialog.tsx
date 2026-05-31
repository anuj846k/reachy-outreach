'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';

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
import { updateProspect } from '@/features/prospects/actions';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  jobTitle: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  companyDescription: z.string().max(500).optional(),
  bio: z.string().max(1000).optional(),
  painPoints: z.string().max(500).optional(),
  skills: z.string().max(500).optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

interface EditProspectDialogProps {
  prospectId: string;
  defaultValues: FormValues;
}

export function EditProspectDialog({ prospectId, defaultValues }: EditProspectDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  function handleOpenChange(value: boolean) {
    if (!value) reset(defaultValues);
    setOpen(value);
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        await updateProspect(prospectId, {
          name: values.name,
          jobTitle: values.jobTitle || null,
          company: values.company || null,
          companyDescription: values.companyDescription || null,
          bio: values.bio || null,
          painPoints: values.painPoints || null,
          skills: values.skills || null,
          sourceUrl: values.sourceUrl || null,
        });

        toast.success('Prospect updated.');
        setOpen(false);
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
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Pencil className="size-3.5" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit prospect</DialogTitle>
          <DialogDescription>Update the prospect&apos;s details.</DialogDescription>
        </DialogHeader>

        <form
          id="edit-prospect-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-1"
        >
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Name *</Label>
            <Input id="edit-name" {...register('name')} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-job-title">Job Title</Label>
              <Input id="edit-job-title" {...register('jobTitle')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-company">Company</Label>
              <Input id="edit-company" {...register('company')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-source-url">Source URL</Label>
            <Input id="edit-source-url" type="url" {...register('sourceUrl')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-company-desc">Company Description</Label>
            <Textarea id="edit-company-desc" rows={2} {...register('companyDescription')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-bio">Bio / About</Label>
            <Textarea id="edit-bio" rows={3} {...register('bio')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-pain-points">Pain Points</Label>
            <Textarea id="edit-pain-points" rows={2} {...register('painPoints')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-skills">Skills</Label>
            <Input id="edit-skills" {...register('skills')} />
          </div>
        </form>

        <DialogFooter showCloseButton>
          <Button type="submit" form="edit-prospect-form" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
