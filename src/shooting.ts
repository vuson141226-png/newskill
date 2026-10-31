import { monthSummary, shootFee, type Days, type Rates } from './logic';
import { assertKm, isSafeMoney, UNSAFE_MONEY_MESSAGE } from './limits';

export function parseKm(text: string): number | null {
  const value = text.trim();
  if (!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(value)) return null;
  const km = Math.max(0, Number(value.replace(',', '.')));
  assertKm(km, '');
  return km;
}

export const formatKm = (km: number) => new Intl.NumberFormat('vi-VN', { useGrouping: false, maximumSignificantDigits: 21 }).format(km);
export const displayDate = (key: string) => {
  const [year, month, day] = key.split('-').map(Number);
  return `${day}/${month}/${year}`;
};

export function latestPlaceKm(days: Days, place: string, exclude?: { key: string; index: number }): number | null {
  const target = place.trim();
  if (!target) return null;
  for (const key of Object.keys(days).sort().reverse()) {
    const shoots = days[key].shoots;
    for (let index = shoots.length - 1; index >= 0; index--) {
      if (key === exclude?.key && index === exclude.index) continue;
      if (shoots[index].place.trim() === target && shoots[index].km !== null) return shoots[index].km;
    }
  }
  return null;
}

export function placeSuggestions(days: Days): string[] {
  return [...new Set(Object.values(days).flatMap(day => day.shoots.map(shoot => shoot.place.trim())).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));
}

export function monthShootRows(days: Days, year: number, month: number, rates: Rates) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  return Object.keys(days).filter(key => key.startsWith(prefix)).sort().flatMap(key =>
    days[key].shoots.map((shoot, index) => ({ key, index, ...shoot, fee: shootFee(shoot.km, rates) })),
  );
}

// Tabs/newlines in a place must not create extra spreadsheet cells or rows.
const tsvCell = (value: string) => value.replace(/[\t\r\n]+/g, ' ');
export function buildShootTsv(days: Days, year: number, month: number, rates: Rates): string {
  const rows = monthShootRows(days, year, month, rates);
  const summary = monthSummary(days, year, month, rates);
  if (!isSafeMoney(summary.total) || !isSafeMoney(summary.fees) || rows.some(row => !isSafeMoney(row.fee))) throw new Error(UNSAFE_MONEY_MESSAGE);
  return [
    ['Ngày', 'Vị trí', 'Km', 'Phí hỗ trợ'],
    ...rows.map(row => [displayDate(row.key), tsvCell(row.place || 'Chưa nhập'), row.km === null ? '—' : formatKm(row.km), String(row.fee)]),
    ['Tổng', '', formatKm(summary.km), String(summary.fees)],
  ].map(row => row.join('\t')).join('\n');
}
