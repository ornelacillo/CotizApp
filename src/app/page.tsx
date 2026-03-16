'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5; // increment progress
      });
    }, 100);

    const redirectTimer = setTimeout(() => {
      router.push('/login');
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-between p-8 text-foreground pb-12">
      <div className="flex-1" />
      
      {/* Central Logo Area */}
      <div className="flex flex-col items-center justify-center animate-pulse">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20 flex items-center justify-center mb-6">
          <span className="text-white font-bold text-4xl">C</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">CotizApp</h1>
        <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase font-semibold">
          Business Intelligence
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-end w-full max-w-[200px] mx-auto items-center mb-10">
        {/* Loading Bar */}
        <div className="w-full h-1.5 bg-card/50 rounded-full overflow-hidden mb-3 border border-border/50">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100 ease-linear w-[var(--progress)]"
            // eslint-disable-next-line react/forbid-dom-props
            // @ts-ignore
            style={{ "--progress": `${progress}%` } as React.CSSProperties}
          />
        </div>
        <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Cargando aplicación...</p>
      </div>
    </div>
  );
}
