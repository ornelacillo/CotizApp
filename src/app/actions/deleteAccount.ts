'use server';

import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function deleteAccount() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No estás autenticado');
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Servidor mal configurado. Faltan credenciales de administrador.');
  }

  // To delete a user from auth.users, we MUST use the Service Role Key
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("Error al eliminar cuenta:", error);
    throw new Error('Hubo un error al eliminar tu cuenta. Intentá nuevamente.');
  }

  // Eliminar sesión
  await supabase.auth.signOut();
}
