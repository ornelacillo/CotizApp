-- Esquema de la Base de Datos para Cotiza App (Supabase)
-- Basado en Arquitectura_Tecnica.md

-- Habilitar la extensión UUID si no está
create extension if not exists "uuid-ossp";

--------------------------------------------------------------------------------
-- 1. Tablas
--------------------------------------------------------------------------------

-- designer_profiles (Perfil del Diseñador)
create table public.designer_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  nombre text not null,
  apellido text,
  email text not null,
  experiencia text,
  estudio_nombre text,
  sitio_web text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- designer_branding (Branding del Diseñador)
create table public.designer_branding (
  id uuid default uuid_generate_v4() primary key,
  designer_id uuid references public.designer_profiles(id) on delete cascade not null unique,
  logo_path text,
  color_principal text default '#000000',
  tipografia text default 'Inter',
  redes_json jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- clients (Clientes)
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  designer_id uuid references public.designer_profiles(id) on delete cascade not null,
  nombre text not null,
  email text,
  telefono text,
  empresa text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- service_categories (Categorías Base)
create table public.service_categories (
  id uuid default uuid_generate_v4() primary key,
  nombre text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insertar categorías base
insert into public.service_categories (nombre) values 
('Branding'), ('Web'), ('Editorial'), ('Publicitario'), ('Ilustración'), ('Packaging'), ('Redes Sociales');

-- service_catalog (Catálogo de Servicios)
create table public.service_catalog (
  id uuid default uuid_generate_v4() primary key,
  designer_id uuid references public.designer_profiles(id) on delete cascade,
  category_id uuid references public.service_categories(id) on delete set null,
  nombre text not null,
  descripcion text,
  precio_base numeric,
  origen text not null check (origen in ('system', 'custom')) default 'custom',
  activo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- rate_sources (Fuentes de Tarifarios - Ej. Tarifario ADG)
create table public.rate_sources (
  id uuid default uuid_generate_v4() primary key,
  nombre_fuente text not null,
  version text,
  vigencia_desde timestamp with time zone,
  vigente boolean default true,
  imported_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- rate_reference_items (Valores de referencia del tarifario)
create table public.rate_reference_items (
  id uuid default uuid_generate_v4() primary key,
  rate_source_id uuid references public.rate_sources(id) on delete cascade not null,
  category_id uuid references public.service_categories(id) on delete set null,
  servicio_nombre text not null,
  valor_min numeric,
  valor_base numeric not null,
  valor_max numeric,
  metadata_json jsonb
);

-- rate_equivalences (Equivalencias / Mapeo)
create table public.rate_equivalences (
  id uuid default uuid_generate_v4() primary key,
  input_label text not null,
  reference_item_id uuid references public.rate_reference_items(id) on delete cascade not null,
  aprobado_por_admin boolean default false
);

-- budgets (Presupuestos)
create table public.budgets (
  id uuid default uuid_generate_v4() primary key,
  designer_id uuid references public.designer_profiles(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete set null,
  current_version_id uuid, -- se establece cuando hay una version
  estado_actual text not null default 'draft', -- draft, sent, viewed, accepted, rejected, expired
  moneda text default 'ARS',
  validez_dias integer default 15,
  expires_at timestamp with time zone,
  public_token uuid default uuid_generate_v4() unique not null,
  public_url text,
  sent_at timestamp with time zone,
  first_viewed_at timestamp with time zone,
  last_viewed_at timestamp with time zone,
  views_count integer default 0,
  downloaded_at timestamp with time zone,
  accepted_at timestamp with time zone,
  rejected_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- budget_versions (Versiones inmutables de presupuestos)
create table public.budget_versions (
  id uuid default uuid_generate_v4() primary key,
  budget_id uuid references public.budgets(id) on delete cascade not null,
  numero_version integer not null default 1,
  estado_version text not null default 'draft',
  project_type text,
  project_description text,
  project_scope text,
  urgency text,
  condiciones text,
  subtotal numeric default 0,
  total numeric default 0,
  generated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (budget_id, numero_version)
);

-- budget_items (Ítems de presupuesto asociados a una versión)
create table public.budget_items (
  id uuid default uuid_generate_v4() primary key,
  budget_version_id uuid references public.budget_versions(id) on delete cascade not null,
  service_catalog_id uuid references public.service_catalog(id) on delete set null,
  nombre text not null,
  descripcion text,
  cantidad numeric default 1,
  precio_unitario numeric default 0,
  subtotal numeric default 0,
  orden integer not null default 0
);

-- budget_views (Tracking de vistas)
create table public.budget_views (
  id uuid default uuid_generate_v4() primary key,
  budget_id uuid references public.budgets(id) on delete cascade not null,
  viewed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip_hash text,
  user_agent text,
  referrer text
);

-- budget_events (Eventos del pipeline)
create table public.budget_events (
  id uuid default uuid_generate_v4() primary key,
  budget_id uuid references public.budgets(id) on delete cascade not null,
  event_type text not null,
  event_metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Restricción post-creación de versions (circular, resolvemos en trigger o app)
alter table public.budgets 
  add constraint fk_current_version 
  foreign key (current_version_id) 
  references public.budget_versions(id) 
  on delete set null;

--------------------------------------------------------------------------------
-- 2. Triggers para updated_at automáticos
--------------------------------------------------------------------------------

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at_designer_profiles before update on public.designer_profiles for each row execute function handle_updated_at();
create trigger handle_updated_at_designer_branding before update on public.designer_branding for each row execute function handle_updated_at();
create trigger handle_updated_at_clients before update on public.clients for each row execute function handle_updated_at();
create trigger handle_updated_at_service_catalog before update on public.service_catalog for each row execute function handle_updated_at();
create trigger handle_updated_at_budgets before update on public.budgets for each row execute function handle_updated_at();

--------------------------------------------------------------------------------
-- 3. Row Level Security (RLS)
--------------------------------------------------------------------------------

-- Habilitar RLS en tablas principales
alter table public.designer_profiles enable row level security;
alter table public.designer_branding enable row level security;
alter table public.clients enable row level security;
alter table public.service_categories enable row level security;
alter table public.service_catalog enable row level security;
alter table public.budgets enable row level security;
alter table public.budget_versions enable row level security;
alter table public.budget_items enable row level security;

-- Políticas designer_profiles
create policy "Users can view own profile" 
  on designer_profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on designer_profiles for update 
  using (auth.uid() = id);

-- Políticas designer_branding
create policy "Users can view own branding" 
  on designer_branding for select 
  using (designer_id = auth.uid());

create policy "Users can insert own branding" 
  on designer_branding for insert 
  with check (designer_id = auth.uid());

create policy "Users can update own branding" 
  on designer_branding for update 
  using (designer_id = auth.uid());

create policy "Public can view branding for shared budgets"
  on designer_branding for select
  using (true); -- Permitir ver el diseño para pintar el presupuesto público

-- Políticas clients
create policy "Users can CRUD own clients" 
  on clients for all 
  using (designer_id = auth.uid());

-- Políticas service_categories
create policy "Anyone can read categories"
  on service_categories for select using (true);

-- Políticas service_catalog
create policy "Users can CRUD own services or read system services" 
  on service_catalog for all 
  using (designer_id = auth.uid() or (designer_id is null and origen = 'system'));

-- Políticas budgets
create policy "Users can CRUD own budgets" 
  on budgets for all 
  using (designer_id = auth.uid());

create policy "Public can view budget by token"
  on budgets for select
  using (true); -- La validacion del token se hara en app: /public/:token => supabase query match token

-- Políticas budget_versions
create policy "Users can CRUD own budget versions via budget relation" 
  on budget_versions for all 
  using (budget_id in (select id from budgets where designer_id = auth.uid()));

create policy "Public can view version related to a budget"
  on budget_versions for select
  using (true);

-- Políticas budget_items
create policy "Users can CRUD own budget items" 
  on budget_items for all 
  using (budget_version_id in (
    select id from budget_versions where budget_id in (
      select id from budgets where designer_id = auth.uid()
    )
  ));

create policy "Public can view budget items"
  on budget_items for select
  using (true);

--------------------------------------------------------------------------------
-- 4. Creación automática de Perfil (Trigger en auth.users)
--------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_name text;
begin
  raw_name := coalesce(new.raw_user_meta_data->>'full_name', new.email);
  insert into public.designer_profiles (id, nombre, email)
  values (new.id, raw_name, new.email);
  
  -- Insertar branding vacío
  insert into public.designer_branding (designer_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Fin del Schema
