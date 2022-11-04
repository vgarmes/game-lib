export type ValidDirtyFields<T> = Record<keyof T, boolean | undefined>;

export function getDirtyValues<Schema extends Record<string, any>>(
  values: Schema,
  dirtyFields: ValidDirtyFields<Schema>
) {
  return Object.fromEntries(
    Object.entries(values).filter(([key, value]) => dirtyFields[key])
  ) as Schema;
}
