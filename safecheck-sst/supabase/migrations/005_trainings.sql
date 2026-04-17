create table if not exists public.trainings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete restrict,
  employee_name text not null,
  required_course_name text not null,
  completion_date date not null,
  expiration_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trainings_company_id_idx on public.trainings (company_id);
create index if not exists trainings_expiration_date_idx on public.trainings (expiration_date);

alter table public.trainings enable row level security;

create policy "trainings_select_same_tenant"
  on public.trainings
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = trainings.company_id
    )
  );

create policy "trainings_insert_same_tenant"
  on public.trainings
  for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = trainings.company_id
    )
  );

create policy "trainings_update_same_tenant"
  on public.trainings
  for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = trainings.company_id
    )
  );

create policy "trainings_delete_same_tenant"
  on public.trainings
  for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = trainings.company_id
    )
  );
