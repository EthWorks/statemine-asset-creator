export function printItems(items: string[]): string {
  return items.length > 1
    ? items.slice(0, -1).join(', ') + ' and ' + items.slice(-1)
    : items[0]
}
