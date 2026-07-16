/**
 * Unified unit-of-measure system for Paws & Wings products.
 *
 * CONTINUOUS units → qty picker shows a decimal number input (like weight)
 * DISCRETE  units → qty picker shows integer +/- stepper
 */

export type UnitType =
  | "piece"   // قطعة  – individual items (toys, accessories, collars…)
  | "bag"     // كيس   – sealed bags (dry food, litter, treats)
  | "box"     // علبة  – boxes / packages (wet food cans, medicine boxes)
  | "bottle"  // زجاجة – bottles (shampoo, drops, vitamins)
  | "pack"    // عبوة  – multi-item packs / sets
  | "dose"    // جرعة  – single-use doses / sachets
  | "kg"      // كغ    – weight, sold by the kilogram (continuous)
  | "g"       // غ     – weight in grams (continuous)
  | "l"       // لتر   – volume in litres (continuous)
  | "ml";     // مل    – volume in millilitres (continuous)

/** Units where the customer enters a continuous decimal quantity */
export const CONTINUOUS_UNITS: UnitType[] = ["kg", "g", "l", "ml"];

/** Returns true when the unit needs a decimal input instead of an integer stepper */
export function isContinuousUnit(unit?: string | null): boolean {
  return CONTINUOUS_UNITS.includes(unit as UnitType);
}

/** Short label shown after the price and in the cart  (e.g. "/kg") */
export function unitLabel(unit: string | undefined | null, lang: string): string {
  const labels: Record<string, Record<UnitType, string>> = {
    ar: {
      piece:  "قطعة",
      bag:    "كيس",
      box:    "علبة",
      bottle: "زجاجة",
      pack:   "عبوة",
      dose:   "جرعة",
      kg:     "كغ",
      g:      "غ",
      l:      "لتر",
      ml:     "مل",
    },
    fr: {
      piece:  "pce",
      bag:    "sac",
      box:    "boîte",
      bottle: "flacon",
      pack:   "pack",
      dose:   "dose",
      kg:     "kg",
      g:      "g",
      l:      "L",
      ml:     "mL",
    },
    en: {
      piece:  "pc",
      bag:    "bag",
      box:    "box",
      bottle: "bottle",
      pack:   "pack",
      dose:   "dose",
      kg:     "kg",
      g:      "g",
      l:      "L",
      ml:     "mL",
    },
  };
  const map = labels[lang] ?? labels.en;
  return map[unit as UnitType] ?? (unit ?? "pc");
}

/** Ordered list used in the admin dropdown */
export const UNIT_OPTIONS: { value: UnitType; labelEn: string; labelFr: string; labelAr: string }[] = [
  { value: "piece",  labelEn: "Piece (each)",      labelFr: "Pièce (l'unité)",    labelAr: "قطعة" },
  { value: "bag",    labelEn: "Bag",                labelFr: "Sac",                labelAr: "كيس" },
  { value: "box",    labelEn: "Box / Package",      labelFr: "Boîte / Paquet",     labelAr: "علبة / كرتون" },
  { value: "bottle", labelEn: "Bottle / Vial",      labelFr: "Flacon / Bouteille", labelAr: "زجاجة / فلاكون" },
  { value: "pack",   labelEn: "Pack / Set",         labelFr: "Pack / Ensemble",    labelAr: "عبوة / مجموعة" },
  { value: "dose",   labelEn: "Dose / Sachet",      labelFr: "Dose / Sachet",      labelAr: "جرعة / كيس صغير" },
  { value: "kg",     labelEn: "Kilogram (kg) ⚖️",  labelFr: "Kilogramme (kg) ⚖️", labelAr: "كيلوغرام (كغ) ⚖️" },
  { value: "g",      labelEn: "Gram (g) ⚖️",       labelFr: "Gramme (g) ⚖️",      labelAr: "غرام (غ) ⚖️" },
  { value: "l",      labelEn: "Litre (L) 🧴",       labelFr: "Litre (L) 🧴",       labelAr: "لتر 🧴" },
  { value: "ml",     labelEn: "Millilitre (mL) 🧴", labelFr: "Millilitre (mL) 🧴", labelAr: "مليلتر 🧴" },
];
