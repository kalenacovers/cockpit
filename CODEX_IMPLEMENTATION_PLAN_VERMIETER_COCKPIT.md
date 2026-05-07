# Codex Implementation Plan — Vermieter Cockpit

**Projekt:** Vermieter Cockpit  
**Zielgruppe:** private Vermieter mit 1–10 Wohnungen  
**Ziel:** deploybare, webbasierte MVP-Anwendung auf Vercel  
**Stack:** Next.js App Router, TypeScript, Supabase, PostgreSQL, Supabase Auth, Supabase Storage, Tailwind CSS, shadcn/ui, Vercel  
**Sprache der UI:** Deutsch  
**Designrichtung:** Monochrome Utility — schwarz/weiß, klar, reduziert, hochwertige Struktur, minimale Akzente

---

## 0. Ergebnis, das Codex liefern soll

Implementiere eine produktionsnahe, deploybare MVP-Web-App für private Vermieter.

Die App muss nach `pnpm build` fehlerfrei bauen und auf Vercel deploybar sein.

Der Output soll kein reines Mockup sein. Er soll echte Authentifizierung, echte Datenbanktabellen, echte CRUD-Funktionen und echte geschützte App-Routen enthalten.

---

## 1. Produktversprechen

Die Anwendung ist ein einfacher digitaler Vermieter-Ordner.

Private Vermieter sollen ohne Fachwissen sofort verstehen:

- Welche Wohnungen habe ich?
- Wer wohnt wo?
- Welche Miete ist offen?
- Welche Dokumente fehlen?
- Welche Aufgaben sind als Nächstes dran?

Die App darf sich nicht wie komplizierte Hausverwaltungssoftware anfühlen.

### Tonalität

Verwende Alltagssprache.

Nutze in der UI:

- Wohnung hinzufügen
- Mieter eintragen
- Miete erfassen
- Zahlung als bezahlt markieren
- Dokument hochladen
- Aufgabe erstellen

Vermeide in der UI:

- Objekteinheit
- Debitor
- Forderung generieren
- Sollstellung
- Entität
- Persistieren
- OP-Liste

---

## 2. Nicht verhandelbare UX-Regeln

1. Eine Hauptaktion pro Screen.
2. Keine Fachsprache in der UI.
3. Formulare zeigen nur die wichtigsten Felder zuerst.
4. Optionale Details kommen unter „Weitere Details“.
5. Jede Warnung oder offene Aufgabe hat eine direkte Aktion.
6. Keine endgültige Löschung im MVP; stattdessen archivieren.
7. Keine Tabellenwüste auf Dashboard und Wohnungsübersicht.
8. Karten und strukturierte Listen statt komplexer Admin-Tabellen.
9. Mobile Bedienung muss genauso klar sein wie Desktop.
10. Der Erstnutzer muss in unter fünf Minuten seine erste Wohnung anlegen können.

---

## 3. Designrichtung

### Stilname

**Monochrome Utility**

Das Produkt soll wirken wie ein hochwertiges, ruhiges Arbeitswerkzeug.

Inspiration:

- Linear
- Notion
- Apple Settings
- moderne Banking-App
- digitaler Dokumentenordner

Nicht gewünscht:

- bunte SaaS-KPI-Karten
- AI-Slop-Illustrationen
- Glassmorphism
- Farbverläufe
- übertriebene Schatten
- zufällige Icons
- laute Dashboard-Optik

---

## 4. Design-Tokens

### Farben

```ts
export const colors = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  softGray: '#F5F5F5',
  card: '#FFFFFF',

  border: '#E5E5E5',
  borderStrong: '#D4D4D4',

  textPrimary: '#111111',
  textSecondary: '#525252',
  textMuted: '#737373',
  textDisabled: '#A3A3A3',

  primary: '#111111',
  primaryHover: '#262626',
  primaryText: '#FFFFFF',

  accent: '#2F5D50',
  accentSoft: '#EEF5F2',
  accentBorder: '#C8DCD4',

  successText: '#166534',
  successBg: '#F0FDF4',
  successBorder: '#BBF7D0',

  warningText: '#92400E',
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',

  errorText: '#991B1B',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',

  infoText: '#1F3A5F',
  infoBg: '#F1F5F9',
  infoBorder: '#CBD5E1',
};
```

### Typografie

Nutze `Geist` über `next/font/google`.

Typografische Skala:

```txt
Display:       32px / 40px / 600
Page Title:    28px / 36px / 600
Section Title: 20px / 28px / 600
Card Title:    16px / 24px / 600
Body:          15px / 24px / 400
Small:         14px / 20px / 400
Meta:          13px / 18px / 400
Button:        14px / 20px / 500
```

Nicht überall fett machen. Hierarchie entsteht durch Größe, Abstand, Position und Kontrast.

### Spacing

Nutze ein 8px-System:

```txt
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80
```

Standardwerte:

```txt
Desktop Page Padding: 32px
Mobile Page Padding: 16px
Card Padding: 24px
Small Card Padding: 16px
Section Gap: 32px
Card Gap: 16px
Form Field Gap: 16px
```

### Radius

```txt
Small: 8px
Medium: 12px
Large: 16px
XL: 20px
Pill: 999px
```

Standard:

```txt
Cards: 16px
Inputs: 12px
Buttons: 12px
Badges: 999px
```

### Shadows

Fast keine Schatten.

Maximal:

```css
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
```

Borders sind wichtiger als Schatten.

---

## 5. Komponentenstil

### Buttons

#### Primary Button

- Hintergrund: `#111111`
- Hover: `#262626`
- Text: `#FFFFFF`
- Höhe: `42px`
- Padding: `0 16px`
- Radius: `12px`
- Font: `14px / 500`

