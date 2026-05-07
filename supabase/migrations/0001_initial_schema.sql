create extension if not exists "pgcrypto";

create type member_role as enum ('owner', 'admin', 'viewer');
create type unit_status as enum ('vermietet', 'frei', 'unbekannt');
create type lease_status as enum ('active', 'ended', 'draft');
create type receivable_type as enum ('rent', 'deposit', 'utility', 'other');
create type receivable_status as enum ('open', 'partial', 'paid', 'cancelled');
create type task_status as enum ('open', 'done', 'archived');
create type task_priority as enum ('low', 'normal', 'high');
create type document_type as enum (
  'mietvertrag',
  'uebergabeprotokoll',
  'kautionsnachweis',
  'nebenkostenabrechnung',
  'rechnung',
  'sonstiges'
);
create type communication_type as enum (
  'notiz',
  'telefonat',
  'email',
  'brief',
  'gespraech'
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.account_members (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role member_role not null default 'owner',
  created_at timestamptz not null default now(),
  unique(account_id, user_id)
);

create or replace function public.is_account_member(target_account_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.account_members am
    where am.account_id = target_account_id
      and am.user_id = auth.uid()
  );
$$;

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  name text not null,
  street text not null,
  postal_code text not null,
  city text not null,
  country text not null default 'Deutschland',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  floor text,
  size_sqm numeric(10,2),
  rooms numeric(4,1),
  status unit_status not null default 'unbekannt',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.leases (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  unit_id uuid not null references public.units(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete set null,
  start_date date,
  end_date date,
  payment_due_day integer not null default 3 check (payment_due_day between 1 and 28),
  status lease_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.rent_terms (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  lease_id uuid not null references public.leases(id) on delete cascade,
  valid_from date not null default current_date,
  cold_rent numeric(10,2) not null default 0,
  utilities numeric(10,2) not null default 0,
  total_rent numeric(10,2) generated always as (cold_rent + utilities) stored,
  reason text,
  created_at timestamptz not null default now()
);

create table public.deposits (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  lease_id uuid not null references public.leases(id) on delete cascade,
  agreed_amount numeric(10,2) not null default 0,
  paid_amount numeric(10,2) not null default 0,
  held_at text,
  returned_amount numeric(10,2),
  returned_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.receivables (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  lease_id uuid references public.leases(id) on delete cascade,
  type receivable_type not null default 'rent',
  label text not null,
  due_date date not null,
  amount numeric(10,2) not null default 0,
  status receivable_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create unique index receivables_unique_monthly_rent
on public.receivables (lease_id, type, due_date)
where archived_at is null;

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  receivable_id uuid references public.receivables(id) on delete set null,
  lease_id uuid references public.leases(id) on delete set null,
  amount numeric(10,2) not null check (amount >= 0),
  paid_at date not null default current_date,
  method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  unit_id uuid references public.units(id) on delete set null,
  tenant_id uuid references public.tenants(id) on delete set null,
  lease_id uuid references public.leases(id) on delete set null,
  deposit_id uuid references public.deposits(id) on delete set null,
  type document_type not null default 'sonstiges',
  title text not null,
  file_path text not null,
  mime_type text not null,
  file_size integer not null check (file_size >= 0),
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  unit_id uuid references public.units(id) on delete set null,
  tenant_id uuid references public.tenants(id) on delete set null,
  lease_id uuid references public.leases(id) on delete set null,
  title text not null,
  description text,
  due_date date,
  status task_status not null default 'open',
  priority task_priority not null default 'normal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.communications (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete set null,
  unit_id uuid references public.units(id) on delete set null,
  type communication_type not null default 'notiz',
  subject text not null,
  body text,
  happened_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger accounts_touch_updated_at
before update on public.accounts
for each row execute function public.touch_updated_at();

create trigger properties_touch_updated_at
before update on public.properties
for each row execute function public.touch_updated_at();

create trigger units_touch_updated_at
before update on public.units
for each row execute function public.touch_updated_at();

create trigger tenants_touch_updated_at
before update on public.tenants
for each row execute function public.touch_updated_at();

create trigger leases_touch_updated_at
before update on public.leases
for each row execute function public.touch_updated_at();

create trigger deposits_touch_updated_at
before update on public.deposits
for each row execute function public.touch_updated_at();

create trigger receivables_touch_updated_at
before update on public.receivables
for each row execute function public.touch_updated_at();

create trigger payments_touch_updated_at
before update on public.payments
for each row execute function public.touch_updated_at();

create trigger tasks_touch_updated_at
before update on public.tasks
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_account_id uuid;
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email;

  insert into public.accounts (name, owner_user_id)
  values ('Mein Vermieter-Cockpit', new.id)
  returning id into new_account_id;

  insert into public.account_members (account_id, user_id, role)
  values (new_account_id, new.id, 'owner')
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.account_members enable row level security;
alter table public.properties enable row level security;
alter table public.units enable row level security;
alter table public.tenants enable row level security;
alter table public.leases enable row level security;
alter table public.rent_terms enable row level security;
alter table public.deposits enable row level security;
alter table public.receivables enable row level security;
alter table public.payments enable row level security;
alter table public.documents enable row level security;
alter table public.tasks enable row level security;
alter table public.communications enable row level security;
alter table public.audit_logs enable row level security;

create policy "Profiles are visible to owner"
on public.profiles for select
using (id = auth.uid());

create policy "Profiles are editable by owner"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Accounts are visible to members"
on public.accounts for select
using (public.is_account_member(id));

create policy "Account owners can update account"
on public.accounts for update
using (public.is_account_member(id))
with check (public.is_account_member(id));

create policy "Users can create owned account"
on public.accounts for insert
with check (owner_user_id = auth.uid());

create policy "Members can view account membership"
on public.account_members for select
using (public.is_account_member(account_id));

create policy "Owners can add membership"
on public.account_members for insert
with check (public.is_account_member(account_id));

create policy "Members can view properties"
on public.properties for select
using (public.is_account_member(account_id));

create policy "Members can insert properties"
on public.properties for insert
with check (public.is_account_member(account_id));

create policy "Members can update properties"
on public.properties for update
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "Members can view units"
on public.units for select
using (public.is_account_member(account_id));

create policy "Members can insert units"
on public.units for insert
with check (public.is_account_member(account_id));

create policy "Members can update units"
on public.units for update
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "Members can view tenants"
on public.tenants for select
using (public.is_account_member(account_id));

create policy "Members can insert tenants"
on public.tenants for insert
with check (public.is_account_member(account_id));

create policy "Members can update tenants"
on public.tenants for update
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "Members can view leases"
on public.leases for select
using (public.is_account_member(account_id));

create policy "Members can insert leases"
on public.leases for insert
with check (public.is_account_member(account_id));

create policy "Members can update leases"
on public.leases for update
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "Members can view rent terms"
on public.rent_terms for select
using (public.is_account_member(account_id));

create policy "Members can insert rent terms"
on public.rent_terms for insert
with check (public.is_account_member(account_id));

create policy "Members can view deposits"
on public.deposits for select
using (public.is_account_member(account_id));

create policy "Members can insert deposits"
on public.deposits for insert
with check (public.is_account_member(account_id));

create policy "Members can update deposits"
on public.deposits for update
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "Members can view receivables"
on public.receivables for select
using (public.is_account_member(account_id));

create policy "Members can insert receivables"
on public.receivables for insert
with check (public.is_account_member(account_id));

create policy "Members can update receivables"
on public.receivables for update
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "Members can view payments"
on public.payments for select
using (public.is_account_member(account_id));

create policy "Members can insert payments"
on public.payments for insert
with check (public.is_account_member(account_id));

create policy "Members can update payments"
on public.payments for update
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "Members can view documents"
on public.documents for select
using (public.is_account_member(account_id));

create policy "Members can insert documents"
on public.documents for insert
with check (public.is_account_member(account_id));

create policy "Members can update documents"
on public.documents for update
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "Members can view tasks"
on public.tasks for select
using (public.is_account_member(account_id));

create policy "Members can insert tasks"
on public.tasks for insert
with check (public.is_account_member(account_id));

create policy "Members can update tasks"
on public.tasks for update
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "Members can view communications"
on public.communications for select
using (public.is_account_member(account_id));

create policy "Members can insert communications"
on public.communications for insert
with check (public.is_account_member(account_id));

create policy "Members can view audit logs"
on public.audit_logs for select
using (public.is_account_member(account_id));

create policy "Members can insert audit logs"
on public.audit_logs for insert
with check (public.is_account_member(account_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Members can read account documents"
on storage.objects for select
using (
  bucket_id = 'documents'
  and public.is_account_member((storage.foldername(name))[1]::uuid)
);

create policy "Members can upload account documents"
on storage.objects for insert
with check (
  bucket_id = 'documents'
  and public.is_account_member((storage.foldername(name))[1]::uuid)
);

create policy "Members can update account documents"
on storage.objects for update
using (
  bucket_id = 'documents'
  and public.is_account_member((storage.foldername(name))[1]::uuid)
)
with check (
  bucket_id = 'documents'
  and public.is_account_member((storage.foldername(name))[1]::uuid)
);
