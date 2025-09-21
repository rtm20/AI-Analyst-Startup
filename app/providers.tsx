'use client';

import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
