export type DirtyFields<T> = Partial<Record<keyof T, boolean | undefined>>;

export function getDirtyValues<Schema extends Record<string, any>>(
  values: Schema,
  dirtyFields: DirtyFields<Schema>
) {
  return Object.fromEntries(
    Object.entries(values).filter(([key, value]) => dirtyFields[key])
  ) as Schema;
}
