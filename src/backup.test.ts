import { describe, expect, it } from 'vitest';
import { DEFAULT_RATES, emptyData, monthSummary, type Data } from './logic';
import { backupFilename, backupPreview, parseBackup, parseRate, serializeData, validateData } from './backup';

const sample = (): Data => ({ schemaVersion: 1, rates: { ...DEFAULT_RATES }, days: {
  '2026-11-02': { am: 'seo', pm: 'mkt', shoots: [] },
  '2026-11-03': { am: 'mkt', pm: null, shoots: [{ place: 'Hồ Tây', km: 8 }, { place: 'Điểm quay', km: 25 }] },
  '2026-11-04': { am: null, pm: 'seo', shoots: [] },
  '2026-10-30': { am: 'seo', pm: 'seo', shoots: [] },
} });
describe('kiểm tra JSON nhập', () => {
  it('file đúng và bản sao độc lập', () => { const data = sample(); expect(validateData(data)).toEqual(data); expect(validateData(data)).not.toBe(data); });
  it('thiếu schemaVersion', () => { const { schemaVersion, ...data } = sample(); expect(() => validateData(data)).toThrow('Thiếu schemaVersion'); });
  it('phiên bản lạ', () => expect(() => validateData({ ...sample(), schemaVersion: 2 })).toThrow('schemaVersion'));
  it.each(['2026-11-3', '2026/11/03', '2026-02-30', '2026-13-01', '2026-00-01', '2026-11-00'])('ngày sai %s', key => expect(() => validateData({ ...sample(), days: { [key]: { am: null, pm: null, shoots: [] } } })).toThrow('YYYY-MM-DD'));
  it('am = abc', () => { const data = sample(); (data.days['2026-11-02'] as unknown as { am: string }).am = 'abc'; expect(() => validateData(data)).toThrow('2026-11-02.am'); });
  it.each([-1, '8', '', Infinity])('km sai %j', km => expect(() => validateData({ ...sample(), days: { '2026-11-01': { am: null, pm: null, shoots: [{ place: '', km }] } } })).toThrow('.km'));
  it.each(['80000', -1, 1.5, null, Number.MAX_SAFE_INTEGER + 1])('mức tiền sai %j', seo => expect(() => validateData({ ...sample(), rates: { ...DEFAULT_RATES, seo } })).toThrow('rates.seo'));
  it('JSON hỏng', () => expect(() => parseBackup('{broken')).toThrow('JSON hỏng'));
  it('thiếu trường buổi/đi quay', () => expect(() => validateData({ ...sample(), days: { '2026-11-01': { am: null } } })).toThrow('thiếu pm'));
  it('từ chối trường lạ để không âm thầm làm mất dữ liệu', () => expect(() => validateData({ ...sample(), other: true })).toThrow('trường không hỗ trợ'));
  it('vòng tròn xuất–nhập bảo toàn dữ liệu, cả ngày trống/vị trí có khoảng trắng/km null', () => {
    const data = sample(); data.days['2026-11-01'] = { am: null, pm: null, shoots: [] };
    data.days['2026-11-05'] = { am: null, pm: null, shoots: [{ place: '  Địa điểm  ', km: null }] };
    expect(parseBackup(serializeData(data))).toEqual(data);
    expect(parseBackup(serializeData(emptyData()))).toEqual(emptyData());
  });
  it('không sửa nguồn và xem trước đúng ngày/số lần', () => { const data = sample(); const before = JSON.stringify(data); expect(backupPreview(data)).toEqual({ days: 4, shoots: 2, first: '2026-10-30', last: '2026-11-04' }); serializeData(data); expect(JSON.stringify(data)).toBe(before); });
  it('tên file lấy ngày địa phương sau nửa đêm UTC+7', () => expect(backupFilename(new Date(2026, 10, 1, 0, 15))).toBe('chamcong-2026-11-01.json'));
  it('SEO 90.000 làm tháng mẫu từ 610.000 thành 630.000', () => { const data = sample(); expect(monthSummary(data.days, 2026, 10, data.rates).total).toBe(610000); const updated = validateData({ ...data, rates: { ...data.rates, seo: 90000 } }); expect(monthSummary(updated.days, 2026, 10, updated.rates).total).toBe(630000); });
  it.each([['90000', 90000], ['0', 0], [' 80000 ', 80000], ['-1', null], ['', null], ['abc', null], ['1.5', null], ['1e5', null]])('đọc mức tiền %j → %s', (text, result) => expect(parseRate(String(text))).toBe(result));
});
