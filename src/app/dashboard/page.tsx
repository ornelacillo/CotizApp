'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Eye, CheckCircle, XCircle, Plus, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Mock Data
const metrics = [
  { id: 'enviados', label: 'Enviados', value: '12', icon: Send, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 'vistos', label: 'Vistos', value: '8', icon: Eye, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
  { id: 'aceptados', label: 'Aceptados', value: '4', icon: CheckCircle, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
  { id: 'rechazados', label: 'Rechazados', value: '1', icon: XCircle, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
];

const initialRecentBudgets = [
  {
    id: '1',
    folio: 'COT-001',
    client: 'Acme Corp',
    clientInitial: 'A',
    amount: '$145,000',
    date: '12 Mar 2026',
    status: 'Enviado',
    statusColor: 'text-primary bg-primary/10 border-primary/20',
  },
  {
    id: '2',
    folio: 'COT-002',
    client: 'TechStart Inc.',
    clientInitial: 'T',
    amount: '$85,500',
    date: '10 Mar 2026',
    status: 'Aceptado',
    statusColor: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20',
  },
  {
    id: '3',
    folio: 'COT-003',
    client: 'Juan Pérez',
    clientInitial: 'J',
    amount: '$32,000',
    date: '05 Mar 2026',
    status: 'Visto',
    statusColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [recentBudgets, setRecentBudgets] = useState(initialRecentBudgets);

  useEffect(() => {
    const draftsString = localStorage.getItem('cotiza_drafts');
    if (draftsString) {
      try {
        const drafts = JSON.parse(draftsString);
        if (Array.isArray(drafts) && drafts.length > 0) {
          setRecentBudgets(prev => {
            const draftsCount = drafts.length;
            const updated = [...drafts, ...prev].slice(0, Math.max(3, draftsCount));
            // Remove duplicates by ID just in case
            const unique = updated.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i);
            return unique;
          });
        }
      } catch (e) {
        console.error('Error parsing drafts:', e);
      }
    }
  }, []);

  const handleDeleteBudget = (id: string, clientName: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el presupuesto de ${clientName}?`)) {
      setRecentBudgets(prev => prev.filter(budget => budget.id !== id));
    }
  };

  return (
    <PageWrapper
      headerProps={{
        title: "CotizApp",
        showNotifications: true,
        showProfile: true,
      }}
    >
      <div className="p-4 md:p-6 space-y-8 animate-in fade-in duration-500 relative">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.id} className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className={cn("p-2 rounded-xl", metric.bg)}>
                  <metric.icon className={cn("w-5 h-5", metric.color)} />
                </div>
                <span className="text-2xl font-bold tracking-tight">{metric.value}</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold tracking-tight">Presupuestos recientes</h2>
            <Link href="/presupuestos" className="text-sm font-medium text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          
          <div className="grid gap-3">
            {recentBudgets.map((budget) => (
              <Card 
                key={budget.id} 
                className="p-4 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-border/50"
                onClick={() => {
                  if (budget.status === 'Borrador' || budget.id.toString().startsWith('draft-')) {
                    router.push(`/presupuestos/nuevo?edit=${budget.id}&client=${encodeURIComponent(budget.client)}&amount=${encodeURIComponent(budget.amount.replace(/[^0-9]/g, ''))}`);
                  } else {
                    router.push(`/presupuestos/${budget.id}`);
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-border/50">
                  <AvatarFallback className="bg-background text-foreground font-semibold">
                    {budget.clientInitial}
                  </AvatarFallback>
                </Avatar>
                </div>
                
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

                <div className="flex flex-col items-center gap-2 mt-2 h-full justify-center w-full" onClick={(e) => e.stopPropagation()}>
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
                  <span className={cn(
                    "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                    budget.statusColor
                  )}>
                    {budget.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
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