Verwendung:

- Wohnung hinzufügen
- Miete als bezahlt markieren
- Dokument hochladen
- Aufgabe erstellen

#### Secondary Button

- Hintergrund: `#FFFFFF`
- Border: `#E5E5E5`
- Text: `#111111`
- Höhe: `42px`
- Radius: `12px`
- Hover: `#FAFAFA`

Verwendung:

- Später erledigen
- Weitere Details
- Bearbeiten

#### Ghost Button

- Transparent
- Text: `#525252`
- Hover: `#F5F5F5`

Verwendung:

- Zurück
- Abbrechen

#### Danger Action

Keine rote Hauptaktion im normalen Screen.

Nutze:

- Archivieren
- Ruhige Bestätigung
- Kein endgültiges Löschen im MVP

---

### Inputs

```txt
Height: 44px
Background: #FFFFFF
Border: 1px solid #E5E5E5
Radius: 12px
Padding: 0 12px
Text: #111111
Placeholder: #A3A3A3
```

Focus:

```txt
Border: #111111
Ring: 2px rgba(17,17,17,0.08)
```

Fehlermeldungen immer menschlich formulieren.

Gut:

```txt
Bitte gib einen Namen für die Wohnung ein.
```

Schlecht:

```txt
Validation failed.
```

---

### Cards

```txt
Background: #FFFFFF
Border: 1px solid #E5E5E5
Radius: 16px
Padding: 24px
Shadow: optional minimal
```

Keine Card-in-Card-in-Card-Strukturen.

---

### Badges

Badges für:

- Bezahlt
- Offen
- Teilweise bezahlt
- Fehlt noch
- Bald fällig
- Vermietet
- Frei

Stil:

```txt
Height: 24px
Padding: 0 8px
Radius: 999px
Font: 13px / 500
Border: 1px solid
Background: sehr hell
```

---

## 6. Technischer Stack

Nutze:

- Next.js mit App Router
- TypeScript
- Tailwind CSS
- shadcn/ui als Komponentenbasis
- lucide-react für reduzierte Line-Icons
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage für Dokumente
- Supabase SSR Client über `@supabase/ssr`
- Zod für Validierung
- Server Actions für Mutationen
- React Hook Form für komplexere Formulare
- Vercel Deployment

### Paketmanager

Nutze `pnpm`.

---

## 7. Projektsetup

Falls das Repository leer ist, initialisiere:

```bash
pnpm create next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*"
```

Installiere Abhängigkeiten:

```bash
pnpm add @supabase/supabase-js @supabase/ssr zod date-fns lucide-react clsx tailwind-merge class-variance-authority react-hook-form @hookform/resolvers sonner
pnpm add -D supabase
```

Initialisiere shadcn/ui:

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input label card badge textarea select dialog dropdown-menu sheet separator table tabs checkbox progress toast
```

---

## 8. Erwartete Ordnerstruktur

Implementiere diese Struktur:

```txt
.
├── app
│   ├── (auth)
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── register
│   │   │   └── page.tsx
│   │   └── callback
│   │       └── route.ts
│   ├── (app)
│   │   ├── layout.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── setup
│   │   │   └── page.tsx
│   │   ├── wohnungen
│   │   │   ├── page.tsx
│   │   │   ├── new
│   │   │   │   └── page.tsx
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── mieter
│   │   │   ├── page.tsx
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── zahlungen
│   │   │   └── page.tsx
│   │   ├── dokumente
│   │   │   └── page.tsx
│   │   ├── aufgaben
│   │   │   └── page.tsx
│   │   └── einstellungen
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── app
│   │   ├── app-shell.tsx
│   │   ├── sidebar.tsx
│   │   ├── mobile-nav.tsx
│   │   ├── page-header.tsx
│   │   ├── empty-state.tsx
│   │   ├── status-badge.tsx
│   │   ├── dashboard-summary.tsx
│   │   ├── property-card.tsx
│   │   ├── unit-card.tsx
│   │   ├── payment-row.tsx
│   │   └── document-upload.tsx
│   ├── forms
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── setup-wizard.tsx
│   │   ├── unit-form.tsx
│   │   ├── tenant-form.tsx
│   │   ├── payment-form.tsx
│   │   ├── task-form.tsx
│   │   └── document-form.tsx
│   └── ui
│       └── ...shadcn components
├── lib
│   ├── actions
│   │   ├── auth.ts
│   │   ├── setup.ts
│   │   ├── properties.ts
│   │   ├── tenants.ts
│   │   ├── payments.ts
│   │   ├── documents.ts
│   │   └── tasks.ts
│   ├── data
│   │   ├── dashboard.ts
│   │   ├── properties.ts
│   │   ├── tenants.ts
│   │   ├── payments.ts
│   │   ├── documents.ts
│   │   └── tasks.ts
│   ├── supabase
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── middleware.ts
│   │   └── types.ts
│   ├── validation
│   │   ├── auth.ts
│   │   ├── setup.ts
│   │   ├── property.ts
│   │   ├── tenant.ts
│   │   ├── payment.ts
│   │   ├── document.ts
│   │   └── task.ts
│   ├── utils.ts
│   └── constants.ts
├── supabase
│   ├── migrations
│   │   └── 0001_initial_schema.sql
│   └── seed.sql
├── middleware.ts
├── .env.example
├── README.md
└── package.json
```

---

## 9. Environment Variables

Erstelle `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Wichtig:

- `SUPABASE_SERVICE_ROLE_KEY` niemals im Client verwenden.
- Clientseitig nur `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY` verwenden.
- In Vercel müssen dieselben Environment Variables in Project Settings gepflegt werden.

