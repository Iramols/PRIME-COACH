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

export const NAV_TABS = [
  { href: "notities", label: "Notities" },
  { href: "resultaten", label: "Resultaten" },
  { href: "test-resultaten", label: "Test resultaten" },
] as const;
