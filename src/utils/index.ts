export function toISODateString(date: Date) {
  return date.toISOString().split('T')[0];
}
