export function toISODateString(date: Date) {
  return date.toISOString().split('T')[0];
}

export function groupBy<T>(objectArray: T[], property: keyof T & string) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property] as unknown as string;
    const curGroup = acc[key] ?? [];

    return { ...acc, [key]: [...curGroup, obj] };
  }, {} as { [k: string]: T[] });
}
