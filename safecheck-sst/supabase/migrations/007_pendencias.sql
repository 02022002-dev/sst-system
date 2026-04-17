create table if not exists public.pendencias (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete restrict,
  inspection_id uuid references public.inspections (id) on delete set null,
  problem_description text not null,
  sector text not null,
  risk_level text not null default 'baixo' check (risk_level in ('baixo', 'medio', 'alto')),
  responsible text not null,
  due_date date not null,
  status text not null default 'pendente' check (status in ('pendente', 'em_andamento', 'resolvida')),
  origin text not null default 'manual' check (origin in ('manual', 'inspecao')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pendencias_company_id_idx
  on public.pendencias (company_id);

create index if not exists pendencias_status_idx
  on public.pendencias (status);

create index if not exists pendencias_risk_level_idx
  on public.pendencias (risk_level);

create index if not exists pendencias_due_date_idx
  on public.pendencias (due_date);

alter table public.pendencias enable row level security;

create policy "pendencias_select_same_tenant"
  on public.pendencias
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = pendencias.company_id
    )
  );

create policy "pendencias_insert_same_tenant"
  on public.pendencias
  for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = pendencias.company_id
    )
  );

create policy "pendencias_update_same_tenant"
  on public.pendencias
  for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = pendencias.company_id
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = pendencias.company_id
    )
  );
