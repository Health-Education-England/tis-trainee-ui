export function isDeepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const aEntries = Object.entries(a);
  const bRecord = b as Record<string, unknown>;
  return (
    aEntries.length === Object.keys(bRecord).length &&
    aEntries.every(
      ([key, value]) => key in bRecord && isDeepEqual(value, bRecord[key])
    )
  );
}
