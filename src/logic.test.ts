import { describe, expect, it } from 'vitest';
import { DEFAULT_RATES as rates, dateKey, daySummary, emptyData, initialMonth, migrate, money, monthSummary, normalize, shiftMonth, shootFee, weekSummary, type Days } from './logic';

const sample = (): Days => ({
  '2026-11-02': { am: 'seo', pm: 'mkt', shoots: [] },
  '2026-11-03': { am: 'mkt', pm: null, shoots: [{ place: 'Hồ Tây', km: 8 }, { place: 'Điểm quay', km: 25 }] },
  '2026-11-04': { am: null, pm: 'seo', shoots: [] },
  '2026-10-30': { am: 'seo', pm: 'seo', shoots: [] },
});

describe('shootFee: các mốc km cố định', () => {
  it.each([
    [0, 0], [4.9, 0], [5, 50000], [8, 50000], [10, 50000],
    [10.1, 100000], [19.9, 100000], [20, 200000], [35, 200000],
    [null, 0], ['', 0], ['  ', 0], [undefined, 0],
  ])('%s km → %s đồng', (km, fee) => expect(shootFee(km, rates)).toBe(fee));
  it('dùng mức tùy chỉnh nhưng giữ nguyên mốc', () => {
    const custom = { ...rates, fee1: 12345, fee2: 67890, fee3: 234567 };
    expect([5, 10, 10.1, 20].map(km => shootFee(km, custom))).toEqual([12345, 12345, 67890, 234567]);
  });
});

describe('tổng hợp tiền', () => {
  it('khớp toàn bộ dữ liệu mẫu tháng 11/2026, loại tháng 10', () => {
    expect(monthSummary(sample(), 2026, 10, rates)).toEqual({
      seo: { count: 2, am: 1, pm: 1, amount: 160000 },
      mkt: { count: 2, am: 1, pm: 1, amount: 200000 },
      workingDays: 3, am: 2, pm: 2, shootCount: 2, km: 33, fees: 250000, total: 610000,
    });
  });
  it('sáu tuần tháng 11 cộng đúng 790.000 đồng', () => {
    const days = sample();
    days['2026-11-01'] = { am: 'seo', pm: null, shoots: [] };
    days['2026-11-30'] = { am: null, pm: 'mkt', shoots: [] };
    const weeks = weekSummary(days, 2026, 10, rates);
    expect(weeks.map(week => week.total)).toEqual([80000, 610000, 0, 0, 0, 100000]);
    expect(weeks.map(({ start, end }) => [start, end])).toEqual([[1, 1], [2, 8], [9, 15], [16, 22], [23, 29], [30, 30]]);
    expect(weeks.reduce((sum, week) => sum + week.total, 0)).toBe(monthSummary(days, 2026, 10, rates).total);
    expect(weeks.reduce((sum, week) => sum + week.total, 0)).toBe(790000);
  });
  it('đếm ngày chỉ đi quay và không tự thêm buổi Marketing', () => {
    const result = daySummary({ am: null, pm: null, shoots: [{ place: 'Gần nhà', km: 4 }] }, rates);
    expect(result.workingDays).toBe(1);
    expect(result.mkt.count).toBe(0);
    expect(result.total).toBe(0);
  });
  it('tính lại ngay khi mức lương thay đổi', () => {
    expect(monthSummary(sample(), 2026, 10, { ...rates, seo: 90000, mkt: 120000, fee1: 60000 }).total).toBe(680000);
  });
  it('trạng thái rỗng có toàn bộ tổng bằng 0', () => {
    const result = monthSummary({}, 2026, 10, rates);
    expect(result.total).toBe(0);
    expect(result.workingDays).toBe(0);
    expect(result.shootCount).toBe(0);
  });
  it('km thập phân không làm tiền trở thành số thập phân', () => {
    const result = daySummary({ am: 'seo', pm: null, shoots: [{ place: 'A', km: 5.1 }, { place: 'B', km: 10.2 }] }, rates);
    expect(result.km).toBe(15.3);
    expect(Number.isInteger(result.total)).toBe(true);
  });
  it('các tháng nhiều năm đều chia đủ ngày, tuần bắt đầu thứ hai', () => {
    for (let year = 2024; year <= 2028; year++) for (let month = 0; month < 12; month++) {
      const count = new Date(year, month + 1, 0).getDate();
      const days: Days = {};
      for (let day = 1; day <= count; day++) days[dateKey(year, month, day)] = { am: 'seo', pm: 'mkt', shoots: [{ place: 'A', km: day }] };
      const weeks = weekSummary(days, year, month, rates);
      expect(weeks.flatMap(week => week.keys)).toHaveLength(count);
      expect(new Set(weeks.flatMap(week => week.keys)).size).toBe(count);
      expect(weeks.reduce((sum, week) => sum + week.total, 0)).toBe(monthSummary(days, year, month, rates).total);
      for (const week of weeks.slice(1)) expect(new Date(year, month, week.start).getDay()).toBe(1);
    }
  });
});

