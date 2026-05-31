'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

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
} from '@/components/ui/dialog';
import { updateOffering } from '@/features/offerings/actions';
import type { OfferingDetail } from '@/features/offerings/lib/utils';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  sourceUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  offeringSummary: z.string().optional(),
  idealCustomerProfile: z.string().optional(),
  customerProblems: z.string().optional(),
  keyDifferentiators: z.string().optional(),
  proofPoints: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditOfferingDialogProps {
  offering: OfferingDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function FieldRow({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function EditOfferingDialog({
  offering,
  open,
  onOpenChange,
}: EditOfferingDialogProps) {
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
      name: offering.name,
      sourceUrl: offering.sourceUrl ?? '',
      offeringSummary: offering.offeringSummary ?? '',
      idealCustomerProfile: offering.idealCustomerProfile ?? '',
      customerProblems: offering.customerProblems ?? '',
      keyDifferentiators: offering.keyDifferentiators ?? '',
      proofPoints: offering.proofPoints ?? '',
    },
  });

  function handleOpenChange(value: boolean) {
    if (!value) reset();
    onOpenChange(value);
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const toastId = toast.loading('Saving…');
      try {
        await updateOffering(offering.id, {
          name: values.name,
          sourceUrl: values.sourceUrl || null,
          offeringSummary: values.offeringSummary || null,
          idealCustomerProfile: values.idealCustomerProfile || null,
          customerProblems: values.customerProblems || null,
          keyDifferentiators: values.keyDifferentiators || null,
          proofPoints: values.proofPoints || null,
        });
        toast.success('Offering updated.', { id: toastId });
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Something went wrong.', {
          id: toastId,
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit offering</DialogTitle>
          <DialogDescription>
            Update the details for this offering.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-offering-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
        >
          <FieldRow id="edit-name" label="Name" error={errors.name?.message}>
            <Input
              id="edit-name"
              placeholder="e.g. Acme SaaS Platform"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
          </FieldRow>

          <FieldRow id="edit-source-url" label="Source URL (optional)" error={errors.sourceUrl?.message}>
            <Input
              id="edit-source-url"
              type="url"
              placeholder="https://example.com"
              aria-invalid={!!errors.sourceUrl}
              {...register('sourceUrl')}
            />
          </FieldRow>

          <FieldRow id="edit-summary" label="Offering Summary">
            <Textarea
              id="edit-summary"
              placeholder="What does this offering do?"
              {...register('offeringSummary')}
            />
          </FieldRow>

          <FieldRow id="edit-icp" label="Ideal Customer Profile">
            <Textarea
              id="edit-icp"
              placeholder="Who is this for?"
              {...register('idealCustomerProfile')}
            />
          </FieldRow>

          <FieldRow id="edit-problems" label="Customer Problems">
            <Textarea
              id="edit-problems"
              placeholder="What problems does it solve?"
              {...register('customerProblems')}
            />
          </FieldRow>

          <FieldRow id="edit-diff" label="Key Differentiators">
            <Textarea
              id="edit-diff"
              placeholder="What makes it unique?"
              {...register('keyDifferentiators')}
            />
          </FieldRow>

          <FieldRow id="edit-proof" label="Proof Points">
            <Textarea
              id="edit-proof"
              placeholder="Case studies, metrics, testimonials…"
              {...register('proofPoints')}
            />
          </FieldRow>
        </form>

        <DialogFooter showCloseButton>
          <Button type="submit" form="edit-offering-form" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