---

## 10. Supabase Schema

Erstelle `supabase/migrations/0001_initial_schema.sql`.

### Extensions

```sql
create extension if not exists "pgcrypto";
```

### Enums

```sql
create type member_role as enum ('owner', 'admin', 'viewer');
create type unit_status as enum ('vermietet', 'frei', 'unbekannt');
create type lease_status as enum ('active', 'ended', 'draft');
create type receivable_type as enum ('rent', 'deposit', 'utility', 'other');
create type receivable_status as enum ('open', 'partial', 'paid', 'cancelled');
create type task_status as enum ('open', 'done', 'archived');
create type task_priority as enum ('low', 'normal', 'high');
create type document_type as enum ('mietvertrag', 'uebergabeprotokoll', 'kautionsnachweis', 'nebenkostenabrechnung', 'rechnung', 'sonstiges');
create type communication_type as enum ('notiz', 'telefonat', 'email', 'brief', 'gespraech');
```

### Helper function

```sql
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
```

### Profiles

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Accounts

```sql
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
```

### Account Members

```sql
create table public.account_members (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role member_role not null default 'owner',
  created_at timestamptz not null default now(),
  unique(account_id, user_id)
);
```

### Properties

Auch wenn die UI mit „Wohnung“ startet, bleibt das Datenmodell sauber: Immobilie -> Wohnung.

```sql
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
```

### Units

```sql
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
```

### Tenants

```sql
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
```

### Leases

MVP: ein Hauptmieter pro Mietvertrag. Mehrere Bewohner können später ergänzt werden.

```sql
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
```

### Rent Terms

Mietverlauf statt nur aktueller Miete.

```sql
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
```

### Deposits

```sql
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
```

### Receivables

In der UI heißt das nicht „Forderungen“, sondern „Zahlungen“ oder „offene Mieten“.

```sql
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
```

### Payments

```sql
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
```

### Documents

```sql
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  unit_id uuid references public.units(id) on delete set null,
  tenant_id uuid references public.tenants(id) on delete set null,
  lease_id uuid references public.leases(id) on delete set null,
  file_name text not null,
  file_path text not null,
  file_size bigint,
  mime_type text,
  document_type document_type not null default 'sonstiges',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
```

### Tasks

```sql
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  unit_id uuid references public.units(id) on delete set null,
  tenant_id uuid references public.tenants(id) on delete set null,
  title text not null,
  description text,
  due_date date,
  status task_status not null default 'open',
  priority task_priority not null default 'normal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
```

### Communications

```sql
create table public.communications (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  unit_id uuid references public.units(id) on delete set null,
  tenant_id uuid references public.tenants(id) on delete set null,
  lease_id uuid references public.leases(id) on delete set null,
  type communication_type not null default 'notiz',
  subject text,
  body text not null,
  communication_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);
```

### Audit Logs

```sql
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.accounts(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

### Updated at Trigger

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_accounts_updated_at before update on public.accounts for each row execute function public.set_updated_at();
create trigger set_properties_updated_at before update on public.properties for each row execute function public.set_updated_at();
create trigger set_units_updated_at before update on public.units for each row execute function public.set_updated_at();
create trigger set_tenants_updated_at before update on public.tenants for each row execute function public.set_updated_at();
create trigger set_leases_updated_at before update on public.leases for each row execute function public.set_updated_at();
create trigger set_deposits_updated_at before update on public.deposits for each row execute function public.set_updated_at();
create trigger set_receivables_updated_at before update on public.receivables for each row execute function public.set_updated_at();
create trigger set_payments_updated_at before update on public.payments for each row execute function public.set_updated_at();
create trigger set_documents_updated_at before update on public.documents for each row execute function public.set_updated_at();
create trigger set_tasks_updated_at before update on public.tasks for each row execute function public.set_updated_at();
create trigger set_communications_updated_at before update on public.communications for each row execute function public.set_updated_at();
```

---

## 11. Signup Trigger

Beim neuen Supabase-User soll automatisch erstellt werden:

- profile
- account
- account_members owner

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_account_id uuid;
  display_name text;
begin
  display_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Mein Konto');

  insert into public.profiles (id, full_name, email)
  values (new.id, display_name, new.email);

  insert into public.accounts (name, owner_user_id)
  values ('Mein Vermieter-Konto', new.id)
  returning id into new_account_id;

  insert into public.account_members (account_id, user_id, role)
  values (new_account_id, new.id, 'owner');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

---

## 12. Row Level Security

Aktiviere RLS auf allen Tabellen.

```sql
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
```

### Profiles policies

```sql
create policy "profiles_select_own" on public.profiles
for select to authenticated
using (id = auth.uid());

create policy "profiles_update_own" on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());
```

### Account policies

```sql
create policy "accounts_select_member" on public.accounts
for select to authenticated
using (public.is_account_member(id));

create policy "accounts_update_owner" on public.accounts
for update to authenticated
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());
```

### Account member policies

```sql
create policy "account_members_select_member" on public.account_members
for select to authenticated
using (public.is_account_member(account_id));

create policy "account_members_manage_owner" on public.account_members
for all to authenticated
using (
  exists (
    select 1 from public.accounts a
    where a.id = account_members.account_id
      and a.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.accounts a
    where a.id = account_members.account_id
      and a.owner_user_id = auth.uid()
  )
);
```

### Generic account-owned policies

Für alle account-basierten Tabellen gilt:

