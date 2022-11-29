type ParsedId =
  | { numId: number; isValidId: true }
  | { numId: undefined; isValidId: false };

const parseId = (id?: string | string[]): ParsedId => {
  if (!id || typeof id !== 'string') {
    return { numId: undefined, isValidId: false };
  }

  const isValidId = !!id && !isNaN(parseInt(id));
  if (!isValidId) {
    return { numId: undefined, isValidId: false };
  }

  return { numId: parseInt(id), isValidId: true };
};

export default parseId;
