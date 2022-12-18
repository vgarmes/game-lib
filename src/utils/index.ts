export function toISODateString(date: Date) {
  return date.toISOString().split('T')[0];
}

export function groupBy<T extends Record<K, any>, K extends string>(
  objectArray: T[],
  property: K
) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    const curGroup = acc[key] ?? [];

    return { ...acc, [key]: [...curGroup, obj] };
  }, {} as Record<T[K], T[]>);
}
