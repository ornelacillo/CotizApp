'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link2, Download, FileText, Check, ChevronLeft, AlertCircle, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import tinycolor from 'tinycolor2';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';

export default function GeneradoPresupuestoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { theme } = useTheme();

  const [budgetData, setBudgetData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

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
      const expiresIn = budget.validez_dias || 15;
      const createdAt = new Date(budget.created_at).getTime();
      const currentDateTimestamp = Date.now();
      const expirationDateTimestamp = createdAt + (expiresIn * 24 * 60 * 60 * 1000);
      if (currentDateTimestamp > expirationDateTimestamp) {
        setIsExpired(true);
      }
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
  const clientPhoneStr = budgetData?.clients?.telefono || '';
  const totalAmount = budgetData?.total_amount || 0;
  const formattedAmount = `$${totalAmount.toLocaleString('es-AR')}`;

  const serviceName = items.length > 0 ? items[0].nombre : 'Servicio';

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

  const publicUrl = mounted && budgetData ? `${window.location.origin}/public/${budgetData.public_token}` : '';
  const phoneOnlyDigits = clientPhoneStr.replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(`¡Hola! 👋 Te comparto el presupuesto de ${designerName}: ${publicUrl}`);
  const whatsappUrl = phoneOnlyDigits ? `https://wa.me/${phoneOnlyDigits}?text=${whatsappMessage}` : `https://wa.me/?text=${whatsappMessage}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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

  if (isExpired) {
    return (
      <PageWrapper showBottomNav={false} headerProps={{ title: "Enlace Expirado", showProfile: false, showNotifications: false }}>
        <div className="flex flex-col items-center justify-center h-[70vh] p-6 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Presupuesto Expirado</h2>
          <p className="text-muted-foreground mb-8 text-base max-w-md">
            Este presupuesto ha superado su período de validez de {expiresIn} días.
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      showBottomNav={false}
      headerProps={{
        title: "Cotización Publicada",
        showProfile: false,
        showNotifications: false,
        leftAction: (
           <div className="flex items-center gap-2">
            <Link href={`/presupuestos/${id}`} className="text-muted-foreground hover:text-foreground mr-1">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight">CotizApp</h1>
          </div>
        )
      }}
    >
      <div 
        className="p-4 md:p-6 pb-48 space-y-6 animate-in fade-in duration-700"
        style={{ fontFamily: mounted ? fontFamily : 'inherit' }}
      >
        
        {/* Designer Profile Presentation */}
        <div className="text-center pt-2 pb-2 space-y-3">
          <Avatar 
            className="h-20 w-20 mx-auto ring-2 ring-offset-2 ring-offset-background"
            style={{ '--tw-ring-color': mounted ? primaryColor : 'var(--primary)' } as React.CSSProperties}
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
            <h2 className="font-bold text-xl tracking-tight text-foreground">{mounted ? designerName : 'Design Studio'}</h2>
            <p className="font-medium text-[13px] text-muted-foreground">{mounted ? designerSubtitle : 'Diseño Gráfico'}</p>
            <p className="text-[11px] font-medium mt-1" style={{ color: mounted ? brightTextAndIconColor : 'var(--primary)' }}>Ref: #COT-00{id}</p>
          </div>
        </div>

        {/* Client Data Card */}
        <Card className="p-5 space-y-4 border-border/50 bg-card/60 backdrop-blur-md rounded-[24px]">
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: mounted ? brightTextAndIconColor : 'var(--primary)' }}>
            Datos del Cliente
          </h3>
          <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 text-[14px]">
            <span className="text-muted-foreground">Cliente</span>
            <span className="font-medium text-right text-foreground">{clientNameStr}</span>
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-right text-foreground">{clientEmailStr || '-'}</span>
            <span className="text-muted-foreground">Fecha</span>
            <span className="font-medium text-right text-foreground">{currentDate}</span>
          </div>
        </Card>

        {/* Services Detail Card */}
        <Card className="p-5 space-y-5 border-border/50 bg-card/60 backdrop-blur-md rounded-[24px] overflow-hidden">
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: mounted ? brightTextAndIconColor : 'var(--primary)' }}>
            Servicios Detallados
          </h3>
          {items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-start pt-1">
              <div className="space-y-1 pr-4">
                <p className="font-bold text-[15px]">{item.nombre}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{item.descripcion || 'Servicio detallado en la cotización.'}</p>
                {item.cantidad > 1 && <p className="text-[11px] text-muted-foreground">Cant: {item.cantidad}</p>}
              </div>
              <div className="text-right">
                <p className="font-bold text-[15px]">${item.precio_unitario.toLocaleString('es-AR')}</p>
              </div>
            </div>
          ))}
          
          <div className="border-t border-dashed border-border/60 pt-4 flex justify-between items-center mt-2">
            <span className="font-bold text-base">Total</span>
            <span 
              className="font-black text-[22px]"
              style={{ color: mounted ? brightTextAndIconColor : 'var(--primary)' }}
            >{formattedAmount}</span>
          </div>
        </Card>

        {/* Notes Card */}
        <Card className="p-5 space-y-3 border-border/50 bg-card/60 backdrop-blur-md rounded-[24px]">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: mounted ? brightTextAndIconColor : 'var(--primary)' }}>
            <span className="text-lg leading-none mb-0.5">≡</span> Notas
          </h3>
          <p className="text-[14px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {customNotes}
          </p>
        </Card>

        {/* Spacer for bottom action bar */}
        <div className="h-32 w-full"></div>

      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-background/95 backdrop-blur-xl border-t border-border z-40">
        <div className="w-full flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleCopyLink} 
              variant="outline"
              className={`h-12 rounded-[16px] font-bold text-[15px] border-border/60 ${copied ? "bg-green-600/10 text-green-600 border-green-600/20" : ""}`}
            >
              {copied ? (
                <><Check className="w-5 h-5 mr-2" /> Copiado</>
              ) : (
                <><Link2 className="w-5 h-5 mr-2" /> Copiar link</>
              )}
            </Button>
            
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contents">
              <Button 
                className="h-12 rounded-[16px] font-bold text-[15px] text-white w-full"
                style={{ backgroundColor: '#25D366' }}
              >
                <Send className="w-4 h-4 mr-2" /> WhatsApp
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleDownloadPdf}
              variant="outline" 
              className="h-12 rounded-[16px] border-border/60 hover:bg-muted/10 font-bold bg-card"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            
            <Link href={`/presupuestos/${id}?action=mark_sent`} className="contents">
              <Button 
                variant="outline" 
                className="h-12 rounded-[16px] border-border/60 hover:bg-muted/10 font-bold bg-card"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviado
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
