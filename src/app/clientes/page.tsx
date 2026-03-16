'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Mail, Phone, ExternalLink, StickyNote } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const initialClients = [
  { id: 1, name: 'Acme Corp', contact: 'María González', email: 'maria@acme.com', phone: '+5491112345678', initial: 'A', notes: 'Cliente prioritario. Prefiere reuniones por la mañana.' },
  { id: 2, name: 'TechStart Inc.', contact: 'Juan Pérez', email: 'juan@techstart.com', phone: '+5491123456789', initial: 'T', notes: 'Proyecto de re-branding en pausa hasta mayo.' },
  { id: 3, name: 'Estudio Creativo', contact: 'Ana Silva', email: 'ana@estudioc.com', phone: '+5491134567890', initial: 'E', notes: '' },
  { id: 4, name: 'Global Logistics', contact: 'Carlos Ruiz', email: 'cruiz@global.com', phone: '+5491145678901', initial: 'G', notes: '' },
];

export default function ClientesPage() {
  const [clients, setClients] = useState(initialClients);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedClients = localStorage.getItem('cotiza_clients');
    if (savedClients) { 
      try {
        setClients(JSON.parse(savedClients));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  const handleNoteChange = (id: number, newNote: string) => {
    const updated = clients.map(c => c.id === id ? { ...c, notes: newNote } : c);
    setClients(updated);
    localStorage.setItem('cotiza_clients', JSON.stringify(updated));
  };

  return (
    <PageWrapper
      headerProps={{
        title: "Clientes",
        showProfile: true,
        showNotifications: false,
      }}
    >
      <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
        
        {/* Search */}
        <div className="sticky top-[64px] z-30 bg-background/95 backdrop-blur py-2 -mx-4 px-4 md:-mx-6 md:px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Buscar por nombre o empresa..." 
              className="pl-9 h-12 bg-card border-none"
            />
          </div>
        </div>

        {/* Clients List */}
        <div className="grid gap-3">
          {clients.map((client) => (
            <Card key={client.id} className="p-4 flex flex-col gap-3">
              <Sheet>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border/50">
                    <AvatarFallback className="bg-muted text-foreground font-semibold">
                      {client.initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-[15px]">{client.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{client.contact}</p>
                  </div>
                  <SheetTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 text-muted-foreground hover:bg-accent hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <ExternalLink className="h-4 w-4" />
                  </SheetTrigger>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-2 border-t border-border/50">
                  <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors" onClick={(e) => e.stopPropagation()}>
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[120px]">{client.email}</span>
                  </a>
                  <a href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors" onClick={(e) => e.stopPropagation()}>
                    <Phone className="h-3.5 w-3.5" />
                    <span>Contactar</span>
                  </a>
                </div>

                {/* Client Details Drawer */}
                <SheetContent side="bottom" className="h-[80vh] sm:h-auto sm:max-h-[85vh] rounded-t-xl sm:border-l sm:rounded-l-xl sm:rounded-t-none">
                  <SheetHeader className="text-left space-y-4 pb-4 border-b">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-border/50 shadow-sm">
                        <AvatarFallback className="bg-muted text-foreground font-semibold text-xl">
                          {client.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <SheetTitle className="text-2xl font-bold">{client.name}</SheetTitle>
                        <p className="text-muted-foreground font-medium">{client.contact}</p>
                      </div>
                    </div>
                  </SheetHeader>
                  
                  <div className="py-6 space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Información de Contacto</h4>
                      
                      <div className="grid gap-3">
                        <a href={`mailto:${client.email}`} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors group">
                          <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Mail className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Correo Electrónico</p>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          </div>
                        </a>
                        
                        <a href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 hover:border-[#25D366]/50 transition-colors group">
                          <div className="p-2 rounded-md bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                            <Phone className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">WhatsApp</p>
                            <p className="text-sm text-muted-foreground">{client.phone}</p>
                          </div>
                        </a>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <StickyNote className="h-4 w-4" /> Notas del Cliente
                      </h4>
                      <Textarea 
                        placeholder="Escribí acá las notas importantes, acuerdos, o detalles a recordar sobre este cliente..."
                        className="min-h-[120px] bg-card resize-none border-border/50 focus-visible:ring-primary/20"
                        value={client.notes}
                        onChange={(e) => handleNoteChange(client.id, e.target.value)}
                      />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </Card>
          ))}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-20 right-6 z-50">
          <Button variant="fab" size="fab" className="shadow-lg shadow-primary/40">
            <Plus className="!w-6 !h-6" />
          </Button>
        </div>

      </div>
    </PageWrapper>
  );
}
