'use client';

import { triggerAI } from '@/app/actions';
import { useState } from 'react';

export default function TestAIButton() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAI = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await triggerAI();
      setResult(response.message || 'Triggered successfully');
    } catch {
      setResult('Error calling AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-6'>
      <button
        onClick={testAI}
        disabled={loading}
        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
      >
        {loading ? 'Generating...' : 'Test Gemini 2.5 Flash'}
      </button>
      {result && (
        <div className='mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap max-w-2xl'>
          {result}
        </div>
      )}
    </div>
  );
}
