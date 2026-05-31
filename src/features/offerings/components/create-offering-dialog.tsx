'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  createOfferingWithExtraction,
  createManualOffering,
} from '@/features/offerings/actions';

const urlSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  sourceUrl: z
    .string()
    .min(1, 'Source URL is required')
    .url('Please enter a valid URL (e.g. https://example.com)'),
});

const manualSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  offeringSummary: z.string().optional(),
  idealCustomerProfile: z.string().optional(),
  customerProblems: z.string().optional(),
  keyDifferentiators: z.string().optional(),
  proofPoints: z.string().optional(),
});

type UrlFormValues = z.infer<typeof urlSchema>;
type ManualFormValues = z.infer<typeof manualSchema>;

interface CreateOfferingDialogProps {
  userId: string;
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

export function CreateOfferingDialog({ userId, open, onOpenChange }: CreateOfferingDialogProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'manual'>('url');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const urlForm = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: { name: '', sourceUrl: '' },
  });

  const manualForm = useForm<ManualFormValues>({
    resolver: zodResolver(manualSchema),
    defaultValues: {
      name: '',
      offeringSummary: '',
      idealCustomerProfile: '',
      customerProblems: '',
      keyDifferentiators: '',
      proofPoints: '',
    },
  });

  function handleOpenChange(value: boolean) {
    if (!value) {
      urlForm.reset();
      manualForm.reset();
      setActiveTab('url');
    }
    onOpenChange(value);
  }

  function onUrlSubmit(values: UrlFormValues) {
    startTransition(async () => {
      const toastId = toast.loading('Starting extraction…');
      try {
        await createOfferingWithExtraction({ ...values, userId });
        toast.success('Offering created! Extraction is running in the background.', {
          id: toastId,
        });
        urlForm.reset();
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Something went wrong.', {
          id: toastId,
        });
      }
    });
  }

  function onManualSubmit(values: ManualFormValues) {
    startTransition(async () => {
      const toastId = toast.loading('Creating offering…');
      try {
        await createManualOffering({ ...values, userId });
        toast.success('Offering created.', { id: toastId });
        manualForm.reset();
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Something went wrong.', {
          id: toastId,
        });
      }
    });
  }

  const activeFormId =
    activeTab === 'url' ? 'create-offering-url-form' : 'create-offering-manual-form';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          Create Offering
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create offering</DialogTitle>
          <DialogDescription>
            Add a URL to auto-extract details, or fill them in manually.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="url"
          onValueChange={(v) => setActiveTab(v as 'url' | 'manual')}
          className="mt-1 flex-col"
        >
          <TabsList className="w-full">
            <TabsTrigger value="url" className="flex-1 hover:bg-background/70">
              From URL
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex-1 hover:bg-background/70">
              Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="mt-4">
            <form
              id="create-offering-url-form"
              onSubmit={urlForm.handleSubmit(onUrlSubmit)}
              className="space-y-4"
            >
              <FieldRow
                id="url-name"
                label="Name"
                error={urlForm.formState.errors.name?.message}
              >
                <Input
                  id="url-name"
                  placeholder="e.g. Acme SaaS Platform"
                  aria-invalid={!!urlForm.formState.errors.name}
                  {...urlForm.register('name')}
                />
              </FieldRow>
              <FieldRow
                id="url-source"
                label="Source URL"
                error={urlForm.formState.errors.sourceUrl?.message}
              >
                <Input
                  id="url-source"
                  type="url"
                  placeholder="https://example.com or linkedin.com/company/…"
                  aria-invalid={!!urlForm.formState.errors.sourceUrl}
                  {...urlForm.register('sourceUrl')}
                />
              </FieldRow>
            </form>
          </TabsContent>

          <TabsContent value="manual" className="mt-4">
            <form
              id="create-offering-manual-form"
              onSubmit={manualForm.handleSubmit(onManualSubmit)}
              className="space-y-4 max-h-[55vh] overflow-y-auto pr-1"
            >
              <FieldRow
                id="manual-name"
                label="Name"
                error={manualForm.formState.errors.name?.message}
              >
                <Input
                  id="manual-name"
                  placeholder="e.g. Acme SaaS Platform"
                  aria-invalid={!!manualForm.formState.errors.name}
                  {...manualForm.register('name')}
                />
              </FieldRow>
              <FieldRow id="manual-summary" label="Offering Summary">
                <Textarea
                  id="manual-summary"
                  placeholder="What does this offering do?"
                  {...manualForm.register('offeringSummary')}
                />
              </FieldRow>
              <FieldRow id="manual-icp" label="Ideal Customer Profile">
                <Textarea
                  id="manual-icp"
                  placeholder="Who is this for?"
                  {...manualForm.register('idealCustomerProfile')}
                />
              </FieldRow>
              <FieldRow id="manual-problems" label="Customer Problems">
                <Textarea
                  id="manual-problems"
                  placeholder="What problems does it solve?"
                  {...manualForm.register('customerProblems')}
                />
              </FieldRow>
              <FieldRow id="manual-diff" label="Key Differentiators">
                <Textarea
                  id="manual-diff"
                  placeholder="What makes it unique?"
                  {...manualForm.register('keyDifferentiators')}
                />
              </FieldRow>
              <FieldRow id="manual-proof" label="Proof Points">
                <Textarea
                  id="manual-proof"
                  placeholder="Case studies, metrics, testimonials…"
                  {...manualForm.register('proofPoints')}
                />
              </FieldRow>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter showCloseButton className="mt-2">
          <Button type="submit" form={activeFormId} disabled={isPending}>
            {isPending ? 'Creating…' : 'Create offering'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