```sql
create policy "properties_all_member" on public.properties
for all to authenticated
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "units_all_member" on public.units
for all to authenticated
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "tenants_all_member" on public.tenants
for all to authenticated
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "leases_all_member" on public.leases
for all to authenticated
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "rent_terms_all_member" on public.rent_terms
for all to authenticated
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "deposits_all_member" on public.deposits
for all to authenticated
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "receivables_all_member" on public.receivables
for all to authenticated
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "payments_all_member" on public.payments
for all to authenticated
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "documents_all_member" on public.documents
for all to authenticated
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "tasks_all_member" on public.tasks
for all to authenticated
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "communications_all_member" on public.communications
for all to authenticated
using (public.is_account_member(account_id))
with check (public.is_account_member(account_id));

create policy "audit_logs_select_member" on public.audit_logs
for select to authenticated
using (account_id is null or public.is_account_member(account_id));

create policy "audit_logs_insert_member" on public.audit_logs
for insert to authenticated
with check (account_id is null or public.is_account_member(account_id));
```

---

## 13. Storage

Erstelle Bucket:

```sql
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;
```

Dateipfad-Konvention:

```txt
{account_id}/{document_id}/{safe_file_name}
```

Storage Policies:

```sql
create policy "documents_storage_select_member"
on storage.objects for select
to authenticated
using (
  bucket_id = 'documents'
  and exists (
    select 1 from public.account_members am
    where am.account_id::text = (storage.foldername(name))[1]
      and am.user_id = auth.uid()
  )
);

create policy "documents_storage_insert_member"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'documents'
  and exists (
    select 1 from public.account_members am
    where am.account_id::text = (storage.foldername(name))[1]
      and am.user_id = auth.uid()
  )
);

create policy "documents_storage_update_member"
on storage.objects for update
to authenticated
using (
  bucket_id = 'documents'
  and exists (
    select 1 from public.account_members am
    where am.account_id::text = (storage.foldername(name))[1]
      and am.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'documents'
  and exists (
    select 1 from public.account_members am
    where am.account_id::text = (storage.foldername(name))[1]
      and am.user_id = auth.uid()
  )
);
```

Im MVP keine endgültige Dateilöschung aus der UI. Dokumente werden archiviert.

---

## 14. Supabase Client Setup

Implementiere:

### `lib/supabase/client.ts`

Browser Client für Client Components.

### `lib/supabase/server.ts`

Server Client mit Cookies.

### `lib/supabase/middleware.ts`

Middleware Client für Session Refresh.

### `middleware.ts`

Schütze App-Routen:

- `/dashboard`
- `/setup`
- `/wohnungen`
- `/mieter`
- `/zahlungen`
- `/dokumente`
- `/aufgaben`
- `/einstellungen`

Redirects:

- nicht eingeloggt -> `/login`
- eingeloggt auf `/login` oder `/register` -> `/dashboard`

---

## 15. Auth Flow

### `/register`

Felder:

- Name
- E-Mail
- Passwort

Nach Signup:

- bei Session vorhanden: `/setup`
- bei E-Mail-Confirm notwendig: zeige freundliche Nachricht

UI-Text:

```txt
Konto erstellen
Lege dein Vermieter-Cockpit an und richte danach deine erste Wohnung ein.
```

### `/login`

Felder:

- E-Mail
- Passwort

Nach Login:

- wenn keine Wohnung vorhanden: `/setup`
- sonst `/dashboard`

### Logout

Im Account-Bereich unten in der Sidebar.

---

## 16. Core Data Access

Erstelle zentrale Helper:

### `getCurrentUser()`

- liest Session
- redirectet bei Bedarf

### `getCurrentAccount()`

- liest erstes account_members-Konto des Users
- gibt `account_id`, Rolle und Account zurück
- wirft Fehler, falls kein Account existiert

### `requireAccount()`

Für Server Actions.

Keine Server Action darf `account_id` aus dem Formular vertrauen. Immer aus Session ableiten.

---

## 17. Onboarding Flow `/setup`

Der Setup-Flow ist der wichtigste UX-Teil.

### Ziel

Nutzer legt erste Wohnung in wenigen Minuten an.

### Steps

1. Adresse
2. Wohnungsname
3. Vermietungsstatus
4. Mieter
5. Miete
6. Kaution
7. Dokument optional
8. Fertig

### UI-Prinzip

Ein Schritt, eine Frage.

Keine langen Formulare.

### Felder

#### Step 1: Adresse

Pflicht:

- Straße und Hausnummer
- PLZ
- Ort

Default:

- Land: Deutschland

#### Step 2: Wohnung

Pflicht:

- Wohnungsname

Optional:

- Größe in m²
- Zimmeranzahl
- Etage

Beispiel-Chips:

- 2. OG links
- Wohnung Berlin
- Dachgeschoss
- Musterstraße 12

#### Step 3: Vermietungsstatus

Optionen als große Karten:

- Ja, sie ist vermietet
- Nein, sie ist frei
- Ich trage das später ein

#### Step 4: Mieter

Nur wenn vermietet.

Pflicht:

- Vorname
- Nachname

Optional:

- E-Mail
- Telefon
- Einzugsdatum

#### Step 5: Miete

Pflicht:

- Kaltmiete

Optional:

- Nebenkosten

Automatisch:

- Gesamtmiete = Kaltmiete + Nebenkosten

Payment due day:

- Default 3

Optionen:

- Am 1. des Monats
- Am 3. des Monats
- Am 5. des Monats
- Anderer Tag

#### Step 6: Kaution

Optionen:

- Ja
- Nein
- Später eintragen

Wenn Ja:

- Vereinbarte Kaution
- Davon bereits bezahlt
- Aufbewahrung / Konto
- Notiz

#### Step 7: Dokument

Optional.

- Dokument hochladen
- Später erledigen

#### Step 8: Fertig

