/**
 * Chunk an array in to slices of the given size.
 * @param arr The array to chunk.
 * @param size The size of each slice.
 * @returns The chunked array.
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
