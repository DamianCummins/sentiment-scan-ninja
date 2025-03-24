
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  sidebar?: ReactNode;
  children?: ReactNode;
  header?: ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  sidebar,
  children,
  header,
  className
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {header && (
        <header className="border-b sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm">
          <div className="py-4 px-6">{header}</div>
        </header>
      )}
      
      <div className="flex-1 flex flex-col md:flex-row">
        {sidebar && (
          <aside className="w-full md:w-64 lg:w-72 border-r bg-sidebar flex-shrink-0">
            <div className="p-6 h-full">{sidebar}</div>
          </aside>
        )}
        
        <main className={cn("flex-1 p-6 lg:p-8", className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
