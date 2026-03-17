'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import tinycolor from 'tinycolor2';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function PublicPresupuestoPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = params.token as string;
  const { theme } = useTheme();
  
  // NOTE: In the real app, we will fetch this data from Supabase using the token.
  // For the MVP UI mockup, we'll parse it from URL to maintain consistency.
  const amountStr = searchParams.get('amount') || '145000';
  const formattedAmount = `$${parseInt(amountStr).toLocaleString('es-AR')}`;
  const customNotes = searchParams.get('notes') || 'El pago se realiza 50% por adelantado y 50% contra entrega.';
  const idStr = searchParams.get('bid') || '1';
  const id = parseInt(idStr);
  const expiresIn = parseInt(searchParams.get('expiresIn') || '15');
  const createdAtStr = searchParams.get('createdAt') || Date.now().toString();
  const createdAt = parseInt(createdAtStr);
  const clientNameStr = searchParams.get('client') || 'Acme Corp';
  const clientEmailStr = searchParams.get('email') || '';
  const serviceName = searchParams.get('service') || 'Diseño de Logotipo';
  
  const [isExpired, setIsExpired] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const currentDate = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  useEffect(() => {
    setMounted(true);

    // In a real scenario, this comes from the DB (the designer's profile bound to this budget)
    // We mock it for the UI until backend integration is complete
    setProfileData({
      name: 'Design Studio',
      subtitle: 'Diseño Gráfico & UI/UX',
      primaryColor: '#6B5CFF',
      fontFamily: 'Inter, sans-serif'
    });
    
    const currentDateTimestamp = Date.now();
    const expirationDateTimestamp = createdAt + (expiresIn * 24 * 60 * 60 * 1000);
    if (currentDateTimestamp > expirationDateTimestamp) {
      setIsExpired(true);
    }
    
    // Todo: Trigger "visto" metric tracking event via Supabase here
  }, [expiresIn, createdAt]);

  const designerName = profileData?.name || 'Design Studio';
  const designerSubtitle = profileData?.subtitle || 'Diseño Gráfico & UI/UX';
  const primaryColor = profileData?.primaryColor || '#6B5CFF'; 
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
    window.print();
  };

  if (mounted && isExpired) {
    return (
      <PageWrapper showBottomNav={false} headerProps={{ title: "Enlace Expirado", showProfile: false, showNotifications: false }}>
        <div className="flex flex-col items-center justify-center h-[70vh] p-6 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Presupuesto Expirado</h2>
          <p className="text-muted-foreground mb-8 text-base max-w-md">
            Este presupuesto ha superado su período de validez de {expiresIn} días. Por favor, contacta con <strong>{designerName}</strong> para solicitar una actualización.
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      showBottomNav={false}
      headerProps={{
        title: "Cotización Privada",
        showProfile: false,
        showNotifications: false,
        leftAction: (
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight">CotizApp</h1>
          </div>
        )
      }}
    >
      <div 
        className="p-4 md:p-6 pb-32 print:pb-0 space-y-6 print:space-y-4 animate-in fade-in duration-700"
        style={{ fontFamily: mounted ? fontFamily : 'inherit' }}
      >
        
        {/* Designer Profile Presentation */}
        <div className="text-center pt-4 pb-2 space-y-3 print:m-0 print:p-0">
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
            <p className="font-medium text-sm" style={{ color: mounted ? brightTextAndIconColor : 'var(--primary)' }}>Cotización COT-00{id} • {mounted ? designerSubtitle : 'Diseño Gráfico'}</p>
          </div>
        </div>

        {/* Client Info Minimal */}
        <div className="rounded-2xl border border-border/60 p-4 bg-muted/10 text-center">
          <p className="text-sm text-muted-foreground mb-1">Preparado para</p>
          <p className="font-semibold text-lg text-foreground">{clientNameStr}</p>
          {clientEmailStr && <p className="text-sm text-muted-foreground">{clientEmailStr}</p>}
          <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>{currentDate}</p>
        </div>

        {/* Services Detail Card */}
        <Card className="p-0 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="p-5 border-b border-border/50 bg-gradient-to-br from-card to-muted/20">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: mounted ? brightTextAndIconColor : 'var(--primary)' }} />
              Detalle de Servicios
            </h3>
          </div>
          
          <div className="divide-y divide-border/30">
            <div className="p-5 flex justify-between items-start hover:bg-muted/10 transition-colors">
              <div className="space-y-1.5 flex-1 pr-4">
                <p className="font-semibold text-[15px]">{serviceName}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">Servicio principal detallado en la cotización.</p>
              </div>
              <div className="text-right relative top-0.5">
                <p className="font-bold text-[15px]">{formattedAmount}</p>
              </div>
            </div>
          </div>
          
          <div 
            className="p-6 border-t border-border/30 flex justify-between items-center rounded-b-[20px]"
            style={{ backgroundColor: mounted ? badgeBgColor : 'rgba(var(--primary), 0.05)' }}
          >
            <span className="font-medium text-foreground tracking-wide uppercase text-sm">Total a pagar</span>
            <span 
              className="font-black text-3xl drop-shadow-sm"
              style={{ color: mounted ? brightTextAndIconColor : 'var(--primary)' }}
            >{formattedAmount} <span className="text-xl font-bold text-muted-foreground/80 ml-1">ARS</span></span>
          </div>
        </Card>

        {/* Notes/Terms */}
        <div className="px-2">
          <h4 className="text-sm font-semibold mb-2">Términos y Condiciones / Notas</h4>
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {customNotes}
          </p>
        </div>

      </div>

      {/* Fixed Bottom Action for Public View (Download PDF) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-background/90 backdrop-blur-xl border-t border-border z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] print:hidden">
        <div className="w-full">
          <Button 
            variant="default" 
            className="w-full text-white h-12"
            style={mounted ? { backgroundColor: primaryColor } : undefined}
            onClick={handleDownloadPdf}
          >
            <Download className="w-5 h-5 mr-2" />
            Descargar PDF
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
