export function normalizeRut(value: string): string {
  const cleaned = value.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
  const withoutDash = cleaned.replace(/-/g, '');
  if (withoutDash.length < 2) return cleaned;
  return `${withoutDash.slice(0, -1)}-${withoutDash.slice(-1)}`;
}

export function isValidChileanRut(value: string): boolean {
  const normalized = normalizeRut(value);
  const match = /^(\d{7,8})-([0-9K])$/.exec(normalized);
  if (!match) return false;

  const body = match[1];
  const providedDigit = match[2];
  if (!body || !providedDigit) return false;

  let sum = 0;
  let multiplier = 2;
  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const result = 11 - (sum % 11);
  const expectedDigit = result === 11 ? '0' : result === 10 ? 'K' : String(result);
  return providedDigit === expectedDigit;
}
