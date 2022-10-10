export const setValueAsNumber = (value: string, defaultValue?: number) => {
  return parseInt(value) || defaultValue;
};

export const setValueAsDate = (value: string, defaultValue?: Date) => {
  if (!value) {
    return defaultValue;
  }
  return new Date(value);
};
