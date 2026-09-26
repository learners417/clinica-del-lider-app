-- LA CLÍNICA DEL LÍDER · v1.3 · la línea de la semana, el consentimiento y lo nuevo que ve el equipo
-- Correr DESPUÉS de 0001 y 0002. Se puede correr más de una vez sin romper nada.

-- ── La línea de la semana: la escribe el equipo, el paciente la lee en Hoy ──
create table if not exists public.lineas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references auth.users(id) on delete cascade,
  texto text not null check (char_length(texto) between 3 and 280),
  autor uuid references auth.users(id),
  creado_en timestamptz not null default now()
);

create index if not exists lineas_paciente on public.lineas (paciente_id, creado_en desc);

alter table public.lineas enable row level security;

drop policy if exists "paciente lee sus lineas" on public.lineas;
create policy "paciente lee sus lineas" on public.lineas for select using (auth.uid() = paciente_id);

drop policy if exists "equipo gestiona lineas" on public.lineas;
create policy "equipo gestiona lineas" on public.lineas for all
  using (public.es_equipo()) with check (public.es_equipo());

-- ── Lo que ve el equipo del camino del paciente ──
-- Se suman el consentimiento, los días de Descarga (el texto nunca se guarda) y las dos columnas.
-- El testimonio solo si el paciente eligió compartirlo. El Mensaje del día 84 y los informes, nunca.
drop policy if exists "equipo lee lo clinico" on public.estado_paciente;
create policy "equipo lee lo clinico" on public.estado_paciente for select using (
  public.es_equipo() and (
    clave in (
      'cdl_nombre', 'cdl_chequeos', 'cdl_diario', 'cdl_protocolo', 'cdl_apaga',
      'cdl_iceberg', 'cdl_sesiones', 'cdl_jugadas',
      'cdl_consentimiento', 'cdl_descargas', 'cdl_columnas'
    )
    or (clave = 'cdl_testimonio' and coalesce((valor->>'compartido')::boolean, false))
  )
);
