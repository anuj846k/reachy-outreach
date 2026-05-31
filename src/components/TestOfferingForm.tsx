'use client';

import { useState } from 'react';
import { createOfferingWithExtraction, getOffering } from '@/app/actions';
import { toast } from 'sonner';

export default function TestOfferingForm({ userId }: { userId: string }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [offeringId, setOfferingId] = useState<string | null>(null);
  const [offering, setOffering] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    setLoading(true);

    try {
      const result = await createOfferingWithExtraction({
        name: name.trim(),
        sourceUrl: url.trim(),
        userId,
      });

      if (result.success) {
        setOfferingId(result.offeringId);
        toast.success('🔍 Extraction started!', {
          description: 'Extracting your offering details... This may take 10-30 seconds. Refresh to see results.',
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error('Failed to start extraction');
    } finally {
      setLoading(false);
    }
  };

  const fetchOffering = async () => {
    if (!offeringId) return;
    const data = await getOffering(offeringId);
    setOffering(data);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-sm font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Offering Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kakiyo"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Website URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. https://kakiyo.com"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create & Extract'}
        </button>
      </form>

      {offeringId && (
        <div className="mb-8 flex gap-2">
          <button
            onClick={fetchOffering}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Refresh Status
          </button>
        </div>
      )}

      {offering && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">{offering.name}</h2>
            {getStatusBadge(offering.extractionStatus)}
          </div>

          {offering.extractionStatus === 'pending' && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800">⏳ Extraction queued... Check back in a few seconds.</p>
            </div>
          )}

          {offering.extractionStatus === 'processing' && (
            <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-3">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              <p className="text-blue-800">🔍 Extracting offering details...</p>
            </div>
          )}

          {offering.extractionStatus === 'completed' && (
            <>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg">Structured Extraction</h3>
                {offering.offeringSummary && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Offering Summary</label>
                    <p className="text-gray-900">{offering.offeringSummary}</p>
                  </div>
                )}
                {offering.idealCustomerProfile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ideal Customer</label>
                    <p className="text-gray-900">{offering.idealCustomerProfile}</p>
                  </div>
                )}
                {offering.customerProblems && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Problems</label>
                    <p className="text-gray-900">{offering.customerProblems}</p>
                  </div>
                )}
                {offering.keyDifferentiators && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Key Differentiators</label>
                    <p className="text-gray-900">{offering.keyDifferentiators}</p>
                  </div>
                )}
                {offering.proofPoints && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Proof Points</label>
                    <p className="text-gray-900">{offering.proofPoints}</p>
                  </div>
                )}
              </div>

              {offering.extractedMarkdown && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Raw Markdown</h3>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto">
                    {offering.extractedMarkdown}
                  </pre>
                </div>
              )}
            </>
          )}

          {offering.extractionStatus === 'failed' && (
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-800">❌ Extraction failed. Please try again.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
