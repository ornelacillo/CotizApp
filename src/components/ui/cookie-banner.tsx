'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-border/50 bg-background/95 backdrop-blur-md shadow-lg animate-in slide-in-from-bottom-5 duration-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left">
          Utilizamos cookies esenciales para mantener tu sesión segura y métricas totalmente anónimas para mejorar nuestra aplicación. Al continuar usando la web, aceptas nuestro uso de cookies de acuerdo con nuestra{' '}
          <Link href="/privacidad" className="text-primary hover:underline font-semibold">
            Política de Privacidad
          </Link>.
        </div>
        <div className="flex gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={acceptCookies}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
