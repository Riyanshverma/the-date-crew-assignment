/**
 * Formats enum strings into human-friendly text.
 * Example: NEVER_MARRIED -> "Never Married", SELF_EMPLOYED -> "Self Employed"
 */
export function formatEnumText(val: string | null | undefined): string {
  if (!val) return "Not specified";
  return val
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Formats annual INR income into readable Indian numbering or Lakhs.
 */
export function formatAnnualIncome(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return "Not specified";
  }
  return `₹${amount.toLocaleString("en-IN")} / year`;
}

/**
 * Formats date into readable format (e.g., "14 Feb 1992").
 */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "Not specified";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch {
    return isoString;
  }
}
