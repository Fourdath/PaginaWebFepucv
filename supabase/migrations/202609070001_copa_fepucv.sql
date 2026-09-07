begin;

-- Only nicknames, game results and timestamps; no account or contact data.
create table if not exists public.copa_records (
  nickname_key text primary key,
  nickname text not null,
  score integer not null check (score between 1 and 30750),
  character_id integer not null check (character_id between 1 and 6),
  wins integer not null check (wins between 1 and 5),
  created_at timestamptz not null default now()
);
create table if not exists public.copa_submissions (
  run_id uuid primary key,
  created_at timestamptz not null default now()
);
alter table public.copa_records enable row level security;
alter table public.copa_submissions enable row level security;
revoke all on public.copa_records, public.copa_submissions from public, anon, authenticated;

-- Definer is necessary because callers cannot read or write the base tables.
create or replace function public.copa_top3()
returns table(nickname text, score integer, character_id integer, wins integer, created_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select r.nickname, r.score, r.character_id, r.wins, r.created_at
  from public.copa_records r
  order by r.score desc, r.wins desc, r.created_at asc, r.nickname_key asc limit 3;
$$;

create or replace function public.copa_submit(p_run_id uuid, p_nickname text, p_character_id integer, p_results jsonb)
returns void language plpgsql security definer set search_path = ''
as $$
declare
  clean_name text := regexp_replace(btrim(p_nickname), '\s+', ' ', 'g');
  result jsonb;
  goals integer;
  conceded integer;
  stage integer := 0;
  lives integer := 3;
  points integer := 0;
  inserted integer;
begin
  if p_run_id is null or clean_name is null
    or clean_name !~ '^(Cóndor|Puma|Zorro|Halcón|Lince|León|Delfín|Pingüino|Búho|Jaguar) (Audaz|Veloz|Noble|Valiente|Brillante|Ágil|Tenaz|Invicto|Leal|Estelar) [1-9][0-9]{2}$'
    or p_character_id is null or p_character_id not between 1 and 6
    or p_results is null or jsonb_typeof(p_results) <> 'array' then
    raise exception 'Invalid submission' using errcode = '22023';
  end if;
  if jsonb_array_length(p_results) not between 1 and 7 then
    raise exception 'Invalid campaign length' using errcode = '22023';
  end if;
  for result in select value from jsonb_array_elements(p_results) loop
    if stage = 5 or lives = 0 or jsonb_typeof(result) <> 'object'
      or not (result ? 'player' and result ? 'cpu')
      or jsonb_typeof(result->'player') <> 'number' or jsonb_typeof(result->'cpu') <> 'number'
      or (result->>'player') !~ '^[0-9]{1,2}$' or (result->>'cpu') !~ '^[0-9]{1,2}$' then
      raise exception 'Invalid match' using errcode = '22023';
    end if;
    goals := (result->>'player')::integer;
    conceded := (result->>'cpu')::integer;
    if goals not between 0 and 40 or conceded not between 0 and 40 then
      raise exception 'Invalid goals' using errcode = '22023';
    end if;
    if goals > conceded then
      stage := stage + 1;
      points := points + goals * 100 + stage * 500 + case when conceded = 0 then 250 else 0 end;
    else
      lives := lives - 1;
    end if;
  end loop;
  if stage <> 5 and lives <> 0 then
    raise exception 'Campaign must be finished' using errcode = '22023';
  end if;
  if stage = 5 then points := points + 2000; end if;
  if points = 0 then raise exception 'No scoring victories' using errcode = '22023'; end if;
  -- A run can be submitted once; retries after network failure are harmless.
  insert into public.copa_submissions(run_id) values(p_run_id) on conflict do nothing;
  get diagnostics inserted = row_count;
  if inserted = 0 then return; end if;
  insert into public.copa_records(nickname_key, nickname, score, character_id, wins)
    values(lower(clean_name), clean_name, points, p_character_id, stage)
  on conflict (nickname_key) do update
    set nickname = excluded.nickname, score = excluded.score, character_id = excluded.character_id,
        wins = excluded.wins, created_at = now()
    where excluded.score > public.copa_records.score
       or (excluded.score = public.copa_records.score and excluded.wins > public.copa_records.wins);
end;
$$;
revoke all on function public.copa_top3() from public, anon, authenticated;
revoke all on function public.copa_submit(uuid, text, integer, jsonb) from public, anon, authenticated;
grant execute on function public.copa_top3() to anon, authenticated;
grant execute on function public.copa_submit(uuid, text, integer, jsonb) to anon, authenticated;
commit;
