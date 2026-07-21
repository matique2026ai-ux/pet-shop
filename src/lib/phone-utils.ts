/**
 * Formats a phone number for WhatsApp wa.me links, specifically handling Algerian numbers.
 * Always returns clean digits without '+' or leading zeros after country code.
 */
export function formatWhatsAppNumber(num: string | undefined | null, fallback = "213776075355"): string {
  const cleanStr = (s: string): string => {
    const cleaned = s.replace(/[^0-9]/g, "");
    
    // Algerian mobile format: 05xx/06xx/07xx (10 digits starting with 0) -> 2135xx/6xx/7xx
    if (cleaned.startsWith("0") && cleaned.length === 10) {
      return "213" + cleaned.slice(1);
    }
    
    // Algerian mobile format with country code and leading 0: 21305xx/6xx/7xx (13 digits) -> 2135xx/6xx/7xx
    if (cleaned.startsWith("2130") && cleaned.length === 13) {
      return "213" + cleaned.slice(4);
    }
    
    // Algerian mobile without leading 0: 5xx/6xx/7xx (9 digits) -> 2135xx/6xx/7xx
    if (/^[567]/.test(cleaned) && cleaned.length === 9) {
      return "213" + cleaned;
    }
    
    return cleaned;
  };

  if (!num) return cleanStr(fallback);
  const result = cleanStr(num);
  return result || cleanStr(fallback);
}

