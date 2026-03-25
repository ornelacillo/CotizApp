'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit2, Copy, Send, Download } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import tinycolor from 'tinycolor2';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';

export default function PresupuestoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { theme } = useTheme();

  const [budgetData, setBudgetData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch Profile & Branding
    const [ { data: profile }, { data: branding }, { data: budget } ] = await Promise.all([
      supabase.from('designer_profiles').select('*').eq('id', user.id).single(),
      supabase.from('designer_branding').select('*').eq('designer_id', user.id).single(),
      supabase.from('budgets').select(`
        *,
        clients (*),
        budget_versions (
          *,
          budget_items (*)
        )
      `).eq('id', id).single()
    ]);

    if (profile && branding) {
      setProfileData({
        name: profile.nombre || '',
        subtitle: profile.estudio_nombre || '',
        primaryColor: branding.color_principal || '#6B5CFF',
        fontFamily: branding.tipografia || 'Inter',
        logo: branding.logo_path || ''
      });
    }

    if (budget) {
      setBudgetData(budget);
    }
    setLoading(false);
  };

  const designerName = profileData?.name || 'Design Studio';
  const designerSubtitle = profileData?.subtitle || 'Diseño Gráfico & UI/UX';
  const primaryColor = profileData?.primaryColor || '#6B5CFF';
  const fontFamily = profileData?.fontFamily || 'Inter, sans-serif';
  const logo = profileData?.logo || null;
  const initials = designerName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const budgetVersion = budgetData?.budget_versions?.[0];
  const items = budgetVersion?.budget_items?.sort((a: any, b: any) => a.orden - b.orden) || [];
  const customNotes = budgetVersion?.condiciones || 'El pago se realiza 50% por adelantado...';
  const expiresIn = budgetData?.validez_dias?.toString() || '15';
  
  const createdDateObj = budgetData ? new Date(budgetData.created_at) : new Date();
  const currentDate = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(createdDateObj);

  const clientNameStr = budgetData?.clients?.nombre || 'Cliente Final';
  const clientEmailStr = budgetData?.clients?.email || '';
  const totalAmount = budgetData?.total_amount || 0;
  const formattedAmount = `$${totalAmount.toLocaleString('es-AR')}`;
  const clientInitialStr = clientNameStr.charAt(0).toUpperCase();

  // Color Contrast Adjustments
  const color = tinycolor(primaryColor);
  const isDarkTheme = mounted && theme === 'dark';
  const baseBg = isDarkTheme ? '#121212' : '#ffffff';
  
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

  if (loading || !mounted) {
    return (
      <PageWrapper showBottomNav={false}>
        <div className="flex items-center justify-center p-8 h-screen border-t border-border">
          <p className="text-muted-foreground animate-pulse text-sm">Cargando presupuesto...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      showBottomNav={false}
      headerProps={{
        title: `Detalle COT-00${id.substring(0,4)}`,
        showProfile: false,
        showNotifications: false,
        leftAction: (
          <div className="flex items-center gap-2">
            <Link href={`/presupuestos`} className="text-muted-foreground hover:text-foreground">
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
            {items.map((item: any) => (
              <div key={item.id} className="p-4 flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-medium">{item.nombre}</p>
                  <p className="text-xs text-muted-foreground">{item.descripcion || 'Servicio detallado en la cotización.'}</p>
                </div>
                <div className="text-right pl-4">
                  <p className="font-bold">${item.precio_unitario.toLocaleString('es-AR')}</p>
                  <p className="text-xs text-muted-foreground">{item.cantidad} unid.</p>
                </div>
              </div>
            ))}
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
        <div className="h-24 w-full print:hidden"></div>

      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-background/80 backdrop-blur-md border-t border-border z-40 print:hidden">
        <div className="w-full grid grid-cols-4 gap-1">
          <Link href={`/presupuestos/nuevo?edit=${id}`} className="contents">
            <Button variant="ghost" className="flex flex-col gap-1 h-14 p-1 text-primary hover:bg-primary/10 hover:text-primary">
              <Edit2 className="h-5 w-5" />
              <span className="text-[10px] font-medium">Editar</span>
            </Button>
          </Link>
          <Link href={`/presupuestos/nuevo?duplicate=${id}`} className="contents">
            <Button variant="ghost" className="flex flex-col gap-1 h-14 p-1 text-primary hover:bg-primary/10 hover:text-primary">
              <Copy className="h-5 w-5" />
              <span className="text-[10px] font-medium">Duplicar</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="flex flex-col gap-1 h-14 p-1 text-primary hover:bg-primary/10 hover:text-primary" 
            onClick={handleDownloadPdf}
          >
            <Download className="h-5 w-5" />
            <span className="text-[10px] font-medium">PDF</span>
          </Button>
          <Link href={`/presupuestos/${id}/generado`} className="contents">
            <Button className="flex flex-col gap-1 h-14 p-1 rounded-xl shadow-md">
              <Send className="h-4 w-4" />
              <span className="text-[10px] font-medium">Compartir</span>
            </Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
