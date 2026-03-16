'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Plus, Save, RotateCcw, Search, Trash2, Edit2, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TarifaRegional, getCustomTariffs, saveCustomTariffs, resetTariffsToDefault, regionalTariffs as defaultTariffs } from '@/lib/tarifarios';
import { toast } from 'sonner';

export default function AdminTarifariosPage() {
  const [tariffs, setTariffs] = useState<TarifaRegional[]>([]);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TarifaRegional | null>(null);

  useEffect(() => {
    setMounted(true);
    setTariffs(getCustomTariffs());
  }, []);

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres restaurar el tarifario original? Perderás todos tus cambios y servicios personalizados.')) {
      resetTariffsToDefault();
      setTariffs(defaultTariffs);
      toast.success('Tarifario restaurado a los valores por defecto');
    }
  };

  const startEdit = (tariff: TarifaRegional) => {
    setEditingId(tariff.id);
    setEditForm({ ...tariff });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = () => {
    if (!editForm) return;
    
    // Add new or update existing
    let updatedTariffs;
    if (tariffs.some(t => t.id === editForm.id)) {
      updatedTariffs = tariffs.map(t => t.id === editForm.id ? editForm : t);
    } else {
      updatedTariffs = [editForm, ...tariffs];
    }
    
    setTariffs(updatedTariffs);
    saveCustomTariffs(updatedTariffs);
    setEditingId(null);
    setEditForm(null);
    toast.success('Servicio guardado correctamente');
  };

  const deleteTariff = (id: string, name: string) => {
    if (confirm(`¿Eliminar "${name}" del catálogo?`)) {
      const updatedTariffs = tariffs.filter(t => t.id !== id);
      setTariffs(updatedTariffs);
      saveCustomTariffs(updatedTariffs);
      toast.success('Servicio eliminado');
    }
  };

  const startNew = () => {
    const newId = `custom-\${Date.now()}`;
    setEditingId(newId);
    setEditForm({
      id: newId,
      name: 'Nuevo Servicio',
      prices: {
        rafaela: 0,
        rosario: 0,
        cordoba: 0
      }
    });
  };

  const filteredTariffs = tariffs.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <PageWrapper
      showBottomNav={false}
      headerProps={{
        title: "Admin Tarifario",
        showProfile: false,
        showNotifications: false,
        leftAction: (
          <div className="flex items-center gap-2">
            <Link href="/perfil" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-[20px] font-bold tracking-tight">Catálogo</h1>
          </div>
        )
      }}
    >
      <div className="p-4 md:p-6 pb-32 space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
        
        {/* Header Actions */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Tus Servicios</h2>
            <p className="text-sm text-muted-foreground">Gestiona los precios base para tus cotizaciones.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Original
            </Button>
            <Button size="sm" onClick={startNew}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
          </div>
        </section>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar servicio..." 
            className="pl-9 bg-card border-border/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tariffs List */}
        <section className="space-y-3">
          {filteredTariffs.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground">
              No se encontraron servicios.
            </div>
          ) : (
            filteredTariffs.map((tariff) => (
              <Card key={tariff.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                {editingId === tariff.id ? (
                  // EDIT MODE
                  <div className="p-4 space-y-4 bg-muted/20">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Nombre del Servicio</label>
                      <Input 
                        value={editForm?.name || ''} 
                        onChange={(e) => setEditForm(prev => prev ? {...prev, name: e.target.value} : null)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Base (Rafaela)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                          <Input 
                            type="number" 
                            className="pl-7"
                            value={editForm?.prices.rafaela || 0} 
                            onChange={(e) => setEditForm(prev => prev ? {...prev, prices: {...prev.prices, rafaela: parseInt(e.target.value) || 0}} : null)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Rosario</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                          <Input 
                            type="number" 
                            className="pl-7"
                            value={editForm?.prices.rosario || 0} 
                            onChange={(e) => setEditForm(prev => prev ? {...prev, prices: {...prev.prices, rosario: parseInt(e.target.value) || 0}} : null)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Córdoba</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                          <Input 
                            type="number" 
                            className="pl-7"
                            value={editForm?.prices.cordoba || 0} 
                            onChange={(e) => setEditForm(prev => prev ? {...prev, prices: {...prev.prices, cordoba: parseInt(e.target.value) || 0}} : null)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="ghost" size="sm" onClick={cancelEdit}>
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={saveEdit}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // VIEW MODE
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{tariff.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                          Base: ${tariff.prices.rafaela.toLocaleString('es-AR')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Rosario: ${tariff.prices.rosario.toLocaleString('es-AR')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Córdoba: ${tariff.prices.cordoba.toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => startEdit(tariff)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteTariff(tariff.id, tariff.name)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </section>

      </div>
    </PageWrapper>
  );
}
