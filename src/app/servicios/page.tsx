'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';
import { regionalTariffs, getServicePricing } from '@/lib/tarifarios';

export default function ServiciosPage() {
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
          <span className="text-sm font-semibold text-muted-foreground">{regionalTariffs.length} servicios guardados</span>
          <Button variant="outline" size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1" />
            Agregar servicio
          </Button>
        </div>

        {/* Services List */}
        <div className="grid gap-3">
          {regionalTariffs.map((service) => {
            const pricing = getServicePricing(service.id)!;
            
            return (
              <Card key={service.id} className="p-4 flex items-center gap-4 hover:border-border/50 border border-transparent transition-colors">
                <div className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{service.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm font-bold text-primary">${pricing.base.toLocaleString('es-AR')}</p>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
                      Ref: ${pricing.min.toLocaleString('es-AR')} - ${pricing.max.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" aria-label="Editar" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Eliminar" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </PageWrapper>
  );
}
