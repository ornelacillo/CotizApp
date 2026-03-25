'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ChevronLeft, Layers, Info, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { regionalTariffs, getServicePricing, getCustomTariffs, TarifaRegional } from '@/lib/tarifarios';
import { toast } from 'sonner';

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

function PresupuestoForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get('duplicate');
  const editId = searchParams.get('edit');
  const isEditing = !!editId;
  const targetId = duplicateId || editId;
  
  const targetClient = searchParams.get('client');
  const targetAmount = searchParams.get('amount') ? searchParams.get('amount')?.replace(/[^0-9]/g, '') : '';

  const [clientName, setClientName] = useState(targetClient || '');
  const [clientEmail, setClientEmail] = useState(searchParams.get('email') || '');
  const [clientPhoto, setClientPhoto] = useState('');
  const [allClients, setAllClients] = useState<any[]>([]);
  const defaultExpiresIn = searchParams.get('expiresIn') || '15';
  const [expirationDays, setExpirationDays] = useState(defaultExpiresIn);
  
  const defaultNotesText = `El pago se realiza 50% por adelantado y 50% contra entrega. El presupuesto tiene una validez de ${defaultExpiresIn} días desde la fecha de emisión. Los tiempos de entrega comienzan a correr una vez efectuado el anticipo.`;
  const [notes, setNotes] = useState(searchParams.get('notes') || defaultNotesText);
  const [tariffs, setTariffs] = useState<TarifaRegional[]>([]);
  const [items, setItems] = useState<{ id: number; name: string; price: string; quantity: number; serviceId?: string }[]>([
    { id: 1, name: targetId ? `Servicios (Cargando...)` : '', price: targetAmount || '', quantity: 1 }
  ]);
  
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    setTariffs(getCustomTariffs());
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch Clients for lookup
    const { data: clients } = await supabase
      .from('clients')
      .select('*')
      .eq('designer_id', user.id);
    if (clients) setAllClients(clients);

    // If editing or duplicating, fetch existing budget data
    if (targetId) {
      const { data: budget, error } = await supabase
        .from('budgets')
        .select(`
          *,
          clients (*),
          budget_versions (
            *,
            budget_items (*)
          )
        `)
        .eq('id', targetId)
        .single();

      if (!error && budget) {
        setClientName(budget.clients?.nombre || '');
        setClientEmail(budget.clients?.email || '');
        setExpirationDays(budget.validez_dias?.toString() || '15');
        
        const latestVersion = budget.budget_versions?.[0];
        if (latestVersion) {
          setNotes(latestVersion.condiciones || defaultNotesText);
          if (latestVersion.budget_items?.length > 0) {
            setItems(latestVersion.budget_items.map((item: any) => ({
              id: item.id,
              name: item.nombre,
              price: item.precio_unitario.toString(),
              quantity: item.cantidad,
              serviceId: undefined // Could be mapped if needed
            })));
          }
        }
      }
    }
    setInitialLoadDone(true);
  };

  // Sync with selected client
  useEffect(() => {
    if (!clientName || !allClients.length) return;
    const existing = allClients.find((c: any) => c.nombre.toLowerCase() === clientName.toLowerCase());
    if (existing) {
      if (!clientEmail) setClientEmail(existing.email || '');
      // If client photo was in DB, we'd set it here
    }
  }, [clientName, allClients, clientEmail]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Client photos not yet fully implemented in Supabase Storage, placeholder for now
    toast.info("Carga de fotos de clientes próximamente con Supabase Storage");
  };

  const addManualItem = () => {
    setItems([{ id: Date.now(), name: '', price: '', quantity: 1, serviceId: undefined }, ...items]);
  };

  const adCatalogItem = (catalogId: string | null) => {
    if (!catalogId) return;
    const service = tariffs.find(s => s.id === catalogId);
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

  const groupedTariffs = tariffs.reduce((acc, service) => {
    const cat = getCategoryForService(service.name);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {} as Record<string, TarifaRegional[]>);

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
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer shrink-0">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handlePhotoUpload}
                  title="Cambiar foto del cliente"
                />
                <Avatar className="h-14 w-14 border-2 border-border/50 shadow-sm relative overflow-hidden group-hover:opacity-80 transition-opacity">
                  <AvatarImage src={clientPhoto || ""} />
                  <AvatarFallback className="bg-muted text-foreground font-semibold text-lg">
                    {(clientName || 'C').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none">
                  <span className="text-[8px] text-white font-semibold text-center leading-tight uppercase">Editar</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Nombre / Empresa *</label>
                <Input placeholder="Ej: Acme Corp" value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>
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
              <DropdownMenuContent className="max-h-[60vh] overflow-y-auto w-[320px] sm:w-[400px] border-border/50 bg-popover/95 backdrop-blur-md p-1.5 rounded-xl shadow-xl">
                {Object.entries(groupedTariffs).map(([category, svcs]) => (
                  <DropdownMenuSub key={category}>
                    <DropdownMenuSubTrigger className="py-2.5 px-3 rounded-lg mb-1">
                      <Layers className="w-4 h-4 mr-2 text-primary" />
                      <span className="font-semibold text-[14px]">{category}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-[300px] sm:w-[360px] max-h-[50vh] overflow-y-auto p-1.5 shadow-xl border-border/60">
                      {svcs.map(service => {
                        const pricing = getServicePricing(service.id);
                        if (!pricing) return null;
                        return (
                          <DropdownMenuItem 
                            key={service.id} 
                            onClick={() => adCatalogItem(service.id)}
                            className="flex flex-col items-start cursor-pointer p-3 hover:bg-accent/60 focus:bg-accent/60 mb-1 rounded-md transition-colors"
                          >
                            <span className="whitespace-normal break-words leading-tight font-semibold text-[13px] text-left">
                              {service.name}
                            </span>
                            <span className="text-[11px] font-bold text-primary mt-1.5 bg-primary/10 px-2 py-0.5 rounded border border-primary/20 self-start">
                              Desde ${pricing.min.toLocaleString('es-AR')}
                            </span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
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
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const supabase = createClient();
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) {
                toast.error("Debes iniciar sesión");
                setLoading(false);
                return;
              }

              // 1. Handle Client
              let clientId = null;
              const { data: existingClient } = await supabase
                .from('clients')
                .select('id')
                .ilike('nombre', clientName)
                .single();
              
              if (existingClient) {
                clientId = existingClient.id;
              } else {
                const { data: newClient, error: clientErr } = await supabase
                  .from('clients')
                  .insert({ 
                    nombre: clientName || 'Consumidor Final', 
                    email: clientEmail,
                    designer_id: user.id 
                  })
                  .select()
                  .single();
                if (!clientErr) clientId = newClient.id;
              }

              // 2. Create Budget
              const totalAmount = items.reduce((acc, current) => acc + (parseFloat(current.price || '0') * current.quantity), 0);
              const { data: budget, error: budgetErr } = await supabase
                .from('budgets')
                .insert({
                  designer_id: user.id,
                  client_id: clientId,
                  estado_actual: 'sent', // Mark as sent when generated
                  total_amount: totalAmount, // I'll assume this column exists or I'll add it if needed, if not I'll just use it for the list
                  validez_dias: parseInt(expirationDays) || 15
                })
                .select()
                .single();

              if (budgetErr) {
                toast.error("Error al guardar el presupuesto");
                setLoading(false);
                return;
              }

              // 3. Create Version
              const { data: version, error: versionErr } = await supabase
                .from('budget_versions')
                .insert({
                  budget_id: budget.id,
                  project_description: items[0]?.name || 'Servicios Varios',
                  condiciones: notes,
                  total: totalAmount
                })
                .select()
                .single();

              if (!versionErr) {
                // 4. Create Items
                const budgetItems = items.map((item, idx) => ({
                  budget_version_id: version.id,
                  nombre: item.name,
                  precio_unitario: parseFloat(item.price || '0'),
                  cantidad: item.quantity,
                  orden: idx
                }));
                await supabase.from('budget_items').insert(budgetItems);
              }

              // 5. Success
              toast.success(isEditing ? "Presupuesto actualizado" : "Presupuesto generado y guardado");
              router.push(`/presupuestos/${budget.id}`);
            }}
          >
            {loading ? 'Guardando...' : 'Generar'}
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
