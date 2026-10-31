export type Session = 'seo' | 'mkt' | null;
export type Rates = { seo: number; mkt: number; fee1: number; fee2: number; fee3: number };
export type Shoot = { place: string; km: number | null };
export type Day = { am: Session; pm: Session; shoots: Shoot[] };
export type Days = Record<string, Day>;
export type Data = { schemaVersion: 1; rates: Rates; days: Days };
export const DEFAULT_RATES: Rates = { seo: 80000, mkt: 100000, fee1: 50000, fee2: 100000, fee3: 200000 };
export const emptyDay = (): Day => ({ am: null, pm: null, shoots: [] });
export const emptyData = (): Data => ({ schemaVersion: 1, rates: { ...DEFAULT_RATES }, days: {} });
export const money = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)} ₫`;

// month is zero-based, matching the local Date constructor everywhere.
export function dateKey(year: number, month: number, day: number): string {
  const date = new Date(year, month, day);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function shiftMonth(year: number, month: number, delta: number) {
  const date = new Date(year, month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}
export function initialMonth(today = new Date()) {
  return today < new Date(2026, 10, 1) ? { year: 2026, month: 10 } : { year: today.getFullYear(), month: today.getMonth() };
}

export function shootFee(km: number | string | null | undefined, rates: Rates): number {
  if (km === null || km === undefined || (typeof km === 'string' && !km.trim())) return 0;
  const distance = Number(km);
  if (!Number.isFinite(distance) || distance < 5) return 0;
  // Exactly 10 km belongs to fee1; exactly 20 km belongs to fee3.
  if (distance <= 10) return rates.fee1;
  return distance < 20 ? rates.fee2 : rates.fee3;
}

export type Summary = {
  seo: { am: number; pm: number; count: number; amount: number };
  mkt: { am: number; pm: number; count: number; amount: number };
  workingDays: number; am: number; pm: number; shootCount: number; km: number; fees: number; total: number;
};
export function summarize(days: Day[], rates: Rates): Summary {
  const summary: Summary = {
    seo: { am: 0, pm: 0, count: 0, amount: 0 }, mkt: { am: 0, pm: 0, count: 0, amount: 0 },
    workingDays: 0, am: 0, pm: 0, shootCount: 0, km: 0, fees: 0, total: 0,
  };
  for (const day of days) {
    // A shooting-only day is a working day, even when support is zero.
    if (day.am || day.pm || day.shoots.length) summary.workingDays++;
    for (const slot of ['am', 'pm'] as const) {
      const job = day[slot];
      if (job) { summary[job][slot]++; summary[job].count++; summary[slot]++; }
    }
    for (const shoot of day.shoots) {
      summary.shootCount++;
      summary.km += shoot.km ?? 0;
      summary.fees += shootFee(shoot.km, rates);
    }
  }
  // Money is always integer VND; only the km display needs decimal rounding.
  summary.seo.amount = summary.seo.count * rates.seo;
  summary.mkt.amount = summary.mkt.count * rates.mkt;
  summary.total = summary.seo.amount + summary.mkt.amount + summary.fees;
  summary.km = Math.round(summary.km * 1e9) / 1e9;
  return summary;
}
export const daySummary = (day: Day, rates: Rates) => summarize([day], rates);
export function monthSummary(days: Days, year: number, month: number, rates: Rates): Summary {
  const count = new Date(year, month + 1, 0).getDate();
  return summarize(Array.from({ length: count }, (_, index) => days[dateKey(year, month, index + 1)]).filter((day): day is Day => !!day), rates);
}
export function weekSummary(days: Days, year: number, month: number, rates: Rates) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: Math.ceil((offset + count) / 7) }, (_, index) => {
    const start = Math.max(1, index * 7 - offset + 1);
    const end = Math.min(count, index * 7 - offset + 7);
    const keys = Array.from({ length: end - start + 1 }, (_, n) => dateKey(year, month, start + n));
    return { number: index + 1, start, end, keys, ...summarize(keys.map(key => days[key]).filter((day): day is Day => !!day), rates) };
  });
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Dữ liệu phải là một đối tượng JSON.');
  return value as Record<string, unknown>;
}
function nonNegative(value: unknown, label: string, integer = false): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (integer && !Number.isSafeInteger(value))) {
    throw new Error(`${label} phải là số ${integer ? 'nguyên ' : ''}không âm hợp lệ.`);
  }
  return value;
}
function session(value: unknown): Session {
  if (value === 'seo' || value === 'mkt' || value === null) return value;
  throw new Error('Buổi làm chỉ nhận SEO, Marketing hoặc nghỉ.');
}
function validDate(key: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const [y, m, d] = key.split('-').map(Number);
  return y >= 1000 && dateKey(y, m - 1, d) === key;
}

// Validate the entire import first. Never silently drop corrupt or unrepresentable days.
export function normalize(input: unknown): Data {
  const raw = object(input);
  if (raw.schemaVersion !== undefined && raw.schemaVersion !== 0 && raw.schemaVersion !== 1) throw new Error('Phiên bản dữ liệu chưa được hỗ trợ.');
  const legacy = raw.schemaVersion !== 1;
  const rates = { ...DEFAULT_RATES };
  if (raw.rates !== undefined) {
    const source = object(raw.rates);
    for (const key of Object.keys(rates) as (keyof Rates)[]) {
      if (source[key] === undefined && legacy) continue;
      rates[key] = nonNegative(source[key], `Mức ${key}`, true);
    }
  } else if (!legacy) throw new Error('Thiếu mức lương.');
  if (raw.days === undefined) throw new Error('Thiếu danh sách ngày.');
  const days: Days = {};
  for (const [key, value] of Object.entries(object(raw.days))) {
    if (!validDate(key)) throw new Error(`Ngày không hợp lệ: ${key}`);
    const source = object(value);
    let am: Session, pm: Session;
    if (legacy && source.am === undefined && source.pm === undefined) {
      const seo = nonNegative(source.seo ?? 0, `Số buổi SEO ${key}`, true);
      const mkt = nonNegative(source.mkt ?? 0, `Số buổi Marketing ${key}`, true);
      if (seo + mkt > 2) throw new Error(`${key} có hơn 2 buổi. Hãy đối chiếu dữ liệu cũ trước khi nhập; dữ liệu hiện tại được giữ nguyên.`);
      const slots: Session[] = [...Array<Session>(seo).fill('seo'), ...Array<Session>(mkt).fill('mkt')];
      [am, pm] = [slots[0] ?? null, slots[1] ?? null];
    } else { am = session(source.am); pm = session(source.pm); }
    if (!legacy && source.shoots === undefined) throw new Error(`Thiếu danh sách đi quay ${key}.`);
    const rawShoots = source.shoots ?? [];
    if (!Array.isArray(rawShoots)) throw new Error('Danh sách đi quay không hợp lệ.');
    const shoots = rawShoots.map(value => {
      const shoot = object(value);
      if (typeof shoot.place !== 'string') throw new Error('Vị trí phải là văn bản.');
      return { place: shoot.place.trim(), km: shoot.km === null || shoot.km === '' ? null : nonNegative(shoot.km, 'Khoảng cách') };
    });
    if (am || pm || shoots.length) days[key] = { am, pm, shoots };
  }
  return { schemaVersion: 1, rates, days };
}
export const migrate = normalize;
