'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();

  const getURL = () => {
    // If we're on a known production domain, use it.
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'cotizapp.xyz') {
        return 'https://cotizapp.xyz/';
      }
      return window.location.origin + '/';
    }
    
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? 
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 
      'http://localhost:3000/';
    
    url = url.includes('http') ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const supabase = createClient();
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getURL()}auth/callback`,
        data: {
          full_name: name,
        }
      }
    });
    
    setLoading(false);

    if (error) {
      if (error.message.includes('rate limit')) {
        setError('Excediste el límite de intentos. Por favor, esperá un rato antes de volver a intentar.');
      } else if (error.message.includes('already registered')) {
        setError('El correo electrónico ya está registrado.');
      } else {
        setError(error.message);
      }
    } else {
      setIsSuccess(true);
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
            Crear cuenta
          </h1>
          <p className="text-base text-muted-foreground">
            El primer paso para simplificar tus presupuestos.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4 bg-muted/30 p-6 rounded-xl border border-border mt-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">¡Cuenta creada con éxito!</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Te enviamos un correo a <span className="font-medium text-foreground">{email}</span>. 
              Por favor revisá tu bandeja de entrada o carpeta de spam y hacé clic en el enlace para verificar tu cuenta y poder iniciar sesión.
            </p>
            <Button className="w-full mt-4" onClick={() => router.push('/login')}>
              Ir a iniciar sesión
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                type="text" 
                placeholder="Nombre completo" 
                className="pl-12"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
            
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>
        )}

        {/* Footer */}
        <p className="mt-10 text-center text-sm text-muted-foreground">
          ¿Ya tenés una cuenta?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Iniciá sesión acá
          </Link>
        </p>
      </div>
    </div>
  );
}
