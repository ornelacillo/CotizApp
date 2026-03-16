'use client';

import { Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { useEffect, useState } from 'react';

interface HeaderProps {
  title?: string;
  showProfile?: boolean;
  showNotifications?: boolean;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export function Header({
  title = "CotizApp",
  showProfile = true,
  showNotifications = true,
  leftAction,
  rightAction
}: HeaderProps) {
  const [profileData, setProfileData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('cotiza_designer_profile');
    if (saved) {
      try {
        setProfileData(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const initials = profileData?.name 
    ? profileData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() 
    : 'ME';

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 w-full">
        <div className="flex items-center gap-4">
          {leftAction || (
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ 
                  background: mounted && profileData?.primaryColor 
                    ? profileData.primaryColor 
                    : 'linear-gradient(to bottom right, var(--primary), var(--secondary))' 
                }}
              >
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {rightAction ? (
            rightAction
          ) : (
            <>
              {showNotifications && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground rounded-full hover:bg-muted/50"
                  onClick={() => alert("No tienes notificaciones nuevas.")}
                >
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notificaciones</span>
                </Button>
              )}
              {showProfile && (
                <Link href="/perfil" className="contents">
                  <Avatar 
                    className="h-8 w-8 ring-2 cursor-pointer transition-colors hover:opacity-80"
                    style={{ '--tw-ring-color': mounted && profileData?.primaryColor ? profileData.primaryColor : 'var(--border)' } as React.CSSProperties}
                  >
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback 
                      className="text-xs font-semibold text-white"
                      style={{ backgroundColor: mounted && profileData?.primaryColor ? profileData.primaryColor : 'var(--card)' }}
                    >
                      {mounted ? initials : ''}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
