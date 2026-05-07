# Vermieter Cockpit

Produktionsnahes MVP fuer private Vermieter mit 1 bis 10 Wohnungen. Die App ist ein ruhiger digitaler Vermieter-Ordner fuer Wohnungen, Mieter, monatliche Mieten, Dokumente und Aufgaben.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-nahe Komponenten
- Supabase Auth
- Supabase PostgreSQL mit RLS
- Supabase Storage fuer private Dokumente
- Server Actions
- Zod
- Vercel

## Lokal starten

```bash
pnpm install
cp .env.example .env.local
pnpm supabase start
pnpm supabase db reset
pnpm dev
```

Wenn `pnpm supabase` nicht verfuegbar ist:

```bash
pnpm dlx supabase start
pnpm dlx supabase db reset
```

Danach die Werte aus Supabase in `.env.local` eintragen:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` wird nicht im Client verwendet.

## Supabase Setup

Die Migration liegt unter:

```txt
supabase/migrations/0001_initial_schema.sql
```

Sie erstellt:

- Profile, Accounts und Account-Mitglieder
- Immobilien, Wohnungen, Mieter, Mietvertraege und Mietverlauf
- Kautionen, offene Mieten, Zahlungen
- Dokumente, Aufgaben, Kommunikation und Audit Logs
- RLS Policies fuer alle Account-Daten
- privaten Storage Bucket `documents`

Mit lokalem Supabase:

```bash
pnpm supabase db reset
```

Mit Supabase Cloud:

1. Neues Supabase-Projekt erstellen.
2. Inhalt von `supabase/migrations/0001_initial_schema.sql` im SQL Editor ausfuehren.
3. Pruefen, dass der private Storage Bucket `documents` vorhanden ist.
4. Auth Redirect URL auf `http://localhost:3000/callback` und spaeter auf die Vercel Domain setzen.

## Development

```bash
pnpm dev
pnpm lint
pnpm build
```

Die App nutzt echte Supabase-Daten. Im geschuetzten Produktbereich werden keine Demo-Daten angezeigt.

## Vercel Deploy

1. Repository zu GitHub pushen.
2. Projekt in Vercel importieren.
3. Environment Variables in Vercel setzen:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
```

4. `NEXT_PUBLIC_APP_URL` auf die Produktionsdomain setzen.
5. Supabase Auth Redirect URL auf `https://deine-domain.de/callback` setzen.
6. Deploy ausfuehren.

## Smoke Test

1. Registrierung oeffnen und Konto erstellen.
2. Login ausfuehren und Setup starten.
3. Erste vermietete Wohnung mit Mieter und Miete anlegen.
4. Dashboard zeigt Wohnung, Monatsmiete und offene Aufgabe.
5. Zahlungsseite oeffnen und aktuelle Miete als bezahlt markieren.
6. PDF oder Bild als Dokument hochladen und oeffnen.
7. Aufgabe erstellen, erledigt markieren und archivieren.
8. Zweiten Nutzer anlegen und pruefen, dass keine fremden Daten sichtbar sind.
9. Mobile Viewport pruefen: Bottom Nav, Setup, Zahlungen und Upload muessen bedienbar sein.
