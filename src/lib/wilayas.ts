export const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
  "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger",
  "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
  "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
  "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès",
  "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa", "Aflou",
  "Barika", "El Eulma", "Aïn Oussera", "Bou Saâda", "Ksar Chellala", "M'Sila Ouest", "Maghnia",
  "Tighennif", "Lakhdaria", "Gouraya"
];

export const WILAYAS_AR = [
  "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار",
  "البليدة", "البويرة", "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر",
  "الجلفة", "جيجل", "سطيف", "سعيدة", "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة",
  "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة", "وهران", "البيض",
  "إيليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي",
  "خنشلة", "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت",
  "غرداية", "غليزان", "تيميمون", "برج باجي مختار", "أولاد جلال", "بني عباس",
  "عين صالح", "عين قزام", "تقرت", "جانت", "المغير", "المنيعة", "أفلو",
  "بريكة", "العلمة", "عين وسارة", "بوسعادة", "قصر الشلالة", "المسيلة غرب", "مغنية",
  "تيغنيف", "الأخضرية", "قوراية"
];

export function getNumberedWilayaLabel(index: number, lang = "ar"): string {
  const code = (index + 1).toString().padStart(2, "0");
  const nameFr = WILAYAS[index] || "";
  const nameAr = WILAYAS_AR[index] || nameFr;
  if (lang === "ar") return `${code} - ${nameAr} (${nameFr})`;
  if (lang === "fr") return `${code} - ${nameFr} (${nameAr})`;
  return `${code} - ${nameFr}`;
}

export function isSetifWilaya(w: string): boolean {
  if (!w) return false;
  const norm = w.trim().toLowerCase();
  return norm === "sétif" || norm === "setif" || norm === "سطيف" || norm === "19" || norm.includes("سطيف") || norm.includes("setif");
}
