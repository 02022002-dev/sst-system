-- Fotos das inspeções com armazenamento no Supabase Storage

create table if not exists public.inspection_photos (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete restrict,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists inspection_photos_inspection_id_idx
  on public.inspection_photos (inspection_id);

create index if not exists inspection_photos_company_id_idx
  on public.inspection_photos (company_id);

alter table public.inspection_photos enable row level security;

create policy "inspection_photos_select_same_tenant"
  on public.inspection_photos
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = inspection_photos.company_id
    )
  );

create policy "inspection_photos_insert_same_tenant"
  on public.inspection_photos
  for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = inspection_photos.company_id
    )
  );

insert into storage.buckets (id, name, public)
values ('inspection-photos', 'inspection-photos', true)
on conflict (id) do nothing;

create policy "inspection_photos_objects_select_same_tenant"
  on storage.objects
  for select
  using (
    bucket_id = 'inspection-photos'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.company_id::text = split_part(storage.objects.name, '/', 1)
    )
  );

create policy "inspection_photos_objects_insert_same_tenant"
  on storage.objects
  for insert
  with check (
    bucket_id = 'inspection-photos'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.company_id::text = split_part(storage.objects.name, '/', 1)
    )
  );
