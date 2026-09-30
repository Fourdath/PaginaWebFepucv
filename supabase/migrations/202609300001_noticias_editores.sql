-- Solo los usuarios autorizados en noticias_editors pueden modificar noticias.
-- El administrador agrega el user_id desde el SQL Editor tras crear la cuenta
-- en Authentication > Users. Esta tabla no es accesible desde el navegador.
begin;

create table if not exists public.noticias_editors (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.noticias_editors enable row level security;
revoke all on public.noticias_editors from public, anon, authenticated;

create schema if not exists fepucv_private;
revoke all on schema fepucv_private from public;
grant usage on schema fepucv_private to authenticated;

create or replace function fepucv_private.is_news_editor()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.noticias_editors e
    where e.user_id = (select auth.uid())
  );
$$;
revoke all on function fepucv_private.is_news_editor() from public, anon, authenticated;
grant execute on function fepucv_private.is_news_editor() to authenticated;

-- El RPC solo devuelve si la sesión actual puede editar; no expone la lista.
create or replace function public.news_editor_status()
returns boolean language sql stable security invoker set search_path = ''
as $$ select fepucv_private.is_news_editor(); $$;
revoke all on function public.news_editor_status() from public, anon, authenticated;
grant execute on function public.news_editor_status() to authenticated;

drop policy if exists "mesa escribe noticias" on public.noticias;
drop policy if exists "mesa lee noticias" on public.noticias;
drop policy if exists "mesa inserta noticias" on public.noticias;
drop policy if exists "mesa actualiza noticias" on public.noticias;
drop policy if exists "mesa elimina noticias" on public.noticias;
create policy "mesa lee noticias" on public.noticias for select
  to authenticated using ((select fepucv_private.is_news_editor()));
create policy "mesa inserta noticias" on public.noticias for insert
  to authenticated with check ((select fepucv_private.is_news_editor()));
create policy "mesa actualiza noticias" on public.noticias for update
  to authenticated using ((select fepucv_private.is_news_editor()))
  with check ((select fepucv_private.is_news_editor()));
create policy "mesa elimina noticias" on public.noticias for delete
  to authenticated using ((select fepucv_private.is_news_editor()));

drop policy if exists "fotos noticias escritura" on storage.objects;
create policy "fotos noticias escritura" on storage.objects for insert
  to authenticated with check (bucket_id = 'noticias' and (select fepucv_private.is_news_editor()));

commit;
