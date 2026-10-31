import { dateKey, type Data, type Day, type Rates } from './logic';
import { assertKm, assertRate, assertShootCount } from './limits';

const rateKeys = ['seo', 'mkt', 'fee1', 'fee2', 'fee3'] as const;
function record(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${path} phải là một đối tượng JSON.`);
  return value as Record<string, unknown>;
}
function fields(value: Record<string, unknown>, expected: readonly string[], path: string) {
  for (const key of expected) if (!Object.hasOwn(value, key)) throw new Error(`${path}: thiếu ${key}.`);
  for (const key of Object.keys(value)) if (!expected.includes(key)) throw new Error(`${path}: trường không hỗ trợ ${key}.`);
}

export function validateData(input: unknown): Data {
  const root = record(input, 'Dữ liệu');
  if (!Object.hasOwn(root, 'schemaVersion')) throw new Error('Thiếu schemaVersion. File nhập phải có schemaVersion: 1.');
  if (root.schemaVersion !== 1) throw new Error('schemaVersion không hỗ trợ. Chỉ nhận phiên bản 1.');
  fields(root, ['schemaVersion', 'rates', 'days'], 'Dữ liệu');
  const rawRates = record(root.rates, 'rates');
  fields(rawRates, rateKeys, 'rates');
  const rates = {} as Rates;
  for (const key of rateKeys) {
    const value = rawRates[key];
    assertRate(value, `rates.${key}`);
    rates[key] = value;
  }
  const days: Data['days'] = {};
  for (const [key, value] of Object.entries(record(root.days, 'days'))) {
    const [year, month, day] = key.split('-').map(Number);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || year < 1000 || dateKey(year, month - 1, day) !== key) throw new Error(`days.${key}: ngày phải có dạng YYYY-MM-DD và tồn tại trên lịch.`);
    const entry = record(value, `days.${key}`);
    fields(entry, ['am', 'pm', 'shoots'], `days.${key}`);
    for (const slot of ['am', 'pm']) if (entry[slot] !== null && entry[slot] !== 'seo' && entry[slot] !== 'mkt') throw new Error(`days.${key}.${slot} chỉ nhận "seo", "mkt" hoặc null.`);
    if (!Array.isArray(entry.shoots)) throw new Error(`days.${key}.shoots phải là danh sách.`);
    assertShootCount(entry.shoots.length, `days.${key}.shoots`);
    const shoots = entry.shoots.map((value, index) => {
      const path = `days.${key}.shoots[${index}]`;
      const shoot = record(value, path);
      fields(shoot, ['place', 'km'], path);
      if (typeof shoot.place !== 'string') throw new Error(`${path}.place phải là văn bản.`);
      assertKm(shoot.km, `${path}.km`);
      return { place: shoot.place, km: shoot.km as number | null };
    });
    // Preserve accepted JSON exactly, including empty days and place whitespace.
    days[key] = { am: entry.am, pm: entry.pm, shoots } as Day;
  }
  return { schemaVersion: 1, rates, days };
}

export function parseBackup(text: string): Data {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { throw new Error('JSON hỏng hoặc không đúng cú pháp. Hãy chọn file JSON đã xuất từ ứng dụng.'); }
  return validateData(raw);
}
export const serializeData = (data: Data) => JSON.stringify(validateData(data), null, 2);
export function backupFilename(today = new Date()) {
  return `chamcong-${dateKey(today.getFullYear(), today.getMonth(), today.getDate())}.json`;
}
export function backupPreview(data: Data) {
  const keys = Object.keys(data.days).sort();
  return { days: keys.length, shoots: Object.values(data.days).reduce((sum, day) => sum + day.shoots.length, 0), first: keys[0] ?? null, last: keys.at(-1) ?? null };
}
export function parseRate(text: string): number | null {
  const trimmed = text.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  try { assertRate(value, 'Mức tiền'); return value; } catch { return null; }
}
