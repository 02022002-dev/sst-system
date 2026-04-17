alter table public.inspections
add column if not exists archived_at timestamptz;

create index if not exists inspections_archived_at_idx
  on public.inspections (archived_at);
