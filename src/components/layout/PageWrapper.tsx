import React from 'react';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showHeader?: boolean;
  headerProps?: React.ComponentProps<typeof Header>;
  showBottomNav?: boolean;
}

export function PageWrapper({
  children,
  className,
  showHeader = true,
  headerProps,
  showBottomNav = true,
  ...props
}: PageWrapperProps) {
  return (
    <div className="min-h-screen w-full bg-muted/20 md:bg-black/40">
      <div className="w-full max-w-md mx-auto min-h-screen bg-background relative shadow-2xl flex flex-col md:border-x md:border-border overflow-x-hidden">
        {showHeader && (
          <div className="print:hidden">
            <Header {...headerProps} />
          </div>
        )}
        
        {/* Mobile-first constraints: centering content on large screens */}
        <main 
          className={cn(
            "flex-1 w-full",
            showBottomNav ? "pb-24" : "pb-8", // extra padding if BottomNav is present
            className
          )}
          {...props}
        >
          {children}
        </main>

        {showBottomNav && (
          <div className="print:hidden z-50">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
}
