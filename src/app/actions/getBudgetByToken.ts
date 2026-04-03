'use server';

import { createClient } from '@supabase/supabase-js';

export async function getBudgetByToken(token: string) {
  if (!token) throw new Error("Token missing");

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Servidor mal configurado. Faltan credenciales de lectura.');
  }

  // Usamos el Admin Client para bypasear el RLS.
  // Esto es vital ya que vamos a eliminar el RLS público de budgets.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  const { data, error } = await supabaseAdmin
    .from('budgets')
    .select(`
      *,
      clients (*),
      designer_profiles (*),
      budget_versions (
        *,
        budget_items (*)
      )
    `)
    .eq('public_token', token)
    .single();

  if (error || !data) {
    throw new Error('Presupuesto no encontrado');
  }

  // Obtener branding del diseñador
  const { data: brandingData } = await supabaseAdmin
    .from('designer_branding')
    .select('*')
    .eq('designer_id', data.designer_id)
    .single();

  return { budget: data, branding: brandingData };
}
