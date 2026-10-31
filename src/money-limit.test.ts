import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { dateKey, daySummary, emptyData, monthSummary, weekSummary, type Data } from './logic';
import { parseBackup, parseRate, serializeData, validateData } from './backup';
import { DATA_LIMITS, KM_LIMIT_MESSAGE, RATE_LIMIT_MESSAGE, SHOOT_LIMIT_MESSAGE, UNSAFE_MONEY_MESSAGE } from './limits';
import { parseKm } from './shooting';
import { CORRUPT_PREFIX, STORAGE_KEY, UNDO_KEY, quarantineStored, readStored, writeImport, type StoragePort } from './storage';
import SafeMoney from './SafeMoney';

const rateNames = ['seo', 'mkt', 'fee1', 'fee2', 'fee3'] as const;
function oneDay(shootCount = 1): Data {
  return { ...emptyData(), days: { '2026-11-01': { am: 'seo', pm: 'mkt', shoots: Array.from({ length: shootCount }, () => ({ place: 'Điểm quay', km: DATA_LIMITS.km })) } } };
}
function fakeStorage(data: unknown) {
  const raw = JSON.stringify(data);
  const items = new Map([[STORAGE_KEY, raw]]);
  const writes: string[] = [];
  const storage: StoragePort = { getItem: key => items.get(key) ?? null, setItem: (key, value) => { writes.push(key); items.set(key, value); }, removeItem: key => { items.delete(key); } };
  return { raw, items, storage, writes };
}
function assertArchived(data: unknown, field: string, limit: string) {
  const { raw, items, storage, writes } = fakeStorage(data);
  const state = readStored(storage);
  expect(state.data).toEqual(emptyData()); expect(state.corruptRaw).toBe(raw);
  expect(state.notice).toContain(field); expect(state.notice).toContain(limit);
  expect(writes).toEqual([]); expect(items.get(STORAGE_KEY)).toBe(raw);
  const archive = quarantineStored(storage, raw, 123);
  expect(archive.startsWith(CORRUPT_PREFIX)).toBe(true); expect(items.get(archive)).toBe(raw);
  expect(parseBackup(items.get(STORAGE_KEY)!)).toEqual(emptyData());
}

describe('giới hạn mức tiền ở Cài đặt và file nhập', () => {
  it.each(rateNames)('%s: chấp nhận đúng 100 triệu, từ chối vượt trần', name => {
    expect(parseRate(String(DATA_LIMITS.rate))).toBe(DATA_LIMITS.rate);
    expect(parseRate(String(DATA_LIMITS.rate + 1))).toBeNull();
    const data = oneDay(); data.rates[name] = DATA_LIMITS.rate;
    expect(validateData(data).rates[name]).toBe(DATA_LIMITS.rate);
    data.rates[name]++;
    expect(() => parseBackup(JSON.stringify(data))).toThrow(`rates.${name}`);
    expect(() => validateData(data)).toThrow(RATE_LIMIT_MESSAGE);
  });
  it('mọi mức bằng 0 vẫn hợp lệ', () => {
    const data = oneDay(); for (const key of rateNames) data.rates[key] = 0;
    expect(validateData(data)).toEqual(data);
    expect(parseRate('0')).toBe(0);
  });
});

describe('giới hạn km và số lần quay', () => {
  it('ô km nhận đúng 1.000 và từ chối số lớn hơn, kể cả chuỗi số tràn Number', () => {
    expect(parseKm(String(DATA_LIMITS.km))).toBe(DATA_LIMITS.km);
    expect(parseKm('999,999')).toBe(999.999);
    expect(() => parseKm(String(DATA_LIMITS.km + 1))).toThrow(KM_LIMIT_MESSAGE);
    expect(() => parseKm('9'.repeat(400))).toThrow(KM_LIMIT_MESSAGE);
  });
  it('file nhận 1.000 km và null; từ chối vượt trần, nêu rõ trường', () => {
    const data = oneDay(); expect(parseBackup(serializeData(data))).toEqual(data);
    data.days['2026-11-01'].shoots[0].km = DATA_LIMITS.km + 1;
    expect(() => parseBackup(JSON.stringify(data))).toThrow('days.2026-11-01.shoots[0].km');
    expect(() => validateData(data)).toThrow(KM_LIMIT_MESSAGE);
    data.days['2026-11-01'].shoots[0].km = null;
    expect(validateData(data)).toEqual(data);
  });
  it('20 lần hợp lệ, 21 lần bị từ chối nguyên file', () => {
    const atLimit = oneDay(DATA_LIMITS.shootsPerDay);
    expect(parseBackup(serializeData(atLimit))).toEqual(atLimit);
    const over = oneDay(DATA_LIMITS.shootsPerDay + 1);
    expect(() => parseBackup(JSON.stringify(over))).toThrow('days.2026-11-01.shoots');
    expect(() => validateData(over)).toThrow(SHOOT_LIMIT_MESSAGE);
  });
  it('file vi phạm không ghi đè khóa chính hoặc bản hoàn tác', () => {
    const original = oneDay(); const { items, storage, writes } = fakeStorage(original);
    items.set(UNDO_KEY, 'prior backup'); const raw = items.get(STORAGE_KEY);
    expect(() => writeImport(storage, original, oneDay(DATA_LIMITS.shootsPerDay + 1))).toThrow(SHOOT_LIMIT_MESSAGE);
    expect(writes).toEqual([]); expect(items.get(STORAGE_KEY)).toBe(raw); expect(items.get(UNDO_KEY)).toBe('prior backup');
  });
});

