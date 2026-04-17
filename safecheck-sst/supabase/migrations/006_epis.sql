create table if not exists public.epis (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete restrict,
  employee_name text not null,
  epi_type text not null,
  ca text not null,
  delivered_at date not null,
  expires_at date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists epis_company_id_idx on public.epis (company_id);
create index if not exists epis_expires_at_idx on public.epis (expires_at);

alter table public.epis enable row level security;

create policy "epis_select_same_tenant"
  on public.epis
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = epis.company_id
    )
  );

create policy "epis_insert_same_tenant"
  on public.epis
  for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = epis.company_id
    )
  );

create policy "epis_update_same_tenant"
  on public.epis
  for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = epis.company_id
    )
  );

create policy "epis_delete_same_tenant"
  on public.epis
  for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = epis.company_id
    )
  );
