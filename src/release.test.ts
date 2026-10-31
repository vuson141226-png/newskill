import { describe, expect, it } from 'vitest';
import { DEFAULT_RATES as rates, dateKey, initialMonth, monthSummary, shiftMonth, shootFee, weekSummary, type Days } from './logic';
import { backupFilename, parseBackup, serializeData } from './backup';

const days: Days = {
  '2026-11-01': { am: 'seo', pm: null, shoots: [] },
  '2026-11-02': { am: 'seo', pm: 'mkt', shoots: [] },
  '2026-11-03': { am: 'mkt', pm: null, shoots: [{ place: 'Hồ Tây', km: 8 }, { place: 'Ngoại thành', km: 25 }] },
  '2026-11-04': { am: null, pm: 'seo', shoots: [] },
  '2026-11-30': { am: null, pm: 'mkt', shoots: [] },
  '2026-10-30': { am: 'seo', pm: 'seo', shoots: [] },
};
describe('kịch bản chốt phát hành', () => {
  it('tháng 11 đúng 790.000, sáu tuần cộng bằng tháng, tháng 10 đúng 160.000', () => {
    const summary = monthSummary(days, 2026, 10, rates);
    expect(summary.seo.count).toBe(3); expect(summary.mkt.count).toBe(3);
    expect(summary.fees).toBe(250000); expect(summary.total).toBe(790000);
    const weeks = weekSummary(days, 2026, 10, rates);
    expect(weeks.map(week => week.total)).toEqual([80000, 610000, 0, 0, 0, 100000]);
    expect(weeks.reduce((sum, week) => sum + week.total, 0)).toBe(summary.total);
    expect(monthSummary(days, 2026, 9, rates).total).toBe(160000);
  });
  it.each([[4.999, 0], [5.0, 50000], [10.0, 50000], [10.001, 100000], [19.999, 100000], [20.0, 200000]])('km %s → %s đồng nguyên', (km, amount) => {
    const actual = shootFee(km, rates); expect(actual).toBe(amount); expect(Number.isSafeInteger(actual)).toBe(true);
  });
  it.each([[2028, 1, 29], [2027, 1, 28], [2026, 10, 30], [2026, 5, 30]])('tháng %s/%s chia đủ %s ngày, không trùng', (year, month, count) => {
    const weeks = weekSummary({}, year, month, rates);
    const keys = weeks.flatMap(week => week.keys);
    expect(keys).toHaveLength(count); expect(new Set(keys).size).toBe(count);
    expect(keys[0]).toBe(dateKey(year, month, 1)); expect(keys.at(-1)).toBe(dateKey(year, month, count));
  });
  it('đầu tháng Chủ nhật/Thứ hai và đổi năm hai chiều', () => {
    expect(new Date(2026, 10, 1).getDay()).toBe(0); expect(weekSummary({}, 2026, 10, rates)[0].end).toBe(1);
    expect(new Date(2026, 5, 1).getDay()).toBe(1); expect(weekSummary({}, 2026, 5, rates)[0].end).toBe(7);
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 }); expect(shiftMonth(2027, 0, -1)).toEqual({ year: 2026, month: 11 });
  });
  it('ngày địa phương được giữ ở đầu/cuối ngày, kể cả mùa DST; chạy test dưới ba TZ', () => {
    for (const [year, month, day] of [[2026, 10, 1], [2026, 2, 8], [2026, 10, 30], [2028, 1, 29]]) {
      for (const hour of [0, 23]) {
        const date = new Date(year, month, day, hour, 15);
        const expected = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        expect(dateKey(date.getFullYear(), date.getMonth(), date.getDate())).toBe(expected);
        expect(backupFilename(date)).toBe(`chamcong-${expected}.json`);
      }
    }
    expect(initialMonth(new Date(2026, 9, 31))).toEqual({ year: 2026, month: 10 });
  });
  it('xuất/nhập kịch bản không thay đổi dữ liệu và tổng tiền', () => {
    const data = { schemaVersion: 1 as const, rates, days };
    const imported = parseBackup(serializeData(data));
    expect(imported).toEqual(data); expect(monthSummary(imported.days, 2026, 10, imported.rates).total).toBe(790000);
  });
});
