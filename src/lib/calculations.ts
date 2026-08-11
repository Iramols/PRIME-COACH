export function calculateBmi(
  weightKg: number | null,
  heightCm: number | null,
): number | null {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

// Vetpercentage uit de som van 4 huidplooien (biceps + triceps + subscapulair
// + supra-iliacaal, in mm), naar leeftijd en geslacht — vorm: %vet = a + b *
// log10(som). Dit is dezelfde log-lineaire vorm als de klassieke Durnin &
// Womersley-vergelijking, maar de coëfficiënten hieronder zijn NIET de
// generieke gepubliceerde D&W-constanten: ze zijn met lineaire regressie
// rechtstreeks gefit op elke kolom van de brontabel die de coach heeft
// aangeleverd ("durnin_en_womersley_0 tabel 4 puntsmeting.pdf"), zodat de
// uitkomst van de app exact aansluit bij die specifieke tabel (R² > 0,999
// voor elke combinatie — de tabel is zelf vrijwel perfect log-lineair). De
// tabel vermeldt een foutmarge van +/- 3,5% (vrouwen) en +/- 5% (mannen).
const BODY_FAT_FIT = {
  man: [
    { maxAge: 29, a: -27.7515, b: 27.5242 },
    { maxAge: 39, a: -20.372, b: 24.7052 },
    { maxAge: 49, a: -30.1326, b: 32.2615 },
    { maxAge: Infinity, a: -35.168, b: 36.2994 },
  ],
  vrouw: [
    { maxAge: 29, a: -28.0945, b: 32.2189 },
    { maxAge: 39, a: -22.2457, b: 29.7744 },
    { maxAge: 49, a: -18.6146, b: 29.185 },
    { maxAge: Infinity, a: -19.4432, b: 31.0776 },
  ],
} as const;

export function calculateBodyFatPercent(
  sumOfSkinfoldsMm: number | null,
  age: number | null,
  gender: string | null,
): number | null {
  if (!sumOfSkinfoldsMm || sumOfSkinfoldsMm <= 0 || !age) return null;

  const table =
    gender === "Man" ? BODY_FAT_FIT.man : gender === "Vrouw" ? BODY_FAT_FIT.vrouw : null;
  if (!table) return null;

  const { a, b } = table.find((row) => age <= row.maxAge) ?? table[table.length - 1];
  const bodyFatPct = a + b * Math.log10(sumOfSkinfoldsMm);
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
