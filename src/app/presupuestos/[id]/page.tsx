'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit2, Copy, Send, Download } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import tinycolor from 'tinycolor2';
import { useTheme } from 'next-themes';

export default function PresupuestoDetallePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const { theme } = useTheme();
  const customNotes = searchParams.get('notes') || 'El pago se realiza 50% por adelantado y 50% contra entrega. El presupuesto tiene una validez de 15 días desde la fecha de emisión. Los tiempos de entrega comienzan a correr una vez efectuado el anticipo.';
  const expiresIn = searchParams.get('expiresIn') || '15';
  const createdAt = searchParams.get('createdAt') || Date.now().toString();
  const currentDate = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  const clientNameStr = searchParams.get('client') || 'Acme Corp';
  const clientEmailStr = searchParams.get('email') || '';
  const serviceName = searchParams.get('service') || 'Diseño de Logotipo';
  const amountStr = searchParams.get('amount') || '145000';
  const formattedAmount = `$${parseInt(amountStr).toLocaleString('es-AR')}`;
  const clientInitialStr = clientNameStr.charAt(0).toUpperCase();

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

  const designerName = profileData?.name || 'Design Studio';
  const designerSubtitle = profileData?.subtitle || 'Diseño Gráfico & UI/UX';
  const primaryColor = profileData?.primaryColor || '#6B5CFF'; // Use actual default instead of CSS var for tinycolor
  const fontFamily = profileData?.fontFamily || 'Inter, sans-serif';
  const logo = profileData?.logo || null;
  const initials = designerName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  // Color Contrast Adjustments based on active theme
  const color = tinycolor(primaryColor);
  const isDarkTheme = mounted && theme === 'dark';
  
  // Base background colors
  const baseBg = isDarkTheme ? '#121212' : '#ffffff';
  
  // Find a readable version of the primary color against the base background
  let readableColor = primaryColor;
  
  if (isDarkTheme) {
    if (tinycolor.readability(primaryColor, baseBg) < 4.5) {
      let tempColor = color.clone();
      while (tinycolor.readability(tempColor, baseBg) < 4.5 && tempColor.getLuminance() < 0.95) {
        tempColor.lighten(10);
      }
      readableColor = tempColor.toString();
    }
  } else {
    if (tinycolor.readability(primaryColor, baseBg) < 4.5) {
      let tempColor = color.clone();
      while (tinycolor.readability(tempColor, baseBg) < 4.5 && tempColor.getLuminance() > 0.05) {
        tempColor.darken(10);
      }
      readableColor = tempColor.toString();
    }
  }

  const brightTextAndIconColor = readableColor;
  const badgeBgColor = color.setAlpha(0.10).toRgbString();

  const handleDownloadPdf = () => {
    // Native print dialogue is the most robust way to generate a PDF, 
    // especially with modern CSS level 4 colors (like oklab in Tailwind v4)
    window.print();
  };

  return (
    <PageWrapper
      showBottomNav={false}
      headerProps={{
        title: `Detalle COT-00${id}`,
        showProfile: false,
        showNotifications: false,
        leftAction: (
          <div className="flex items-center gap-2">
            <Link href="/presupuestos" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-[20px] font-bold tracking-tight">Detalle</h1>
          </div>
        )
      }}
    >
      <div 
        className="p-4 md:p-6 pb-32 space-y-6 animate-in fade-in duration-500"
        style={{ fontFamily: mounted ? fontFamily : 'inherit' }}
      >
        
        {/* Printable Area */}
        <div className="bg-background space-y-6 p-4 -m-4 rounded-xl print:m-0 print:p-0">
          
          {/* Designer Profile Presentation for PDF */}
          <div className="hidden print:block text-center pt-4 pb-2 space-y-3">
            <Avatar 
              className="h-20 w-20 mx-auto ring-4 shadow-xl"
              style={{ '--tw-ring-color': mounted ? `${primaryColor}33` : 'rgba(var(--primary), 0.2)' } as React.CSSProperties}
            >
              <AvatarImage src={mounted && logo ? logo : ""} />
              <AvatarFallback 
                className="text-white font-bold text-xl"
                style={{ backgroundColor: mounted ? primaryColor : 'var(--card)' }}
              >
                {mounted ? initials : 'DS'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-2xl tracking-tight text-foreground">{mounted ? designerName : 'Design Studio'}</h2>
              <p className="font-medium text-sm" style={{ color: mounted ? primaryColor : 'var(--primary)' }}>Cotización COT-00{id} • {mounted ? designerSubtitle : 'Diseño Gráfico'}</p>
            </div>
          </div>
          {/* Status Banner */}
        <div 
          className="flex items-center justify-between p-4 rounded-xl border print:hidden"
          style={{ backgroundColor: mounted ? badgeBgColor : 'rgba(var(--primary), 0.1)', borderColor: mounted ? `${primaryColor}33` : 'rgba(var(--primary), 0.2)' }}
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: mounted ? primaryColor : 'var(--primary)' }}></span>
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: mounted ? primaryColor : 'var(--primary)' }}></span>
            </span>
            <div>
              <p className="font-bold text-sm" style={{ color: mounted ? brightTextAndIconColor : 'var(--primary)' }}>Estado: Enviado</p>
              <p className="text-xs opacity-80" style={{ color: mounted ? brightTextAndIconColor : 'var(--primary)' }} suppressHydrationWarning>Última actualización: {currentDate}</p>
            </div>
          </div>
        </div>

        {/* Client Card */}
        <Card className="p-5 flex flex-col items-center gap-2 text-center print:border-none print:shadow-none print:bg-transparent">
          <p className="text-sm text-muted-foreground hidden print:block mb-1">Preparado para</p>
          <div className="flex items-center gap-4 print:hidden">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20" style={{ '--tw-ring-color': mounted ? `${primaryColor}33` : 'rgba(var(--primary), 0.2)' } as React.CSSProperties}>
              <AvatarFallback 
                className="text-white text-lg font-bold"
                style={{ backgroundColor: mounted ? primaryColor : 'var(--card)' }}
              >
                {clientInitialStr}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg">{clientNameStr}</h2>
            {clientEmailStr && <p className="text-sm text-muted-foreground print:hidden">{clientEmailStr}</p>}
            <p className="text-xs text-muted-foreground mt-1 hidden print:block" suppressHydrationWarning>{currentDate}</p>
          </div>
        </Card>

        {/* Services Detail Card */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-muted/20">
            <h3 className="font-semibold text-foreground/90">Servicios Cotizados</h3>
          </div>
          
          <div className="divide-y divide-border/50">
            <div className="p-4 flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-medium">{serviceName}</p>
                <p className="text-xs text-muted-foreground">Servicio principal detallado en la cotización.</p>
              </div>
              <div className="text-right pl-4">
                <p className="font-bold">{formattedAmount}</p>
                <p className="text-xs text-muted-foreground">1 unid.</p>
              </div>
            </div>
          </div>
          
          <div 
            className="p-5 border-t border-border flex justify-between items-center rounded-b-[20px]"
            style={{ backgroundColor: mounted ? badgeBgColor : 'rgba(var(--primary), 0.05)' }}
          >
            <span className="font-medium text-muted-foreground">Total a pagar</span>
            <span 
              className="font-extrabold text-2xl"
              style={{ color: mounted ? brightTextAndIconColor : 'var(--primary)' }}
            >{formattedAmount} <span className="text-lg font-bold text-muted-foreground ml-1">ARS</span></span>
          </div>
        </Card>

        {/* Version Info */}
        <div className="text-center px-4 mt-8">
          <p className="text-xs text-muted-foreground">
            Folio: COT-00{id} • Válido por {expiresIn} días
          </p>
        </div>

        {/* Terms and Conditions */}
        <div className="px-2 mt-8">
          <h4 className="text-sm font-semibold mb-2">Términos y Condiciones / Notas</h4>
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {customNotes}
          </p>
        </div>
        </div> {/* End Printable Area */}
        
        {/* Spacer for bottom action bar */}
        <div className="h-24 w-full"></div>

      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-background/80 backdrop-blur-md border-t border-border z-40 print:hidden">
        <div className="w-full grid grid-cols-4 gap-2">
          <Link href={`/presupuestos/nuevo?edit=${id}&client=${encodeURIComponent(clientNameStr)}&email=${encodeURIComponent(clientEmailStr)}&amount=${amountStr}&notes=${encodeURIComponent(customNotes)}`} className="contents">
            <Button variant="outline" className="flex flex-col gap-1 h-14 p-0">
              <Edit2 className="h-4 w-4" />
              <span className="text-[10px]">Editar</span>
            </Button>
          </Link>
          <Link href={`/presupuestos/nuevo?duplicate=${id}&client=${encodeURIComponent(clientNameStr)}&email=${encodeURIComponent(clientEmailStr)}&amount=${amountStr}&notes=${encodeURIComponent(customNotes)}`} className="contents">
            <Button variant="outline" className="flex flex-col gap-1 h-14 p-0">
              <Copy className="h-4 w-4" />
              <span className="text-[10px]">Duplicar</span>
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="flex flex-col gap-1 h-14 p-0" 
            onClick={handleDownloadPdf}
          >
            <Download className="h-4 w-4" />
            <span className="text-[10px]">PDF</span>
          </Button>
          <Link href={`/presupuestos/${id}/generado?client=${encodeURIComponent(clientNameStr)}&email=${encodeURIComponent(clientEmailStr)}&service=${encodeURIComponent(serviceName)}&amount=${amountStr}&notes=${encodeURIComponent(customNotes)}&expiresIn=${expiresIn}&createdAt=${createdAt}`} className="contents">
            <Button className="flex flex-col gap-1 h-14 p-0">
              <Send className="h-4 w-4" />
              <span className="text-[10px]">Compartir</span>
            </Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
