'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import tinycolor from 'tinycolor2';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBudgetByToken } from '@/app/actions/getBudgetByToken';

export default function PublicBudgetPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [branding, setBranding] = useState<any>(null);

  useEffect(() => {
    if (token) {
      fetchBudget();
    }
  }, [token]);

  const fetchBudget = async () => {
    setLoading(true);
    
    try {
      const { budget: data, branding: brandingData } = await getBudgetByToken(token);
      
      setBudget(data);
      setBranding(brandingData);

      // Track view (simple log)
      try {
        const supabase = createClient();
        await supabase.from('budget_views').insert({
          budget_id: data.id
        });
      } catch (e) {
        console.error("View tracking failed", e);
      }
      
    } catch (err: any) {
      setError(err.message || "No se pudo encontrar el presupuesto solicitado.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/30">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Cargando presupuesto...</p>
      </div>
    );
  }

  if (error || !budget) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-destructive/50" />
        <h1 className="text-2xl font-bold">Ups! Algo salió mal</h1>
        <p className="text-muted-foreground max-w-xs">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  const latestVersion = budget.budget_versions?.[0]; 
  const designer = budget.designer_profiles;
  const client = budget.clients;
  const items = latestVersion?.budget_items || [];
  
  const primaryColor = branding?.color_principal || '#6B5CFF';
  const fontFamily = branding?.tipografia || 'Inter';
  const logo = branding?.logo_path;
  
  const color = tinycolor(primaryColor);
  const badgeBgColor = color.setAlpha(0.10).toRgbString();
  const initials = designer?.nombre?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const formattedTotal = `$${(latestVersion?.total || 0).toLocaleString('es-AR')}`;
  const dateStr = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(budget.created_at));

  return (
    <div className="min-h-screen bg-muted/10 pb-20" style={{ fontFamily }}>
      {/* Branding Header */}
      <div className="bg-background border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/10">
              <AvatarImage src={logo || ""} />
              <AvatarFallback style={{ backgroundColor: primaryColor }} className="text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-bold text-sm leading-tight">{designer?.nombre}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{designer?.experiencia || 'Diseño'}</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-tighter">Cotización Privada</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 mt-4">
        {/* Status Banner */}
        <div 
          className="flex items-center justify-between p-4 rounded-2xl border"
          style={{ backgroundColor: badgeBgColor, borderColor: `${primaryColor}22` }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5" style={{ color: primaryColor }} />
            <div className="text-left">
              <p className="font-bold text-sm" style={{ color: primaryColor }}>Presupuesto Oficial</p>
              <p className="text-xs opacity-70" style={{ color: primaryColor }}>Vence en {budget.validez_dias} días</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs font-bold" 
            style={{ color: primaryColor }}
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4 mr-2" /> PDF
          </Button>
        </div>

        {/* Client & Info */}
        <Card className="p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-border/50">
            <div className="space-y-1 text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Para</p>
              <h2 className="text-2xl font-bold">{client?.nombre}</h2>
              <p className="text-sm text-muted-foreground">{client?.empresa}</p>
            </div>
            <div className="sm:text-right text-left space-y-1 border-t sm:border-t-0 pt-4 sm:pt-0 border-border/30">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Emisión</p>
              <p className="text-sm font-medium">{dateStr}</p>
              <p className="text-xs text-muted-foreground uppercase">Folio: COT-{budget.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" /> Detalle del Proyecto
            </h3>
            <div className="bg-muted/30 rounded-2xl p-4 sm:p-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">Tipo de Proyecto</p>
                <p className="font-semibold text-lg">{latestVersion?.project_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">Descripción</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {latestVersion?.project_description || 'Sin descripción.'}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-4 text-left">
             <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Servicios e Inversión</h3>
             <div className="border rounded-2xl overflow-hidden">
                <div className="bg-muted/50 p-4 hidden sm:grid grid-cols-12 gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <div className="col-span-8">Servicio / Detalle</div>
                  <div className="col-span-1 text-center">Cant.</div>
                  <div className="col-span-3 text-right">Subtotal</div>
                </div>
                <div className="divide-y divide-border/30">
                  {items.map((item: any) => (
                    <div key={item.id} className="p-4 grid grid-cols-1 gap-1 sm:grid-cols-12 sm:gap-4 items-center">
                      <div className="sm:col-span-8">
                        <p className="font-semibold">{item.nombre}</p>
                        {item.descripcion && <p className="text-xs text-muted-foreground mt-0.5">{item.descripcion}</p>}
                      </div>
                      <div className="sm:col-span-1 text-sm sm:text-center text-muted-foreground flex items-center gap-2 sm:block">
                        <span className="sm:hidden font-medium text-[10px] uppercase">Cant: </span>{item.cantidad}
                      </div>
                      <div className="sm:col-span-3 text-right font-bold" style={{ color: primaryColor }}>
                        ${item.subtotal?.toLocaleString('es-AR')}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-muted/20 flex flex-col items-end gap-1">
                  <p className="text-xs font-medium text-muted-foreground">Total Inversión</p>
                  <p className="text-3xl font-black" style={{ color: primaryColor }}>
                    {formattedTotal} <span className="text-sm font-bold opacity-50">ARS</span>
                  </p>
                </div>
             </div>
          </div>

          {/* Conditions */}
          {latestVersion?.condiciones && (
            <div className="space-y-3 pt-4 text-left border-t border-border/30">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Términos y Condiciones</h4>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap leading-relaxed">
                {latestVersion.condiciones}
              </p>
            </div>
          )}
        </Card>

        {/* Action Bar for Mobile/Public */}
        <div className="pt-8 flex flex-col items-center gap-6">
           <div className="text-center space-y-4">
             <p className="text-sm font-medium">¿Alguna duda sobre esta cotización?</p>
             <div className="flex gap-4 justify-center">
                <Button variant="outline" className="rounded-full px-6" render={<a href={`mailto:${designer?.email}`} />}>
                  Enviar Email
                </Button>
                {branding?.redes_json?.instagram && (
                  <Button variant="outline" className="rounded-full px-6" render={<a href={`https://instagram.com/${branding.redes_json.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" />}>
                    Instagram
                  </Button>
                )}
             </div>
           </div>
           
           <p className="text-[10px] text-muted-foreground opacity-30 uppercase tracking-widest">
             Generado digitalmente por CotizApp para {designer?.nombre}
           </p>
        </div>
      </div>
    </div>
  );
}
