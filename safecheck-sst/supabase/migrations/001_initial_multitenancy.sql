-- SafeCheck SST — base multi-empresa + perfis vinculados ao auth.users
-- Execute no SQL Editor do Supabase ou via CLI: supabase db push

create extension if not exists "pgcrypto";

-- Empresas (código slug informado no login)
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create unique index if not exists companies_slug_lower_uidx on public.companies (lower(slug));

-- Perfis: 1 linha por usuário autenticado
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete restrict,
  full_name text,
  role text not null default 'tecnico' check (role in ('admin', 'tecnico', 'leitura')),
  created_at timestamptz not null default now()
);

create index if not exists profiles_company_id_idx on public.profiles (company_id);

alter table public.companies enable row level security;
alter table public.profiles enable row level security;

-- Empresa: somente a do próprio perfil (após login)
create policy "companies_select_same_tenant"
  on public.companies
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.company_id = companies.id
    )
  );

-- Perfil: usuário vê apenas o próprio registro
create policy "profiles_select_own"
  on public.profiles
  for select
  using (id = auth.uid());

-- Cadastros iniciais: use a service role no painel/CLI ou políticas específicas de convite.

comment on table public.companies is 'Tenant principal do SafeCheck SST (slug validado após autenticação).';
comment on table public.profiles is 'Vínculo usuário ↔ empresa.';
