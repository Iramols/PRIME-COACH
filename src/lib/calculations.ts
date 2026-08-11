export function calculateBmi(
  weightKg: number | null,
  heightCm: number | null,
): number | null {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

// Durnin & Womersley (1974) regressievergelijking voor lichaamsdichtheid uit
// de som van 4 huidplooien (biceps + triceps + subscapulair + supra-iliacaal
// in mm), per leeftijdsgroep en geslacht — omgezet naar vetpercentage via de
// Siri-vergelijking. Dit is dezelfde formule waarmee de klassieke
// Durnin & Womersley opzoektabel (per leeftijd/geslacht) is berekend; de
// tabel zelf vermeldt een foutmarge van +/- 3,5% (vrouwen) en +/- 5%
// (mannen), dus een rechtstreekse formuleberekening valt ruim binnen die
// marge en is nauwkeuriger dan afronden op een tabelrij.
const DW_CONSTANTS = {
  man: [
    { maxAge: 19, c: 1.162, m: 0.063 },
    { maxAge: 29, c: 1.1631, m: 0.0632 },
    { maxAge: 39, c: 1.1422, m: 0.0544 },
    { maxAge: 49, c: 1.162, m: 0.07 },
    { maxAge: Infinity, c: 1.1715, m: 0.0779 },
  ],
  vrouw: [
    { maxAge: 19, c: 1.1549, m: 0.0678 },
    { maxAge: 29, c: 1.1599, m: 0.0717 },
    { maxAge: 39, c: 1.1423, m: 0.0632 },
    { maxAge: 49, c: 1.1333, m: 0.0612 },
    { maxAge: Infinity, c: 1.1339, m: 0.0645 },
  ],
} as const;

export function calculateBodyFatPercent(
  sumOfSkinfoldsMm: number | null,
  age: number | null,
  gender: string | null,
): number | null {
  if (!sumOfSkinfoldsMm || sumOfSkinfoldsMm <= 0 || !age) return null;

  const table =
    gender === "Man" ? DW_CONSTANTS.man : gender === "Vrouw" ? DW_CONSTANTS.vrouw : null;
  if (!table) return null;

  const { c, m } = table.find((row) => age <= row.maxAge) ?? table[table.length - 1];
  const bodyDensity = c - m * Math.log10(sumOfSkinfoldsMm);
  const bodyFatPct = 495 / bodyDensity - 450;
  return Math.round(bodyFatPct * 10) / 10;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("nl-NL");
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
