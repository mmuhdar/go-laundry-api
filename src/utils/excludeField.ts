export function excludeField<Field, Key extends keyof Field>(
  field: Field,
  keys: Key[],
): Omit<Field, Key> {
  if (!field) return null;
  for (const key of keys) {
    delete field[key];
  }
  return field;
}
