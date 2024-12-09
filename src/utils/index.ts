export function dateToLocalWithoutTime(utcDate: Date) {
  return new Date(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate());
}

export function dateToUtcWithoutTime(date: Date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

export function groupBy<T, K>(
  array: T[],
  keySelector: (item: T) => K
): Map<K, T[]> {
  const map = new Map<K, T[]>();
  array.forEach((item) => {
    const key = keySelector(item);
    const group = map.get(key);
    if (group) {
      group.push(item);
    } else {
      map.set(key, [item]);
    }
  });
  return map;
}
