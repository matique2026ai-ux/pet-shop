/**
 * Formats a phone number for WhatsApp wa.me links, specifically handling Algerian numbers.
 */
export function formatWhatsAppNumber(num: string | undefined | null, fallback = "213555123456"): string {
  if (!num) return fallback;
  
  // Strip all non-digits
  const cleaned = num.replace(/[^0-9]/g, "");
  
  // Algerian mobile format: 05xx xx xx xx, 06xx xx xx xx, 07xx xx xx xx (10 digits starting with 0)
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return "213" + cleaned.slice(1);
  }
  
  // Algerian mobile without leading 0: 5xx xx xx xx, 6xx etc (9 digits)
  if (/^[567]/.test(cleaned) && cleaned.length === 9) {
    return "213" + cleaned;
  }
  
  return cleaned || fallback;
}
