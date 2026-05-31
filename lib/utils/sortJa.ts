export function sortJapanese(names: string[]): string[] {
  return [...names].sort((a, b) => a.localeCompare(b, "ja"));
}
