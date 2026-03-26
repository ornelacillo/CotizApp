'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Plus, Edit2, Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { getCustomTariffs, getServicePricing, TarifaRegional } from '@/lib/tarifarios';
import { cn } from '@/lib/utils';

const getCategoryForService = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('web') || n.includes('html') || n.includes('sitio') || n.includes('landing')) return 'Web UI/UX';
  if (n.includes('logo') || n.includes('identidad') || n.includes('naming') || n.includes('manual') || n.includes('slogan') || n.includes('lema') || n.includes('claim')) return 'Branding & Identidad';
  if (n.includes('redes') || n.includes('social media') || n.includes('ig') || n.includes('fanpage') || n.includes('perfil') || n.includes('contenido') || n.includes('rrss')) return 'Redes Sociales';
  if (n.includes('folleto') || n.includes('volante') || n.includes('flyer') || n.includes('aviso') || n.includes('cartel') || n.includes('banner') || n.includes('ploteado') || n.includes('señalético') || n.includes('cenefa')) return 'Publicitario y Vía Pública';
  if (n.includes('revista') || n.includes('libro') || n.includes('catálogo') || n.includes('editorial') || n.includes('página') || n.includes('almanaque') || n.includes('tapa')) return 'Editorial';
  if (n.includes('envase') || n.includes('etiqueta') || n.includes('packaging')) return 'Packaging';
  if (n.includes('ilustración') || n.includes('3d') || n.includes('animación') || n.includes('digitalización') || n.includes('personaje') || n.includes('render') || n.includes('signos') || n.includes('infografía')) return 'Ilustración & 3D';
  if (n.includes('papelería') || n.includes('tarjeta') || n.includes('hoja') || n.includes('sobre') || n.includes('carpeta') || n.includes('certificado') || n.includes('postal')) return 'Papelería';
  if (n.includes('merchandising') || n.includes('remera') || n.includes('calco') || n.includes('lapicera') || n.includes('pad') || n.includes('taza') || n.includes('bandera') || n.includes('uniforme') || n.includes('prenda')) return 'Merchandising';
  return 'Otros Servicios';
};

export default function ServiciosPage() {
  const [customServices, setCustomServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('service_catalog')
        .select('*')
        .eq('designer_id', user.id)
        .order('nombre');

      if (!error && data) {
        setCustomServices(data);
      }
    }
    setLoading(false);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (confirm(`¿Eliminar ${name} de tus servicios personalizados?`)) {
      const supabase = createClient();
      const { error } = await supabase.from('service_catalog').delete().eq('id', id);
      if (error) {
        toast.error("Error al eliminar");
        return;
      }
      setCustomServices(prev => prev.filter(s => s.id !== id));
      toast.success("Servicio eliminado");
    }
  };

  // Group the default tariffs
  const defaultTariffs = getCustomTariffs();
  const groupedTariffs = defaultTariffs.reduce((acc, service) => {
    const cat = getCategoryForService(service.name);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {} as Record<string, TarifaRegional[]>);

  // Group the custom services from DB into a special category
  if (customServices.length > 0) {
    groupedTariffs['Mis Servicios Personales'] = customServices.map(cs => ({
      id: cs.id,
      name: cs.nombre,
      prices: {
        rafaela: cs.precio_base || 0,
        rosario: cs.precio_base || 0,
        cordoba: cs.precio_base || 0
      },
      isCustom: true // internal flag
    } as any));
  }

  const categoryEntries = Object.entries(groupedTariffs);

  return (
    <PageWrapper
      headerProps={{
        title: "Servicios Recurrentes",
        showProfile: true,
        showNotifications: false,
      }}
    >
      <div className="p-4 md:p-6 pb-24 space-y-6 animate-in fade-in duration-500">
        
        {/* Info Banner */}
        <Card className="p-4 bg-primary/10 border border-primary/20 flex flex-col gap-2">
          <h2 className="font-semibold text-primary">Gestioná tu catálogo</h2>
          <p className="text-sm text-primary/80">
            Ahorrá tiempo explorando y guardando los precios de los servicios que ofrecés con regularidad.
          </p>
        </Card>

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">
            {loading ? 'Cargando...' : `${defaultTariffs.length + customServices.length} servicios disponibles`}
          </span>
          <Button variant="outline" size="sm" className="h-9" onClick={() => toast.info("Funcionalidad de agregar próximamente")}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar servicio
          </Button>
        </div>

        {/* Services List - Categorized */}
        <div className="grid gap-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            categoryEntries.map(([category, svcs]) => (
              <div key={category} className="rounded-xl border border-border/50 bg-card overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      category === 'Mis Servicios Personales' ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
                    )}>
                      <Layers className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-[15px]">{category}</h3>
                      <p className="text-xs text-muted-foreground">{svcs.length} servicios</p>
                    </div>
                  </div>
                  {expandedCategories[category] ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                
                {expandedCategories[category] && (
                  <div className="border-t border-border/50 divide-y divide-border/30 bg-background/50">
                    {svcs.map((service: any) => {
                      const isCustom = service.isCustom;
                      const pricing = isCustom ? { min: service.prices.rafaela, base: service.prices.rafaela } : getServicePricing(service.id);
                      
                      return (
                        <div key={service.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="font-semibold text-sm leading-tight mb-1.5">{service.name}</p>
                            <div className="flex items-center gap-2">
                              {pricing && (
                                <p className="text-[13px] font-bold text-primary">
                                  ${pricing.base?.toLocaleString('es-AR') || '0'}
                                </p>
                              )}
                              {!isCustom && (
                                <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded-sm">
                                  Sugerido
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-1 shrink-0">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              aria-label="Editar" 
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => toast.info("Edición de catálogo próximamente")}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {isCustom && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                aria-label="Eliminar" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteService(service.id, service.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </PageWrapper>
  );
}
