'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/store';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {sidebarOpen && (
          <div className="hidden lg:flex lg:w-64 lg:flex-col">
            <Sidebar />
          </div>
        )}
        
        <main className={`flex-1 ${sidebarOpen ? 'lg:pl-0' : ''}`}>
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
