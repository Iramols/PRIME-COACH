# Leefstijlcoach App

Web-app voor de coach om klantdossiers te beheren: profiel, notities,
resultaten en test resultaten, met cloud-opslag (Supabase). Zie
`specs/specificaties.md` voor de volledige specificaties.

**Live:** https://prime-coach-seven.vercel.app

## Structuur

- `docs/` — algemene documentatie, notities, achtergrond
- `specs/` — functionele/technische specificaties
- `src/` — broncode (Next.js app)
- `assets/` — afbeeldingen, iconen, overig materiaal
- `supabase/schema.sql` — database schema + Row Level Security policies

## Techniek

- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Cloud-opslag:** [Supabase](https://supabase.com) (Postgres + Auth)
- **Login:** alleen de coach kan inloggen (geen klant-login)

## Eenmalige setup

1. **Supabase-project aanmaken** op [supabase.com](https://supabase.com) (gratis tier is voldoende).
2. **Schema aanmaken**: open in het Supabase-dashboard de "SQL Editor" en
   plak de inhoud van `supabase/schema.sql`. Voer uit.
3. **Coach-account aanmaken**: ga naar Authentication → Users → "Add user"
   en maak een gebruiker aan met jouw e-mailadres en een wachtwoord. Dit is
   het enige account waarmee ingelogd kan worden.
4. **Env-variabelen instellen**: kopieer `.env.local.example` naar
   `.env.local` en vul in:
   - `NEXT_PUBLIC_SUPABASE_URL` — te vinden bij Project Settings → API
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — idem (de "anon public" key)
5. **Installeren en starten**:
   ```
   npm install
   npm run dev
   ```
   De app draait dan op http://localhost:3000 en stuurt automatisch door
   naar de inlogpagina.

## Status van de features

Volledig gebouwd volgens specs:
- Coach-login (Supabase Auth)
- Klantdossiers (aanmaken + wisselen tussen klanten)
- Profielmodal (Naam, Leeftijd, Gewicht, Lengte, Geslacht, Doel, Activiteitsniveau)
- Tab Notities (logboek per datum: Voeding / Training / Bijzonderheden, bewerkbaar/verwijderbaar)
- Tab Resultaten (logboek per datum met automatische BMI-berekening uit profiel)
- Tab Test resultaten (logboek per datum, 3 generieke kolommen)

De tabs Dashboard, Training, Voeding, Coach, Voortgang en Foto's zijn op
verzoek verwijderd uit de app. De navigatie bevat nu alleen: Notities,
Resultaten en Test resultaten.

Let op: de dropdown-opties voor Geslacht, Doel en Activiteitsniveau
(`src/lib/constants.ts`) zijn werkbare aannames — de specs lieten deze nog
open. Pas aan zodra de definitieve lijst bekend is.
