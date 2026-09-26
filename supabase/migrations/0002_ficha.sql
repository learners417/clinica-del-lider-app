-- LA CLÍNICA DEL LÍDER · fase 2B · el camino del paciente en la nube + la ficha del terapeuta
-- Correr DESPUÉS de 0001_accesos.sql. Se puede correr más de una vez sin romper nada.

-- ¿El que llama es del equipo (equipo o admin)?
create or replace function public.es_equipo() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.accesos where user_id = auth.uid() and rol in ('equipo', 'admin'));
$$;

-- El equipo necesita ver la lista de pacientes para abrir su ficha.
drop policy if exists "equipo lee accesos" on public.accesos;
create policy "equipo lee accesos" on public.accesos for select using (public.es_equipo());

-- ── El estado del paciente: una fila por cada parte de su camino ──
-- Espeja las claves que la app guarda en el teléfono (cdl_chequeos, cdl_iceberg…).
create table if not exists public.estado_paciente (
  user_id uuid not null references auth.users(id) on delete cascade,
  clave text not null check (clave like 'cdl\_%'),
  valor jsonb not null,
  actualizado timestamptz not null default now(),
  primary key (user_id, clave)
);

alter table public.estado_paciente enable row level security;

-- El paciente lee y escribe solo lo suyo.
drop policy if exists "paciente lo suyo" on public.estado_paciente;
create policy "paciente lo suyo" on public.estado_paciente for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- El equipo lee solo lo clínico. El Mensaje al Día 84 y el resto quedan para el paciente.
drop policy if exists "equipo lee lo clinico" on public.estado_paciente;
create policy "equipo lee lo clinico" on public.estado_paciente for select using (
  public.es_equipo() and clave in (
    'cdl_nombre', 'cdl_chequeos', 'cdl_diario', 'cdl_protocolo', 'cdl_apaga',
    'cdl_iceberg', 'cdl_sesiones', 'cdl_jugadas'
  )
);

-- ── La barandilla: cuándo se habló una derivación del Chequeo ──
create table if not exists public.barandilla (
  paciente_id uuid not null references auth.users(id) on delete cascade,
  chequeo_fecha text not null,              -- la fecha ISO del Chequeo que marcó derivación
  hablada_en timestamptz not null default now(),
  hablada_por uuid references auth.users(id),
  nota text not null default '',
  primary key (paciente_id, chequeo_fecha)
);

alter table public.barandilla enable row level security;

drop policy if exists "equipo gestiona barandilla" on public.barandilla;
create policy "equipo gestiona barandilla" on public.barandilla for all
  using (public.es_equipo()) with check (public.es_equipo());