Zusammenfassung:

- Wohnung
- Mieter
- Monatsmiete
- Fälligkeit

Checkliste:

- Wohnung angelegt
- Mieter eingetragen
- Miete hinterlegt
- Mietvertrag fehlt noch, falls nicht hochgeladen
- Kaution prüfen, falls unvollständig

Buttons:

- Zum Dashboard
- Weitere Wohnung hinzufügen

### Daten, die der Setup anlegt

Bei vermieteter Wohnung:

- property
- unit
- tenant
- lease
- rent_term
- deposit optional
- current month rent receivable
- initial tasks for missing items

Bei freier Wohnung:

- property
- unit
- optional target rent as draft lease nicht nötig
- task optional: Mieter eintragen

### Automatische Aufgaben nach Setup

Wenn kein Mietvertrag hochgeladen:

```txt
Mietvertrag hochladen
```

Wenn Kaution unvollständig:

```txt
Kaution prüfen
```

Wenn kein Übergabeprotokoll:

```txt
Übergabeprotokoll hochladen
```

---

## 18. Dashboard `/dashboard`

### Ziel

In fünf Sekunden verstehen:

- Ist alles okay?
- Was ist offen?
- Was muss ich tun?

### Header

```txt
Dashboard
Hier siehst du, ob bei deinen Wohnungen alles in Ordnung ist.
```

Primary Action:

```txt
+ Wohnung hinzufügen
```

### Summary Card

Eine große, ruhige Übersicht statt bunter KPI-Karten.

Zeige:

- Wohnungen gesamt
- vermietete Wohnungen
- monatliche Miete
- offene Mieten
- offene Aufgaben

### Hinweisbereich

Titel:

```txt
Zu erledigen
```

Zeige die wichtigsten 3–5 offenen Hinweise:

- offene Mieten
- fehlende Dokumente
- offene Aufgaben
- Kaution unvollständig

Jede Hinweiszeile hat direkte Aktion.

### Wohnungen kompakt

Liste der Wohnungen:

- Wohnungsname
- Adresse
- Mieter
- Monatsmiete
- Status aktueller Monat

### Empty State

Wenn keine Wohnung:

```txt
Noch keine Wohnung angelegt
Füge deine erste Wohnung hinzu und behalte Miete, Mieter und Dokumente im Blick.
[Erste Wohnung hinzufügen]
```

---

## 19. Wohnungen `/wohnungen`

### Übersicht

Header:

```txt
Deine Wohnungen
Alle Wohnungen, Mieter und Mietstatus auf einen Blick.
```

Primary Action:

```txt
+ Wohnung hinzufügen
```

### Wohnungskarte

```txt
2. OG links
Musterstraße 12, Berlin

Mieter: Max Müller
Miete: 930 € / Monat
Status: Bezahlt

[Details öffnen]
```

Keine große Tabelle.

---

## 20. Wohnung Detail `/wohnungen/[id]`

### Header

```txt
2. OG links
Musterstraße 12, 12345 Berlin
```

Primary Action:

```txt
Zahlung erfassen
```

Secondary:

```txt
Bearbeiten
Dokument hochladen
Aufgabe erstellen
```

### Status Badges

- Bezahlt
- Offen
- Mietvertrag fehlt
- Kaution prüfen
- Vermietet
- Frei

### Layout Desktop

Zwei Spalten:

Links groß:

- Mieter
- Miete
- Zahlungen
- Dokumente

Rechts schmal:

- Aufgaben
- Notizen
- Wichtige Daten

Mobile:

- alles untereinander

### Karten

#### Mieter

```txt
Mieter
Max Müller
Einzug: 01.02.2024
Telefon: —
E-Mail: max@example.com
[Bearbeiten]
```

#### Miete

```txt
Monatliche Miete
Kaltmiete: 750 €
Nebenkosten: 180 €
Gesamt: 930 €
Fällig jeden Monat am 3.
[Ändern]
```

#### Dokumente

```txt
Dokumente
Mietvertrag fehlt noch
Übergabeprotokoll hochgeladen
[Dokument hochladen]
```

#### Aufgaben

```txt
Aufgaben
Mietvertrag hochladen
Kaution prüfen
[Aufgabe erstellen]
```

---

## 21. Zahlungen `/zahlungen`

### Ziel

Der Nutzer sieht sofort, wer bezahlt hat und was offen ist.

Header:

```txt
Zahlungen
Behalte monatliche Mieten und offene Beträge im Blick.
```

Primary Action:

```txt
Zahlung erfassen
```

### Monatsnavigation

```txt
< April 2026    Mai 2026    Juni 2026 >
```

### Filter

- Alle
- Offen
- Bezahlt
- Teilweise

### Zahlungszeile

Desktop als ruhige Liste, nicht als schwere Tabelle.

```txt
2. OG links
Max Müller

Soll: 930 €
Bezahlt: 930 €
Status: Bezahlt

[Bearbeiten]
```

Offen:

```txt
Wohnung Berlin
Anna Schmidt

Soll: 930 €
Bezahlt: 0 €
Status: Offen

[Als bezahlt markieren]
[Teilzahlung]
```

### Logik

Implementiere:

- `markAsPaid(receivableId)` legt Payment über offenen Betrag an
- `addPartialPayment(receivableId, amount)` legt Teilzahlung an
- Status wird aktualisiert:
  - paid sum >= amount => paid
  - paid sum > 0 => partial
  - else open

---

## 22. Dokumente `/dokumente`

### Header

```txt
Dokumente
Speichere Mietverträge, Protokolle und Nachweise an einem Ort.
```

Primary Action:

```txt
+ Dokument hochladen
```

### Dokumentkarte

