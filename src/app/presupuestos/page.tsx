'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Status badge color mapping
const statusMap: Record<string, string> = {
  'draft': 'Borrador',
  'sent': 'Enviado',
  'viewed': 'Visto',
  'accepted': 'Aceptado',
  'rejected': 'Rechazado',
  'expired': 'Expirado'
};

const getUIStatus = (dbStatus: string) => statusMap[dbStatus] || 'Borrador';

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Pendiente': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'Enviado': return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'Visto': return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20';
    case 'Aceptado': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'Borrador': return 'text-muted-foreground bg-muted border-border';
    case 'Rechazado': return 'text-red-500 bg-red-500/10 border-red-500/20';
    default: return 'text-muted-foreground bg-muted border-border';
  }
};

const filters = ['Todos', 'Borradores', 'Pendientes', 'Enviados', 'Aceptados'];

export default function PresupuestosPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [allBudgets, setAllBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        clients (
          nombre,
          email
        ),
        budget_versions (
          total,
          project_description
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formatted = data.map((b: any) => {
        // Get the latest version total
        const latestVersion = b.budget_versions?.[0]; // Usually just one for now
        return {
          id: b.id,
          folio: `COT-${b.id.slice(0, 4).toUpperCase()}`,
          client: b.clients?.nombre || 'Sin cliente',
          clientInitial: (b.clients?.nombre || 'C').charAt(0).toUpperCase(),
          amount: latestVersion?.total ? `$${latestVersion.total.toLocaleString('es-AR')}` : '$0',
          date: new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(b.created_at)),
          status: getUIStatus(b.estado_actual),
        };
      });
      
      setAllBudgets(formatted);
    }
    setLoading(false);
  };

  const handleDeleteBudget = async (id: string, clientName: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el presupuesto de ${clientName}?`)) {
      const supabase = createClient();
      
      // If it's a real Supabase ID (UUID usually), delete from DB
      const { error } = await supabase.from('budgets').delete().eq('id', id);
      if (error) {
        toast.error("Error al eliminar el presupuesto");
        return;
      }

      // Filter locally
      setAllBudgets(prev => prev.filter(budget => budget.id !== id));
      toast.success("Presupuesto eliminado");
    }
  };

  const filteredBudgets = allBudgets.filter(budget => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Borradores') return budget.status === 'Borrador';
    if (activeFilter === 'Pendientes') return budget.status === 'Pendiente';
    if (activeFilter === 'Enviados') return budget.status === 'Enviado';
    if (activeFilter === 'Aceptados') return budget.status === 'Aceptado';
    return true;
  });

  return (
    <PageWrapper
      headerProps={{
        title: "Cotizaciones",
        showNotifications: false,
        showProfile: true,
      }}
    >
      <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
        
        {/* Search and Filters */}
        <div className="space-y-4 sticky top-[64px] z-30 bg-background/95 backdrop-blur py-2 -mx-4 px-4 md:-mx-6 md:px-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar cliente o folio..." 
                className="pl-9 h-11 bg-card border-none"
              />
            </div>
            <Button variant="outline" size="icon" aria-label="Filtrar" className="h-11 w-11 shrink-0 border-none bg-card hover:bg-card/80">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:-mx-6 md:px-6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors border",
                  activeFilter === filter 
                    ? "bg-primary border-primary text-white" 
                    : "bg-transparent border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Budget List */}
        <div className="grid gap-3">
          {filteredBudgets.map((budget) => (
            <div key={budget.id}>
              <Card 
                className="p-4 flex items-center gap-4 hover:bg-card/80 transition-colors border border-transparent hover:border-border/50 cursor-pointer"
                onClick={() => {
                  if (budget.status === 'Borrador' || budget.id.toString().startsWith('draft-')) {
                    router.push(`/presupuestos/nuevo?edit=${budget.id}&client=${encodeURIComponent(budget.client)}&amount=${encodeURIComponent(budget.amount.replace(/[^0-9]/g, ''))}`);
                  } else {
                    router.push(`/presupuestos/${budget.id}`);
                  }
                }}
              >
                <Avatar className="h-12 w-12 border border-border/50">
                  <AvatarFallback className="bg-background text-foreground font-semibold">
                    {budget.clientInitial}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold truncate text-[15px]">{budget.client}</p>
                    <p className="font-bold text-primary">{budget.amount}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{budget.folio}</span>
                      <span>•</span>
                      <span>{budget.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                      getStatusStyle(budget.status)
                    )}>
                      {budget.status}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger aria-label="Opciones" className="flex items-center justify-center rounded-md h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent hover:text-accent-foreground outline-none" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 border-border/50 bg-popover/95 backdrop-blur-md z-50">
                        <DropdownMenuItem onClick={(e) => { e.preventDefault(); window.location.href = `/presupuestos/nuevo?edit=${budget.id}&client=${encodeURIComponent(budget.client)}&amount=${encodeURIComponent(budget.amount.replace(/[^0-9]/g, ''))}`; }}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.preventDefault(); window.location.href = `/presupuestos/nuevo?duplicate=${budget.id}&client=${encodeURIComponent(budget.client)}&amount=${encodeURIComponent(budget.amount.replace(/[^0-9]/g, ''))}`; }}>
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => { e.preventDefault(); handleDeleteBudget(budget.id, budget.client); }}>
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {budget.status === 'Pendiente' && (
                    <button
                      className="text-[10px] uppercase font-bold text-green-500 hover:text-green-400 flex items-center gap-1 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAllBudgets(prev => prev.map(b => b.id === budget.id ? { ...b, status: 'Enviado' } : b));
                      }}
                    >
                      ▶ Marcar como enviado
                    </button>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-20 right-6 z-50">
          <Link href="/presupuestos/nuevo">
            <Button variant="fab" size="fab" aria-label="Nuevo presupuesto" className="shadow-lg shadow-primary/40">
              <Plus className="!w-6 !h-6" />
            </Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