describe('normalize/migrate dữ liệu', () => {
  it('khởi đầu rỗng, không có dữ liệu giả', () => expect(emptyData().days).toEqual({}));
  it('bảo toàn dữ liệu v1 khi xuất rồi nhập JSON', () => {
    const data = { ...emptyData(), days: sample() };
    expect(normalize(JSON.parse(JSON.stringify(data)))).toEqual(data);
  });
  it.each([[0, 0, null, null], [1, 0, 'seo', null], [0, 1, 'mkt', null], [2, 0, 'seo', 'seo'], [0, 2, 'mkt', 'mkt'], [1, 1, 'seo', 'mkt']])(
    'chuyển số buổi SEO=%s, MKT=%s, không mất buổi', (seo, mkt, am, pm) => {
      const result = migrate({ days: { '2026-11-02': { seo, mkt } } });
      if (!seo && !mkt) expect(result.days).toEqual({});
      else expect(result.days['2026-11-02']).toEqual({ am, pm, shoots: [] });
    },
  );
  it('chuyển dữ liệu cũ giữ phí đi quay và mức lương', () => {
    const result = migrate({ rates: { seo: 90000 }, days: { '2026-11-02': { seo: 1, mkt: 1, shoots: [{ place: 'Hồ Tây', km: 8 }] } } });
    expect(monthSummary(result.days, 2026, 10, result.rates).total).toBe(240000);
    expect(result.schemaVersion).toBe(1);
  });
  it('từ chối hơn 2 buổi thay vì âm thầm bỏ buổi; không sửa nguồn', () => {
    const raw = { days: { '2026-11-02': { seo: 2, mkt: 1 } } };
    const before = JSON.stringify(raw);
    expect(() => migrate(raw)).toThrow('hơn 2 buổi');
    expect(JSON.stringify(raw)).toBe(before);
  });
  it('xóa ngày nghỉ trống nhưng giữ lần quay chưa nhập km', () => {
    const raw = emptyData();
    raw.days['2026-11-01'] = { am: null, pm: null, shoots: [] };
    raw.days['2026-11-02'] = { am: null, pm: null, shoots: [{ place: '', km: null }] };
    expect(Object.keys(normalize(raw).days)).toEqual(['2026-11-02']);
  });
  it.each([
    null, [], {}, { schemaVersion: 2, days: {} },
    { ...emptyData(), rates: { ...rates, seo: 1.5 } },
    { ...emptyData(), rates: { ...rates, fee1: -1 } },
    { ...emptyData(), rates: { ...rates, seo: Number.MAX_SAFE_INTEGER + 1 } },
    { ...emptyData(), days: { '2026-02-30': { am: null, pm: null, shoots: [] } } },
    { ...emptyData(), days: { '2026-11-01': { am: 'other', pm: null, shoots: [] } } },
    { ...emptyData(), days: { '2026-11-01': { am: null, pm: null, shoots: [{ place: 'A', km: -1 }] } } },
  ])('từ chối dữ liệu không hợp lệ %#', raw => expect(() => normalize(raw)).toThrow());
});

describe('ngày địa phương và chuyển tháng', () => {
  it('qua ranh giới năm cả hai chiều', () => {
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 });
    expect(shiftMonth(2027, 0, -1)).toEqual({ year: 2026, month: 11 });
  });
  it('khóa ngày giữ nguyên ngày địa phương, kể cả sau nửa đêm UTC+7', () => {
    const date = new Date(2026, 10, 1, 0, 15);
    expect(dateKey(date.getFullYear(), date.getMonth(), date.getDate())).toBe('2026-11-01');
    expect(dateKey(2026, 11, 32)).toBe('2027-01-01');
  });
  it('mở tháng 11/2026 hoặc tháng hiện tại từ mốc đó', () => {
    expect(initialMonth(new Date(2026, 9, 31))).toEqual({ year: 2026, month: 10 });
    expect(initialMonth(new Date(2026, 10, 1))).toEqual({ year: 2026, month: 10 });
    expect(initialMonth(new Date(2027, 0, 1))).toEqual({ year: 2027, month: 0 });
  });
  it('định dạng tiền Việt Nam', () => expect(money(1280000)).toBe('1.280.000 ₫'));
});
