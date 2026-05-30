import { requireAuth } from '@/lib/auth-utils';
import TestAIButton from '@/components/TestAIButton';
import React from 'react';

const page = async () => {
  await requireAuth();
  return (
    <div className="p-8">
      <div>protected server component</div>
      <TestAIButton />
    </div>
  );
};

export default page;
