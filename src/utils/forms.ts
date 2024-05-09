export type DirtyFields<T> = Partial<Record<keyof T, boolean | undefined>>;

export function getDirtyValues<Schema extends Record<string, unknown>>(
  values: Schema,
  dirtyFields: DirtyFields<Schema>
) {
  return Object.fromEntries(
    Object.entries(values).filter(([key, _value]) => dirtyFields[key])
  ) as Schema;
}