describe('đọc localStorage vượt giới hạn', () => {
  it.each(rateNames)('mức %s vượt trần được sao lưu nguyên văn', name => {
    const data = oneDay(); data.rates[name] = DATA_LIMITS.rate + 1;
    assertArchived(data, `rates.${name}`, '100.000.000');
  });
  it('km vượt trần được sao lưu nguyên văn', () => { const data = oneDay(); data.days['2026-11-01'].shoots[0].km = DATA_LIMITS.km + 1; assertArchived(data, '.km', '1.000'); });
  it('quá 20 lần được sao lưu nguyên văn', () => assertArchived(oneDay(DATA_LIMITS.shootsPerDay + 1), '.shoots', String(DATA_LIMITS.shootsPerDay)));
  it('chuyển đổi dữ liệu cũ không bỏ qua giới hạn', () => {
    const old = { rates: { ...emptyData().rates, seo: DATA_LIMITS.rate + 1 }, days: { '2026-11-01': { seo: 1, mkt: 0, shoots: [] } } };
    assertArchived(old, 'rates.seo', '100.000.000');
  });
  it('đúng cả ba giới hạn thì đọc nguyên vẹn, không tạo bản sao hỏng', () => {
    const data = oneDay(DATA_LIMITS.shootsPerDay); for (const name of rateNames) data.rates[name] = DATA_LIMITS.rate;
    const { storage, writes } = fakeStorage(data); const state = readStored(storage);
    expect(state.data).toEqual(data); expect(state.corruptRaw).toBeNull(); expect(state.canPersist).toBe(true); expect(writes).toEqual([]);
  });
  it('bản hoàn tác cũ vượt giới hạn cũng được giữ sang khóa sao lưu', () => {
    const valid = oneDay(); const invalid = oneDay(DATA_LIMITS.shootsPerDay + 1);
    const { storage, items } = fakeStorage(valid); const raw = JSON.stringify(invalid); items.set(UNDO_KEY, raw);
    const state = readStored(storage); expect(state.undo).toBeNull(); expect(state.corruptUndoRaw).toBe(raw);
    const archive = quarantineStored(storage, raw, 123, UNDO_KEY);
    expect(items.get(archive)).toBe(raw); expect(items.has(UNDO_KEY)).toBe(false); expect(readStored(storage).data).toEqual(valid);
  });
});

it('tháng 31 ngày tại cả ba giới hạn: 68,2 tỷ đồng vẫn chính xác và an toàn', () => {
  const data = emptyData(); for (const name of rateNames) data.rates[name] = DATA_LIMITS.rate;
  for (let day = 1; day <= 31; day++) data.days[dateKey(2026, 11, day)] = oneDay(DATA_LIMITS.shootsPerDay).days['2026-11-01'];
  const valid = parseBackup(serializeData(data));
  const summary = monthSummary(valid.days, 2026, 11, valid.rates);
  const expected = (2n + BigInt(DATA_LIMITS.shootsPerDay)) * 31n * BigInt(DATA_LIMITS.rate);
  expect(summary.total).toBe(68200000000); expect(Number.isSafeInteger(summary.total)).toBe(true); expect(BigInt(summary.total)).toBe(expected);
  const weeks = weekSummary(valid.days, 2026, 11, valid.rates);
  expect(weeks.every(week => Number.isSafeInteger(week.total))).toBe(true);
  expect(weeks.reduce((sum, week) => sum + week.total, 0)).toBe(summary.total);
  for (const day of Object.values(valid.days)) expect(Number.isSafeInteger(daySummary(day, valid.rates).total)).toBe(true);
});

describe('lớp phòng thủ hiển thị tiền', () => {
  it.each([Number.MAX_SAFE_INTEGER + 1, Infinity, NaN, 1.5, -1])('ẩn số không an toàn %s và hiện cảnh báo', value => {
    const html = renderToStaticMarkup(createElement(SafeMoney, { value }));
    expect(html).toContain(UNSAFE_MONEY_MESSAGE); expect(html).toContain('role="status"');
    expect(html).not.toContain('₫');
  });
  it('tổng hợp lệ vẫn định dạng nguyên đồng vi-VN', () => expect(renderToStaticMarkup(createElement(SafeMoney, { value: 68200000000 }))).toBe('68.200.000.000 ₫'));
});
