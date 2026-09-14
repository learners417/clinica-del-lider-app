-- LA CLÍNICA DEL LÍDER · accesos y roles (proyecto NUEVO — nunca el de TCD)
create table if not exists public.accesos (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  tier text not null check (tier in ('apaga', 'solo', 'acompanado')),
  rol text not null default 'paciente' check (rol in ('paciente', 'equipo', 'admin')),
  fecha_inicio date not null default current_date,
  creado_en timestamptz not null default now()
);

alter table public.accesos enable row level security;

-- función segura para saber si el que llama es admin (evita recursión de RLS)
create or replace function public.es_admin() returns boolean
language sql security definer stable as $$
  select exists (select 1 from public.accesos where user_id = auth.uid() and rol = 'admin');
$$;

drop policy if exists "leer mi acceso" on public.accesos;
create policy "leer mi acceso" on public.accesos for select using (auth.uid() = user_id or public.es_admin());
drop policy if exists "admin gestiona" on public.accesos;
create policy "admin gestiona" on public.accesos for all using (public.es_admin()) with check (public.es_admin());
