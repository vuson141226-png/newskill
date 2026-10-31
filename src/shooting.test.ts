import { describe, expect, it } from 'vitest';
import { DEFAULT_RATES as rates, type Days } from './logic';
import { buildShootTsv, formatKm, latestPlaceKm, monthShootRows, parseKm, placeSuggestions } from './shooting';
import { DATA_LIMITS } from './limits';

describe('parseKm', () => {
  it.each([
    ['8,5', 8.5], ['8.5', 8.5], ['', null], ['   ', null], ['-3', 0], ['abc', null],
    ['0', 0], ['5', 5], [' 10,1 ', 10.1], [',5', 0.5], ['.5', 0.5], ['-0,5', 0],
    ['8km', null], ['1,2,3', null], ['Infinity', null], ['1e3', null], ['--3', null], ['1 000', null],
  ])('%j → %s', (text, expected) => expect(parseKm(text)).toBe(expected));
  it('định dạng ô km không làm mất độ chính xác khi rời ô mà chưa sửa', () => {
    for (const km of [0, 8.5, 0.0000000001, DATA_LIMITS.km, 0.30000000000000004]) {
      expect(parseKm(formatKm(km))).toBe(km);
    }
  });
});

const fixture = (): Days => ({
  '2026-11-03': { am: 'mkt', pm: null, shoots: [{ place: 'Hồ Tây', km: 8.5 }, { place: 'Phim trường', km: 25 }] },
  '2026-11-02': { am: null, pm: null, shoots: [{ place: '', km: null }] },
  '2026-10-30': { am: null, pm: null, shoots: [{ place: 'Ngoài tháng', km: 20 }] },
});

describe('bảng đi quay và văn bản sao chép', () => {
  it('đủ bốn tiêu đề và dòng Tổng, đúng thứ tự ngày và lần nhập, không gồm tháng khác', () => {
    expect(buildShootTsv(fixture(), 2026, 10, rates)).toBe([
      'Ngày\tVị trí\tKm\tPhí hỗ trợ',
      '2/11/2026\tChưa nhập\t—\t0',
      '3/11/2026\tHồ Tây\t8,5\t50000',
      '3/11/2026\tPhim trường\t25\t200000',
      'Tổng\t\t33,5\t250000',
    ].join('\n'));
  });
  it('bảng rỗng vẫn có tiêu đề và tổng 0', () => {
    expect(buildShootTsv({}, 2026, 10, rates)).toBe('Ngày\tVị trí\tKm\tPhí hỗ trợ\nTổng\t\t0\t0');
  });
  it('thay tab và xuống dòng trong vị trí để giữ đủ bốn cột', () => {
    const days: Days = { '2026-11-01': { am: null, pm: null, shoots: [{ place: 'A\tB\nC\r\nD', km: 10 }] } };
    const text = buildShootTsv(days, 2026, 10, rates);
    expect(text.split('\n')).toHaveLength(3);
    expect(text.split('\n').every(line => line.split('\t').length === 4)).toBe(true);
    expect(text).toContain('A B C D');
  });
  it('gọi phí hiện có, không tính lại quy tắc tiền ở module mới', () => {
    const custom = { ...rates, fee1: 12345, fee3: 234567 };
    const rows = monthShootRows(fixture(), 2026, 10, custom);
    expect(rows.map(row => row.fee)).toEqual([0, 12345, 234567]);
    expect(buildShootTsv(fixture(), 2026, 10, custom)).toContain('Tổng\t\t33,5\t246912');
  });
  it('không sửa dữ liệu nguồn', () => {
    const days = fixture();
    const before = JSON.stringify(days);
    buildShootTsv(days, 2026, 10, rates);
    expect(JSON.stringify(days)).toBe(before);
  });
});

describe('gợi ý vị trí và nhớ khoảng cách', () => {
  it('lấy tất cả các tháng, bỏ vị trí trống và trùng', () => {
    const days = fixture();
    days['2026-11-04'] = { am: null, pm: null, shoots: [{ place: ' Hồ Tây ', km: 7 }] };
    expect(placeSuggestions(days)).toHaveLength(3);
    expect(placeSuggestions(days)).toContain('Ngoài tháng');
  });
  it('ngày mới nhất trước, lần sau cùng trong ngày trước; bỏ km trống', () => {
    const days = fixture();
    days['2026-12-01'] = { am: null, pm: null, shoots: [{ place: 'Hồ Tây', km: 10 }, { place: 'Hồ Tây', km: 0 }, { place: 'Hồ Tây', km: null }] };
    expect(latestPlaceKm(days, ' Hồ Tây ')).toBe(0);
    expect(latestPlaceKm(days, 'Hồ Tây', { key: '2026-12-01', index: 1 })).toBe(10);
    expect(latestPlaceKm(days, 'Chưa từng nhập')).toBeNull();
    expect(latestPlaceKm(days, '')).toBeNull();
  });
});
