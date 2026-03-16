'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ChevronLeft, Layers, Info, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { regionalTariffs, getServicePricing, getCustomTariffs, TarifaRegional } from '@/lib/tarifarios';
import { toast } from 'sonner';

function PresupuestoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get('duplicate');
  const editId = searchParams.get('edit');
  const isEditing = !!editId;
  const targetId = duplicateId || editId;
  
  const targetClient = searchParams.get('client');
  const targetAmount = searchParams.get('amount') ? searchParams.get('amount')?.replace(/[^0-9]/g, '') : '';

  const [clientName, setClientName] = useState(targetClient || '');
  const [clientEmail, setClientEmail] = useState(searchParams.get('email') || '');
  const defaultExpiresIn = searchParams.get('expiresIn') || '15';
  const [expirationDays, setExpirationDays] = useState(defaultExpiresIn);
  
  const defaultNotesText = `El pago se realiza 50% por adelantado y 50% contra entrega. El presupuesto tiene una validez de ${defaultExpiresIn} días desde la fecha de emisión. Los tiempos de entrega comienzan a correr una vez efectuado el anticipo.`;
  const [notes, setNotes] = useState(searchParams.get('notes') || defaultNotesText);
  const [tariffs, setTariffs] = useState<TarifaRegional[]>([]);
  const [items, setItems] = useState<{ id: number; name: string; price: string; quantity: number; serviceId?: string }[]>([
    { id: 1, name: targetId ? `Servicios (Autocompletado visual)` : '', price: targetAmount || '', quantity: 1 }
  ]);
  
  const draftId = useState(() => isEditing ? targetId : `draft-${Date.now()}`)[0];
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    setTariffs(getCustomTariffs());
  }, []);

  useEffect(() => {
    if (targetId && !initialLoadDone) {
      setClientName(targetClient || '');
      setClientEmail(searchParams.get('email') || '');
      setItems([{ 
        id: Date.now(), 
        name: `Servicios (Autocompletado visual)`, 
        price: targetAmount || '', 
        quantity: 1 
      }]);
      setInitialLoadDone(true);
    } else {
      setInitialLoadDone(true);
    }
  }, [targetId, targetClient, targetAmount, searchParams, initialLoadDone]);

  // Auto-save logic
  useEffect(() => {
    if (!initialLoadDone) return;
    
    const timeoutId = setTimeout(() => {
      // Calculate total amount
      const currentAmount = items.reduce((acc, current) => acc + (parseFloat(current.price || '0') * current.quantity), 0);
      
      const draft = {
        id: draftId,
        folio: `COT-00${Math.floor(Math.random() * 100) + 10}`, // Random for mockup, will be DB generated
        client: clientName || 'Borrador sin cliente',
        clientEmail: clientEmail,
        clientInitial: (clientName || 'B').charAt(0).toUpperCase(),
        amount: `$${currentAmount.toLocaleString('es-AR')}`,
        date: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()),
        status: 'Borrador',
        statusColor: 'text-muted-foreground bg-muted border-border',
        // We save the raw data so we could potentially re-hydrate it fully later
        _rawData: { items, notes, expiresIn: expirationDays }
      };
      
      const existingDrafts = JSON.parse(localStorage.getItem('cotiza_drafts') || '[]');
      const filtered = existingDrafts.filter((d: any) => d.id !== draftId);
      localStorage.setItem('cotiza_drafts', JSON.stringify([draft, ...filtered]));
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timeoutId);
  }, [clientName, clientEmail, items, notes, expirationDays, draftId, initialLoadDone]);

  const addManualItem = () => {
    setItems([{ id: Date.now(), name: '', price: '', quantity: 1, serviceId: undefined }, ...items]);
  };

  const adCatalogItem = (catalogId: string | null) => {
    if (!catalogId) return;
    const service = regionalTariffs.find(s => s.id === catalogId);
    const pricing = getServicePricing(catalogId);
    if (service && pricing) {
      // If the first item is empty, overwrite it. Otherwise, prepend.
      if (items.length === 1 && items[0].name === '' && items[0].price === '') {
        setItems([{ 
          id: items[0].id, 
          name: service.name, 
          price: pricing.base.toString(), 
          quantity: 1, 
          serviceId: catalogId 
        }]);
      } else {
        setItems([...items, { id: Date.now(), name: service.name, price: pricing.base.toString(), quantity: 1, serviceId: catalogId }]);
      }
    }
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <PageWrapper
      showBottomNav={false}
      headerProps={{
        title: isEditing ? "Editar Cotización" : "Crear Cotización",
        showProfile: false,
        showNotifications: false,
        leftAction: (
          <div className="flex items-center gap-2">
            <button 
              className="text-muted-foreground hover:text-foreground focus:outline-none"
              onClick={() => router.push('/presupuestos')}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-[20px] font-bold tracking-tight">{isEditing ? "Editar Cotización" : "Crear Cotización"}</h1>
          </div>
        ),
        rightAction: (
          <Button 
            variant="ghost" 
            className="text-primary font-semibold text-sm"
            onClick={() => {
              setClientName('');
              setItems([{ id: Date.now(), name: '', price: '', quantity: 1, serviceId: undefined }]);
            }}
          >
            Limpiar
          </Button>
        )
      }}
    >
      <div className="p-4 md:p-6 pb-32 space-y-8 animate-in fade-in duration-500">
        
        {/* Client Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground/90">Datos del cliente</h2>
          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Nombre / Empresa *</label>
              <Input placeholder="Ej: Acme Corp" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Correo (Opcional)</label>
                <Input type="email" placeholder="contacto@ejemplo.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Validez (Días)</label>
                <Input type="number" min="1" placeholder="15" value={expirationDays} onChange={(e) => {
                  const newVal = e.target.value;
                  setExpirationDays(newVal);
                  if (notes.includes('El presupuesto tiene una validez de')) {
                    setNotes(notes.replace(/validez de \d+ días/, `validez de ${newVal || '15'} días`));
                  }
                }} />
              </div>
            </div>
          </Card>
        </section>

        {/* Services Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full border border-primary/30 text-primary bg-transparent text-sm font-medium hover:bg-primary/10 h-8 px-3 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 outline-none">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Agregar de catálogo
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-[300px] overflow-y-auto w-[320px] sm:w-[400px] border-border/50 bg-popover/95 backdrop-blur-md">
                {regionalTariffs.map(service => {
                  const pricing = getServicePricing(service.id)!;
                  return (
                    <DropdownMenuItem 
                      key={service.id} 
                      onClick={() => adCatalogItem(service.id)}
                      className="flex justify-between items-center cursor-pointer p-2.5 hover:bg-accent/50 focus:bg-accent/50"
                    >
                      <span className="truncate mr-4 font-semibold text-sm">{service.name}</span>
                      <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap bg-muted px-1.5 py-0.5 rounded-sm">
                        Desde ${pricing.min.toLocaleString('es-AR')}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <Card key={item.id} className="p-4 flex flex-col gap-3 relative overflow-visible">
                {items.length > 1 && (
                  <button 
                    aria-label="Eliminar servicio"
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Servicio {index + 1}</label>
                  <Input placeholder="Descripción del servicio" value={item.name} onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].name = e.target.value;
                    setItems(newItems);
                  }} />
                </div>
                <div className="flex gap-3">
                  <div className="space-y-2 flex-[2]">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {item.serviceId ? 'Precio sugerido' : 'Precio'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input type="number" placeholder="0.00" className="pl-7" value={item.price} onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].price = e.target.value;
                        setItems(newItems);
                      }} />
                    </div>
                    {item.serviceId && getServicePricing(item.serviceId) && (() => {
                      const pricing = getServicePricing(item.serviceId)!;
                      const currentPrice = parseFloat(item.price);
                      
                      let warningMessage = null;
                      if (!isNaN(currentPrice)) {
                        if (currentPrice < pricing.min) {
                          warningMessage = "El precio está por debajo del sugerido regional.";
                        } else if (currentPrice > pricing.max * 1.5) {
                          warningMessage = "El precio supera ampliamente el máximo regional (1.5x).";
                        }
                      }
                      
                      return (
                        <div className="mt-2.5 p-3 bg-secondary/30 rounded-xl border border-primary/20 space-y-1.5 shadow-sm">
                          <p className="text-[12px] text-primary font-bold flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            Base Sugerida (Rafaela): ${pricing.base.toLocaleString('es-AR')}
                          </p>
                          <p className="text-[11px] text-primary/80 font-medium pl-5">
                            Rango Regional: ${pricing.min.toLocaleString('es-AR')} - ${pricing.max.toLocaleString('es-AR')}
                          </p>
                          {warningMessage && (
                            <div className="flex items-start gap-1.5 mt-2 bg-amber-500/10 p-2 rounded-lg text-amber-500 shadow-sm animate-in fade-in zoom-in-95 duration-200 border border-amber-500/20">
                              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                              <p className="text-[11px] font-bold leading-tight">
                                {warningMessage}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="space-y-2 flex-[1]">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cant.</label>
                    <Input type="number" min="1" value={item.quantity} onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].quantity = parseInt(e.target.value) || 1;
                      setItems(newItems);
                    }} />
                  </div>
                </div>
              </Card>
            ))}
            
            <Button variant="outline" className="w-full border-dashed border-2 py-6 text-muted-foreground hover:text-foreground hover:border-border" onClick={addManualItem}>
              <Plus className="h-5 w-5 mr-2" />
              Agregar manual
            </Button>
          </div>
        </section>

        {/* Subtotal Section */}
        <section className="bg-card rounded-[20px] p-5 border border-border/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-lg text-foreground">
              ${items.reduce((acc, current) => acc + (parseFloat(current.price || '0') * current.quantity), 0).toLocaleString('es-AR')}
            </span>
          </div>
        </section>

        {/* Notes Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground/90">Notas (Opcional)</h2>
          <Card className="p-4 border border-border/50">
            <textarea 
              className="w-full h-24 bg-transparent border-none resize-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground text-sm"
              placeholder="Términos, condiciones o notas adicionales para el cliente..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </Card>
        </section>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-background/80 backdrop-blur-md border-t border-border z-40">
        <div className="w-full flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => {
              // The draft is already auto-saved by the useEffect
              toast.success('Borrador guardado');
              router.push('/presupuestos');
            }}
          >
            Guardar borrador
          </Button>
          <Button 
            className="flex-[2]" 
            onClick={() => {
              // Calculate final amounts
              const amount = items.reduce((acc, current) => acc + (parseFloat(current.price || '0') * current.quantity), 0);
              const firstService = items[0]?.name || 'Servicios Varios';
              
              // Remove the draft since it's now being generated
              const existingDrafts = JSON.parse(localStorage.getItem('cotiza_drafts') || '[]');
              const filtered = existingDrafts.filter((d: any) => d.id !== draftId);
              localStorage.setItem('cotiza_drafts', JSON.stringify(filtered));

              // Navigate to the generated view
              const safeId = draftId ? draftId.replace('draft-', '') : '1';
              router.push(`/presupuestos/${safeId}?client=${encodeURIComponent(clientName || 'Cliente')}&email=${encodeURIComponent(clientEmail)}&service=${encodeURIComponent(firstService)}&amount=${amount}&notes=${encodeURIComponent(notes)}&expiresIn=${expirationDays}&createdAt=${Date.now()}`);
            }}
          >
            Generar
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

export default function NuevoPresupuestoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando constructor...</div>}>
      <PresupuestoForm />
    </Suspense>
  );
}
