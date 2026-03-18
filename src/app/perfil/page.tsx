'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Mail, Phone, MapPin, Building2, User, Save, Upload, Plus, Trash2, Globe, LogOut, Moon, Sun, Monitor, Bell, ChevronRight, X, Edit2, Instagram, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function PerfilPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    subtitle: '',
    email: '',
    website: '',
    instagram: '',
    primaryColor: '#6B5CFF',
    fontFamily: 'Inter',
    logo: ''
  });

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch Profile
    const { data: profile, error: profileError } = await supabase
      .from('designer_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Fetch Branding
    const { data: branding, error: brandingError } = await supabase
      .from('designer_branding')
      .select('*')
      .eq('designer_id', user.id)
      .single();

    if (!profileError && profile) {
      setProfileData(prev => ({
        ...prev,
        name: profile.nombre || '',
        subtitle: profile.estudio_nombre || '',
        email: profile.email || '',
        website: profile.sitio_web || '',
      }));
    }

    if (!brandingError && branding) {
      setProfileData(prev => ({
        ...prev,
        primaryColor: branding.color_principal || '#6B5CFF',
        fontFamily: branding.tipografia || 'Inter',
        instagram: (branding.redes_json as any)?.instagram || '',
        logo: branding.logo_path || ''
      }));
      setProfileImage(branding.logo_path || null);
    }
    
    setIsLoading(false);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update Profile
    const { error: profileError } = await supabase
      .from('designer_profiles')
      .update({
        nombre: profileData.name,
        estudio_nombre: profileData.subtitle,
        email: profileData.email,
        sitio_web: profileData.website,
      })
      .eq('id', user.id);

    // Update Branding
    const { error: brandingError } = await supabase
      .from('designer_branding')
      .update({
        color_principal: profileData.primaryColor,
        tipografia: profileData.fontFamily,
        redes_json: { instagram: profileData.instagram },
        logo_path: profileImage
      })
      .eq('designer_id', user.id);

    if (profileError || brandingError) {
      toast.error("Error al guardar cambios");
    } else {
      toast.success("Perfil actualizado");
      setIsEditingInfo(false);
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isDark = theme === 'dark';

  const handleAction = (action: string) => {
    if (action === 'Foto de perfil') {
      fileInputRef.current?.click();
      return;
    }
  };

  return (
    <PageWrapper
      headerProps={{
        title: "Perfil del Estudio",
        showProfile: false,
        showNotifications: true,
      }}
    >
      <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
        
        {/* Profile Header */}
        <div className="flex flex-col pt-2 pb-4 space-y-3">
          <div className="relative mx-auto">
            <Avatar className="h-24 w-24 ring-4 ring-card shadow-xl">
              <AvatarImage src={profileImage || ""} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">ME</AvatarFallback>
            </Avatar>
            <button 
              aria-label="Editar perfil" 
              onClick={() => handleAction('Foto de perfil')}
              className="absolute bottom-0 right-0 h-8 w-8 bg-card rounded-full border border-border shadow flex items-center justify-center text-foreground hover:text-primary transition-colors hover:scale-105 active:scale-95 z-10"
            >
              <Edit2 className="h-4 w-4 pointer-events-none" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setProfileImage(base64String);
                    setProfileData(prev => ({ ...prev, logo: base64String }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div className="text-center w-full">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : isEditingInfo ? (
              <div style={{ width: '100%', maxWidth: '24rem', margin: '0 auto', padding: '0.5rem 1rem' }}>
                <input 
                  type="text"
                  style={{ display: 'block', width: '100%', height: '48px', borderRadius: '14px', border: '1px solid var(--border)', backgroundColor: 'var(--muted)', padding: '8px 16px', fontSize: '16px', fontWeight: 600, textAlign: 'center', color: 'var(--foreground)', outline: 'none', marginBottom: '12px' }}
                  placeholder="Nombre del estudio"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                />
                <input 
                  type="text"
                  style={{ display: 'block', width: '100%', height: '48px', borderRadius: '14px', border: '1px solid var(--border)', backgroundColor: 'var(--muted)', padding: '8px 16px', fontSize: '14px', textAlign: 'center', color: 'var(--foreground)', outline: 'none' }}
                  placeholder="Especialidad (ej: Diseño Gráfico & UI/UX)"
                  value={profileData.subtitle}
                  onChange={(e) => setProfileData({...profileData, subtitle: e.target.value})}
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold tracking-tight text-foreground">{profileData.name}</h2>
                <p className="text-sm font-medium text-muted-foreground">{profileData.subtitle}</p>
              </>
            )}
          </div>
        </div>

        {/* Studio Info Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Información Pública</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-primary font-semibold hover:bg-primary/10"
              disabled={isSaving}
              onClick={() => {
                if (isEditingInfo) {
                  handleSaveProfile();
                } else {
                  setIsEditingInfo(true);
                }
              }}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isEditingInfo ? 'Guardar' : 'Editar'}
            </Button>
          </div>
          <Card className="divide-y divide-border/50 p-0 overflow-hidden">
            <div className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Correo Electrónico</p>
                  {isEditingInfo ? (
                    <Input 
                      className="h-7 mt-1 text-xs px-2" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  ) : (
                    <p className="text-xs text-muted-foreground">{profileData.email}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sitio Web</p>
                  {isEditingInfo ? (
                    <Input 
                      className="h-7 mt-1 text-xs px-2" 
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    />
                  ) : (
                    <p className="text-xs text-muted-foreground">{profileData.website}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col justify-center hover:bg-muted/10 transition-colors">
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0">
                  <Instagram className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Instagram</p>
                  {isEditingInfo ? (
                    <Input 
                      className="h-7 mt-1 text-xs px-2" 
                      value={profileData.instagram}
                      onChange={(e) => setProfileData({...profileData, instagram: e.target.value})}
                    />
                  ) : (
                    <p className="text-xs text-muted-foreground">{profileData.instagram}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Branding Settings inside Public Info list */}
            <div className="p-4 flex flex-col justify-center hover:bg-muted/10 transition-colors">
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-full border shadow-sm shrink-0" style={{ backgroundColor: profileData.primaryColor }}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Color de Marca</p>
                  {isEditingInfo ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="color" 
                        className="h-7 w-12 cursor-pointer rounded bg-transparent border-0 p-0" 
                        value={profileData.primaryColor}
                        onChange={(e) => setProfileData({...profileData, primaryColor: e.target.value})}
                      />
                      <span className="text-xs text-muted-foreground uppercase">{profileData.primaryColor}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground uppercase">{profileData.primaryColor}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col justify-center hover:bg-muted/10 transition-colors">
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1">
                  <p className="text-sm font-medium">Tipografía Principal</p>
                  {isEditingInfo ? (
                    <div className="mt-1">
                      <Select 
                        value={profileData.fontFamily || ""} 
                        onValueChange={(val) => setProfileData({...profileData, fontFamily: val || ""})}
                      >
                        <SelectTrigger className="h-8 text-xs border-input bg-transparent w-full">
                          <SelectValue placeholder="Seleccionar tipografía..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter (Sans-serif moderno)</SelectItem>
                          <SelectItem value="ui-serif, Georgia, serif">Playfair (Serif elegante)</SelectItem>
                          <SelectItem value="ui-monospace, monospace">Mono (Técnico)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground truncate" style={{ fontFamily: profileData.fontFamily }}>
                      {profileData.fontFamily.split(',')[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Configuration Section */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase px-2">Configuración</h3>
          <Card className="divide-y divide-border/50 p-0">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/10 transition-colors"
              onClick={() => {
                if (mounted) {
                  setTheme(isDark ? 'light' : 'dark');
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-foreground">
                  <Moon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium">Modo Oscuro</p>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${mounted && isDark ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${mounted && isDark ? 'translate-x-5' : 'translate-x-0.5 bg-foreground/20'}`}></div>
              </div>
            </div>

            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/10 transition-colors"
              onClick={() => {
                const newState = !notifications;
                setNotifications(newState);
                alert(newState ? "Notificaciones Push activadas." : "Notificaciones Push desactivadas.");
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-foreground">
                  <Bell className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium">Notificaciones Push</p>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${notifications ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0.5 bg-foreground/20'}`}></div>
              </div>
            </div>
          </Card>
        </section>

        {/* Tariffs Admin Action */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Gestión de Catálogo</h2>
          <Card className="p-6 border-border/50 hover:border-primary/30 transition-colors shadow-sm cursor-pointer group" onClick={() => router.push('/admin/tarifarios')}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors">Administrar Tarifario</h3>
                <p className="text-sm text-muted-foreground">Agrega, edita o elimina servicios y precios base.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Card>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4 pt-4 border-t border-border/30">
          <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-2 h-14 rounded-2xl" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </Button>
        </section>

      </div>
    </PageWrapper>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50 h-5 w-5">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
