-- Run after the migration. All test rows are rolled back.
begin;
do $$
declare first_id uuid := gen_random_uuid(); n integer;
begin
  perform public.copa_submit(first_id, 'Cóndor Audaz 901', 1,
    '[{"player":2,"cpu":0},{"player":2,"cpu":0},{"player":2,"cpu":0},{"player":2,"cpu":0},{"player":2,"cpu":0}]');
  if (select score from public.copa_records where nickname_key = 'cóndor audaz 901') <> 11750 then
    raise exception 'Incorrect cup score';
  end if;
  perform public.copa_submit(first_id, 'Puma Veloz 902', 1,
    '[{"player":2,"cpu":0},{"player":2,"cpu":0},{"player":2,"cpu":0},{"player":2,"cpu":0},{"player":2,"cpu":0}]');
  if exists(select 1 from public.copa_records where nickname_key = 'puma veloz 902') then
    raise exception 'Duplicate run accepted';
  end if;
  perform public.copa_submit(gen_random_uuid(), 'Cóndor Audaz 901', 2,
    '[{"player":1,"cpu":0},{"player":0,"cpu":1},{"player":0,"cpu":1},{"player":0,"cpu":1}]');
  if (select score from public.copa_records where nickname_key = 'cóndor audaz 901') <> 11750 then
    raise exception 'Lower score overwrote personal best';
  end if;
  begin
    perform public.copa_submit(gen_random_uuid(), 'Zorro Noble 903', 1, '[{"player":1,"cpu":0}]');
    raise exception 'Unfinished campaign accepted';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.copa_submit(gen_random_uuid(), 'León Ágil 904', 1, '[{"player":-1,"cpu":0}]');
    raise exception 'Negative score accepted';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.copa_submit(gen_random_uuid(), 'Texto no permitido', 1,
      '[{"player":1,"cpu":0},{"player":0,"cpu":1},{"player":0,"cpu":1},{"player":0,"cpu":1}]');
    raise exception 'Free-form nickname accepted';
  exception when invalid_parameter_value then null;
  end;
  select count(*) into n from public.copa_top3();
  if n > 3 then raise exception 'Podium exceeds three places'; end if;
  if has_table_privilege('anon', 'public.copa_records', 'INSERT')
    or has_table_privilege('anon', 'public.copa_records', 'SELECT')
    or has_table_privilege('anon', 'public.copa_submissions', 'SELECT') then
    raise exception 'Anonymous table access must be denied';
  end if;
  if not has_function_privilege('anon', 'public.copa_top3()', 'EXECUTE')
    or not has_function_privilege('anon', 'public.copa_submit(uuid,text,integer,jsonb)', 'EXECUTE') then
    raise exception 'Anonymous RPC access missing';
  end if;
end $$;
select 'Copa FEPUCV: all database checks passed' as result;
rollback;

