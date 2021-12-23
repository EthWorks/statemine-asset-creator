export function countUtf8Bytes(str: string): number {
  return new Blob([str]).size
}
