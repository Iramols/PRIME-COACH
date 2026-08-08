// Dropdown-opties: in de specs (specs/specificaties.md) nog niet definitief
// vastgelegd ("nader te bepalen"). Dit zijn werkbare standaardwaarden — pas
// aan zodra de definitieve lijst bekend is.

export const GESLACHT_OPTIES = ["Man", "Vrouw", "Anders"] as const;

export const DOEL_OPTIES = [
  "Afvallen",
  "Meer spiermassa opbouwen",
  "Fitter worden / conditie verbeteren",
  "Gezonder leven algemeen",
  "Huidige vorm onderhouden",
] as const;

export const ACTIVITEITSNIVEAU_OPTIES = [
  "Zittend (nauwelijks beweging)",
  "Licht actief (1-3x/week)",
  "Gematigd actief (3-4x/week)",
  "Actief (5+x/week)",
  "Zeer actief (dagelijks intensief)",
] as const;

export type NavTab = { href: string; label: string };
export type NavGroup = { label: string; children: NavTab[] };

// Tab waar de coach na inloggen / het aanmaken van een klant op landt.
export const DEFAULT_TAB_HREF = "notities";

export const NAV_TABS: (NavTab | NavGroup)[] = [
  { href: "notities", label: "Notities" },
  { href: "resultaten", label: "Resultaten" },
  { href: "lenigheid", label: "Lenigheid" },
  { href: "kracht", label: "Kracht" },
  {
    label: "Uithoudingsvermogen",
    children: [
      { href: "uithoudingsvermogen/max-aeroob", label: "Max aerobe testen" },
      { href: "uithoudingsvermogen/sub-max-aeroob", label: "Sub max aerobe testen" },
      { href: "uithoudingsvermogen/anaeroob", label: "Anaerobe testen" },
    ],
  },
  { href: "snelheid", label: "Snelheid" },
  { href: "coordinatie", label: "Coördinatie" },
];
