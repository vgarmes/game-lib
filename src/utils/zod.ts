export const setValueAsNumber = (
  value: string,
  defaultValue?: number | null
) => {
  return parseInt(value) || defaultValue;
};

export const setValueAsDate = (value: string, defaultValue?: Date | null) => {
  if (!value) {
    return defaultValue;
  }
  return new Date(value);
};