```txt
Mietvertrag
2. OG links
Max Müller
Hochgeladen am 07.05.2026

[Öffnen]
[Ersetzen]
[Archivieren]
```

### Upload

Frage:

```txt
Wozu gehört dieses Dokument?
```

Optionen:

- Wohnung
- Mieter
- Mietvertrag
- Kaution
- Sonstiges

Dokumenttypen:

- Mietvertrag
- Übergabeprotokoll
- Kautionsnachweis
- Nebenkostenabrechnung
- Rechnung
- Sonstiges

Max file size im MVP:

- 10 MB

Erlaubte MIME Types:

- application/pdf
- image/jpeg
- image/png
- image/webp

---

## 23. Aufgaben `/aufgaben`

### Header

```txt
Aufgaben
Alles, was du als Vermieter noch erledigen möchtest.
```

Primary Action:

```txt
+ Aufgabe erstellen
```

### Vorlagen

Biete schnelle Vorlagen an:

- Mietvertrag hochladen
- Kaution prüfen
- Rauchmelder prüfen
- Nebenkostenabrechnung vorbereiten
- Reparatur notieren
- Übergabeprotokoll hochladen

### Aufgabenkarte

```txt
Mietvertrag hochladen
2. OG links
Fällig: Ohne Datum
Status: offen

[Erledigt markieren]
```

### Status

- offen
- erledigt
- archiviert

---

## 24. Mieter `/mieter`

### Übersicht

```txt
Max Müller
2. OG links
Einzug: 01.02.2024
Telefon: optional
E-Mail: optional

[Details öffnen]
```

### Detailseite

Bereiche:

- Kontaktdaten
- Wohnung
- Mietvertrag
- Zahlungen
- Dokumente
- Notizen
- Kommunikation

### Kommunikationsnotizen

Beispiele:

- Telefonat wegen Reparatur
- E-Mail wegen Mietzahlung
- Persönliches Gespräch
- Brief versendet

---

## 25. Einstellungen `/einstellungen`

MVP minimal:

- Profilname
- E-Mail anzeigen
- Account-Name
- Logout

Noch nicht implementieren:

- Billing
- Team-Einladungen
- Datenexport
- Löschkonzept UI

Datenmodell ist dafür vorbereitet.

---

## 26. Server Actions

Implementiere Server Actions mit Zod-Validierung.

### Auth

- `signInAction`
- `signUpAction`
- `signOutAction`

### Setup

- `completeSetupAction`

Muss atomar genug sein. Falls ein Insert fehlschlägt, zeige eine freundliche Fehlermeldung.

### Properties / Units

- `createUnitAction`
- `updateUnitAction`
- `archiveUnitAction`

### Tenants

- `createTenantAction`
- `updateTenantAction`
- `archiveTenantAction`

### Payments

- `ensureCurrentMonthReceivablesAction`
- `markReceivablePaidAction`
- `addPaymentAction`
- `updatePaymentAction`

### Documents

- `uploadDocumentAction`
- `archiveDocumentAction`

### Tasks

- `createTaskAction`
- `markTaskDoneAction`
- `archiveTaskAction`

---

## 27. Data Fetching

Nutze Server Components für Seiten.

Datenfunktionen in `lib/data/*`.

Beispiele:

- `getDashboardData(accountId)`
- `getUnits(accountId)`
- `getUnitDetail(accountId, unitId)`
- `getTenants(accountId)`
- `getPaymentsForMonth(accountId, year, month)`
- `getDocuments(accountId)`
- `getTasks(accountId)`

Alle Queries müssen `account_id` filtern.

---

## 28. Payment / Receivable Generation

MVP-Logik:

Wenn ein aktiver Mietvertrag mit aktuellem Rent Term existiert, muss für den aktuellen Monat eine Monatsmiete existieren.

Implementiere Helper:

```ts
ensureMonthlyRentReceivables(accountId: string, targetMonth: Date)
```

Logik:

1. Lade aktive leases.
2. Lade gültigen rent_term je lease für targetMonth.
3. Berechne due_date aus Jahr, Monat und `payment_due_day`.
4. Prüfe, ob receivable für lease + Monat + type rent existiert.
5. Wenn nicht, erstelle receivable:
   - type: rent
   - label: `Miete Mai 2026`
   - amount: total_rent
   - due_date
   - status: open

Optional: Erzeuge für den Vormonat ebenfalls, wenn noch nicht vorhanden.

---

## 29. Routing

### Root `/`

Wenn nicht eingeloggt:

- redirect `/login`

Wenn eingeloggt:

- falls keine Wohnungen: `/setup`
- sonst `/dashboard`

### Auth Routes

- `/login`
- `/register`
- `/callback`

### App Routes

- `/setup`
- `/dashboard`
- `/wohnungen`
- `/wohnungen/new`
- `/wohnungen/[id]`
- `/mieter`
- `/mieter/[id]`
- `/zahlungen`
- `/dokumente`
- `/aufgaben`
- `/einstellungen`

---

## 30. App Shell

### Desktop

Sidebar links, 260px.

Navigation:

- Dashboard
- Wohnungen
- Mieter
- Zahlungen
- Dokumente
- Aufgaben
- Einstellungen

Account/Logout unten.

### Mobile

Bottom Navigation:

- Start
- Wohnungen
- Zahlungen
- Aufgaben
- Mehr

Unter Mehr:

- Mieter
- Dokumente
- Einstellungen

---

## 31. Empty States

Jede leere Seite braucht einen hilfreichen Zustand.

### Keine Wohnungen

```txt
Noch keine Wohnung angelegt
Füge deine erste Wohnung hinzu und behalte Miete, Mieter und Dokumente im Blick.
[Erste Wohnung hinzufügen]
```

