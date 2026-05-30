import { requireAuth } from '@/lib/auth-utils';
import React from 'react';

const page = async () => {
  await requireAuth();
  return <div>protected server component</div>;
};

export default page;
