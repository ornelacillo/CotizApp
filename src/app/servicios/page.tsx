'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function ServiciosPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('service_catalog')
      .select('*')
      .or(`designer_id.eq.${user.id},origen.eq.system`)
      .order('nombre');

    if (!error && data) {
      setServices(data);
    }
    setLoading(false);
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (confirm(`¿Eliminar ${name} del catálogo?`)) {
      const supabase = createClient();
      const { error } = await supabase.from('service_catalog').delete().eq('id', id);
      if (error) {
        toast.error("Error al eliminar");
        return;
      }
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success("Servicio eliminado");
    }
  };

  return (
    <PageWrapper
      headerProps={{
        title: "Servicios Recurrentes",
        showProfile: true,
        showNotifications: false,
      }}
    >
      <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
        
        {/* Info Banner */}
        <Card className="p-4 bg-primary/10 border border-primary/20 flex flex-col gap-2">
          <h2 className="font-semibold text-primary">Gestioná tu catálogo</h2>
          <p className="text-sm text-primary/80">
            Ahorrá tiempo guardando los precios de los servicios que ofrecés con regularidad.
          </p>
        </Card>

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">
            {loading ? 'Cargando...' : `${services.length} servicios disponibles`}
          </span>
          <Button variant="outline" size="sm" className="h-9" onClick={() => toast.info("Funcionalidad de agregar próximamente")}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar servicio
          </Button>
        </div>

        {/* Services List */}
        <div className="grid gap-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No tenés servicios guardados todavía.
            </div>
          ) : (
            services.map((service) => (
              <Card key={service.id} className="p-4 flex items-center gap-4 hover:border-border/50 border border-transparent transition-colors">
                <div className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{service.nombre}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm font-bold text-primary">
                      ${service.precio_base ? service.precio_base.toLocaleString('es-AR') : '0'}
                    </p>
                    {service.origen === 'system' && (
                      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
                        Sugerido
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" aria-label="Editar" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {service.origen === 'custom' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      aria-label="Eliminar" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteService(service.id, service.nombre)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

      </div>
    </PageWrapper>
  );
}
