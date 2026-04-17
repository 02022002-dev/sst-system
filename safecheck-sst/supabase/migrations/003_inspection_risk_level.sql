alter table public.inspections
add column if not exists risk_level text not null default 'baixo';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'inspections_risk_level_check'
  ) then
    alter table public.inspections
    add constraint inspections_risk_level_check
      check (risk_level in ('baixo', 'medio', 'alto'));
  end if;
end $$;