### Keine Dokumente

```txt
Noch keine Dokumente
Lade Mietvertrag, Übergabeprotokoll oder Kautionsnachweis hoch.
[Dokument hochladen]
```

### Keine Aufgaben

```txt
Keine offenen Aufgaben
Alles sieht gut aus.
[Aufgabe erstellen]
```

### Keine Zahlungen

```txt
Noch keine Mietzahlungen
Sobald du eine vermietete Wohnung angelegt hast, erscheinen hier die monatlichen Zahlungen.
```

---

## 32. Fehler- und Ladezustände

### Loading

Nutze ruhige Skeletons, keine Spinner-Orgie.

### Fehler

Keine technischen Fehlermeldungen zeigen.

Gut:

```txt
Das hat leider nicht geklappt. Bitte versuche es erneut.
```

Für Formularfelder spezifisch:

```txt
Bitte gib eine gültige E-Mail-Adresse ein.
```

### Toasts

Nutze `sonner`.

Beispiele:

- Wohnung wurde angelegt.
- Zahlung wurde als bezahlt markiert.
- Dokument wurde hochgeladen.
- Aufgabe wurde erledigt.

---

## 33. Validierung

Nutze Zod.

Beispiele:

### Wohnung

- street required
- postal_code required
- city required
- unit name required
- size optional positive number
- rooms optional positive number

### Mieter

- first_name required
- last_name required
- email optional email
- phone optional string

### Miete

- cold_rent required number >= 0
- utilities optional number >= 0
- due day 1–28

### Kaution

- agreed_amount optional >= 0
- paid_amount optional >= 0
- paid_amount darf agreed_amount überschreiten, aber dann freundliche Warnung anzeigen

### Dokument

- required file
- max 10 MB
- allowed MIME types only

---

## 34. Accessibility

Muss erfüllt sein:

- semantische HTML-Struktur
- sichtbare Focus States
- Buttons sind Buttons, Links sind Links
- Form Labels korrekt verbunden
- ausreichender Kontrast
- Tastaturbedienung möglich
- Dialoge mit Fokus-Falle über shadcn Dialog
- keine Information nur über Farbe vermitteln

---

## 35. Sicherheit

Muss erfüllt sein:

- alle App-Routen geschützt
- RLS in Supabase aktiv
- keine Service Role im Client
- keine ungeprüfte `account_id` aus Forms verwenden
- File Upload MIME/Size validieren
- Storage private bucket
- User sieht nur eigene Account-Daten
- Archivieren statt Löschen
- Audit Logs bei wichtigen Aktionen erstellen

Audit log actions:

- unit.created
- unit.updated
- unit.archived
- tenant.created
- lease.created
- payment.created
- payment.updated
- document.uploaded
- document.archived
- task.created
- task.done

---

## 36. Vercel Deployment

Die App muss für Vercel optimiert sein.

### Build

`pnpm build` muss lokal erfolgreich laufen.

### Environment Variables in Vercel

