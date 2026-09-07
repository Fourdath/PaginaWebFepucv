-- ---------------------------------------------------------------------------
-- Noticias FEPUCV. Paso opcional: cuando se quiera dejar de usar localStorage.
-- Bucket de fotos: crear en Storage un bucket publico llamado "noticias".
-- ---------------------------------------------------------------------------

create table if not exists public.noticias (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  excerpt     text not null,
  content     text not null,
  category    text not null,
  images      text[] not null default '{}',
  author      text not null,
  status      text not null default 'borrador' check (status in ('publicada','borrador')),
  featured    boolean not null default false,
  published_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists noticias_status_idx on public.noticias (status, created_at desc);

-- Solo una destacada a la vez
create unique index if not exists noticias_una_destacada
  on public.noticias (featured) where featured;

alter table public.noticias enable row level security;

-- Lectura publica: solo lo publicado
create policy "noticias publicas legibles"
  on public.noticias for select
  using (status = 'publicada');

-- Escritura: solo usuarios autenticados (la mesa). Esta es la barrera real de
-- seguridad; la clave del formulario es solo disuasiva.
create policy "mesa escribe noticias"
  on public.noticias for all
  to authenticated
  using (true) with check (true);

-- Storage: lectura publica del bucket, escritura autenticada
-- (ejecutar despues de crear el bucket "noticias")
create policy "fotos noticias lectura" on storage.objects for select
  using (bucket_id = 'noticias');
create policy "fotos noticias escritura" on storage.objects for insert
  to authenticated with check (bucket_id = 'noticias');
