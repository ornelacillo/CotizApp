'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setLoading(false);

    if (error) {
      if (error.message.includes('Email not confirmed') || error.message.includes('not verified')) {
        setError('Por favor, verificá tu correo electrónico antes de iniciar sesión. Revisá tu bandeja de entrada o spam.');
      } else {
        setError(error.message === 'Invalid login credentials' ? 'Credenciales incorrectas' : error.message);
      }
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center w-full p-4 sm:p-6">
      <div className="w-full max-w-[450px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_8px_24px_rgba(74,53,233,0.25)] mb-6">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight mb-2 text-foreground">
            Iniciar sesión
          </h1>
          <p className="text-base text-muted-foreground">
            Ingresá a tu cuenta para gestionar tus presupuestos.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                type="email" 
                placeholder="Correo electrónico" 
                className="pl-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Contraseña" 
                className="pl-12 pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="text-right">
              <Link href="#" className="text-sm font-semibold text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-10 text-center text-sm text-muted-foreground">
          ¿No tenés una cuenta?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Registrate acá
          </Link>
        </p>
      </div>
    </div>
  );
}