Erforderlich:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
```

Production:

```bash
NEXT_PUBLIC_APP_URL=https://deine-domain.de
```

### Next.js Config

Nur nötige Konfiguration. Keine experimentellen Flags ohne Grund.

### Runtime

Standard Node.js Runtime verwenden. Keine Edge Runtime für Supabase Server Actions erzwingen.

### README Deploy-Anleitung

README muss enthalten:

1. Supabase-Projekt erstellen
2. Migration ausführen
3. Storage Bucket prüfen
4. Env Vars lokal setzen
5. Lokal starten
6. GitHub mit Vercel verbinden
7. Env Vars in Vercel setzen
8. Deploy ausführen

---

## 37. README Inhalt

Erstelle `README.md` mit:

- Projektbeschreibung
- Tech Stack
- Setup lokal
- Supabase Setup
- Env Vars
- Migration ausführen
- Development starten
- Build prüfen
- Vercel Deploy
- Smoke Test

### Lokale Commands

```bash
pnpm install
cp .env.example .env.local
pnpm supabase start
pnpm supabase db reset
pnpm dev
pnpm build
```

Wenn kein lokales Supabase verwendet wird, erkläre Alternative über Supabase Cloud SQL Editor.

---

## 38. UI Copy

Verwende diese exakte deutsche Richtung.

### Auth

```txt
Willkommen zurück
Melde dich an und behalte deine Wohnungen im Blick.
```

```txt
Konto erstellen
Richte dein Vermieter-Cockpit in wenigen Minuten ein.
```

### Setup

```txt
Lass uns deine erste Wohnung einrichten.
Du kannst alles später ändern.
```

### Dashboard

```txt
Hier siehst du, ob bei deinen Wohnungen alles in Ordnung ist.
```

### Success

```txt
Alles sieht gut aus.
```

### Missing document

```txt
Mietvertrag noch nicht hochgeladen.
```

### Payment open

```txt
Diese Miete ist noch offen.
```

---

## 39. Anti-AI-Slop-Regeln für die Implementierung

Nicht machen:

- keine Farbverläufe
- keine 3D-Illustrationen
- keine Stock-Illustrationen
- keine bunten KPI-Kacheln
- keine riesigen Icons
- keine zufälligen Schatten
- keine übertriebenen Rundungen
- keine unnötigen Animationen
- keine Marketing-Floskeln in der App
- keine Box-in-Box-in-Box Layouts
- keine zehn Schriftgrößen pro Screen
- keine gefakten Demo-Daten im eingeloggten Produktbereich, außer explizit als Empty State

Machen:

- klare Ränder
- viel Weißraum
- wenige Komponenten
- saubere Schriftgrößen
- konsistente Abstände
- eindeutige Hauptaktion
- ruhige Statusanzeigen
- kurze Texte
- funktionale Listen
- mobile-first Bedienbarkeit

---

## 40. Mindestumfang MVP

Der MVP ist fertig, wenn folgende Funktionen produktiv funktionieren:

### Auth

- Registrierung
- Login
- Logout
- geschützte App-Routen

### Onboarding

- erste Wohnung anlegen
- Mieter optional/anlegen
- Mietdaten anlegen
- Kaution optional/anlegen
- Dokument optional hochladen
- danach Dashboard

### Dashboard

- zeigt echte Daten aus Supabase
- zeigt Wohnungen
- zeigt monatliche Mieteinnahmen
- zeigt offene Mieten
- zeigt offene Aufgaben
- zeigt fehlende Dokumente/Aufgaben

### Wohnungen

- Liste
- Detailseite
- neue Wohnung
- archivieren

### Mieter

- Liste
- Detailseite
- bearbeiten

### Zahlungen

- Monatsübersicht
- offene/bezahlt/teilweise Status
- als bezahlt markieren
- Teilzahlung erfassen

### Dokumente

- Upload in Supabase Storage
- Dokument-Metadaten in DB
- Liste anzeigen
- öffnen über signed URL
- archivieren

### Aufgaben

- erstellen
- erledigt markieren
- archivieren
- Vorlagen anbieten

### Sicherheit

- RLS aktiv
- Storage privat
- keine fremden Account-Daten sichtbar

### Deployment

- `pnpm lint` erfolgreich
- `pnpm build` erfolgreich
- Vercel deploybar

---

## 41. Akzeptanztests

Nach Implementierung diese Tests manuell durchführen:

### Test 1: Neuer Nutzer

1. Registrierung öffnen.
2. Konto erstellen.
3. Nach Login landet Nutzer im Setup.
4. Erste Wohnung anlegen.
5. Dashboard zeigt Wohnung und Mietbetrag.

Erwartung:

- keine Fehler
- Account wurde erstellt
- profile existiert
- account_members enthält owner

### Test 2: Vermietete Wohnung

1. Wohnung mit Mieter und Miete erstellen.
2. Zahlungsseite öffnen.
3. Aktueller Monat zeigt offene Miete.
4. „Als bezahlt markieren“ klicken.
5. Status wird „Bezahlt“.

### Test 3: Teilzahlung

1. Neue offene Miete oder bestehende bearbeiten.
2. Teilzahlung erfassen.
3. Status wird „Teilweise“.
4. Dashboard zeigt Restbetrag als offen.

### Test 4: Dokument

1. PDF hochladen.
2. Dokument erscheint in Liste.
3. Dokument öffnen erzeugt signed URL.
4. Dokument archivieren blendet es aus Standardliste aus.

### Test 5: RLS

1. Zweiten User erstellen.
2. Prüfen, dass User 2 keine Daten von User 1 sieht.
3. Direktes Querying über Client darf keine fremden Daten liefern.

### Test 6: Mobile

1. App in mobile viewport öffnen.
2. Bottom Nav sichtbar.
3. Setup bedienbar.
4. Zahlungen bedienbar.
5. Dokument Upload bedienbar.

---

## 42. Implementation Order

Codex soll in dieser Reihenfolge arbeiten:

1. Next.js Projektstruktur prüfen/anlegen.
2. Dependencies installieren.
3. Design Tokens und globals.css einrichten.
4. shadcn/ui Komponenten initialisieren.
5. Supabase Clients und Middleware implementieren.
6. Migration `0001_initial_schema.sql` erstellen.
7. Auth Pages implementieren.
8. App Shell mit Sidebar und Mobile Nav bauen.
9. Data Access Helper bauen.
10. Server Actions mit Zod bauen.
11. Setup Wizard implementieren.
12. Dashboard implementieren.
13. Wohnungen-Liste und Detailseite implementieren.
14. Zahlungen implementieren.
15. Dokumente mit Storage implementieren.
16. Aufgaben implementieren.
17. Mieter implementieren.
18. Einstellungen minimal implementieren.
19. Empty States, Loading States und Toasts ergänzen.
20. README und `.env.example` finalisieren.
21. `pnpm lint` und `pnpm build` ausführen.
22. Fehler beheben, bis Build erfolgreich ist.

---

## 43. Definition of Done

Die Aufgabe ist erst erledigt, wenn:

- die App lokal startet
- Auth funktioniert
- geschützte Routen funktionieren
- Supabase Schema vorhanden ist
- RLS Policies vorhanden sind
- Setup Wizard echte Daten speichert
- Dashboard echte Daten zeigt
- Zahlungen markiert werden können
- Dokumente hochgeladen werden können
- Aufgaben erstellt und erledigt werden können
- UI monochrom, sauber und konsistent ist
- keine generische SaaS-/AI-Slop-Optik sichtbar ist
- `.env.example` vorhanden ist
- README vorhanden ist
- `pnpm build` erfolgreich ist
- Projekt ohne weitere Strukturentscheidungen auf Vercel deploybar ist

---

## 44. Quellen / technische Referenzen

- Next.js App Router Project Structure: https://nextjs.org/docs/app/getting-started/project-structure
- Next.js Environment Variables: https://nextjs.org/docs/app/guides/environment-variables
- Vercel Next.js Deployment: https://vercel.com/docs/frameworks/full-stack/nextjs
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
- Supabase Auth with Next.js App Router: https://supabase.com/docs/guides/auth/quickstarts/nextjs
- Supabase Server-Side Auth: https://supabase.com/docs/guides/auth/server-side
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security

