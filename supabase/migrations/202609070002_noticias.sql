-- ---------------------------------------------------------------------------
-- Noticias FEPUCV compartidas entre navegadores.
-- ---------------------------------------------------------------------------

begin;

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

grant select on public.noticias to anon;
grant select, insert, update, delete on public.noticias to authenticated;

-- Lectura publica: solo lo publicado
drop policy if exists "noticias publicas legibles" on public.noticias;
create policy "noticias publicas legibles"
  on public.noticias for select
  using (status = 'publicada');

-- Escritura: usuarios autenticados en este proyecto.
drop policy if exists "mesa escribe noticias" on public.noticias;
create policy "mesa escribe noticias"
  on public.noticias for all
  to authenticated
  using (true) with check (true);

-- Storage: lectura publica del bucket, escritura autenticada
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('noticias', 'noticias', true, 8388608, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;
drop policy if exists "fotos noticias lectura" on storage.objects;
create policy "fotos noticias lectura" on storage.objects for select
  using (bucket_id = 'noticias');
drop policy if exists "fotos noticias escritura" on storage.objects;
create policy "fotos noticias escritura" on storage.objects for insert
  to authenticated with check (bucket_id = 'noticias');

commit;
