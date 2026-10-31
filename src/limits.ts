// The only declarations of application data limits. All entry points share them.
export const DATA_LIMITS = Object.freeze({ rate: 100_000_000, km: 1_000, shootsPerDay: 20 });
const number = (value: number) => new Intl.NumberFormat('vi-VN').format(value);
export const RATE_LIMIT_MESSAGE = `Mức tiền phải là số nguyên không âm từ 0 đến ${number(DATA_LIMITS.rate)} ₫.`;
export const KM_LIMIT_MESSAGE = `Khoảng cách phải là số không âm từ 0 đến ${number(DATA_LIMITS.km)} km hoặc trống.`;
export const SHOOT_LIMIT_MESSAGE = `Mỗi ngày tối đa ${DATA_LIMITS.shootsPerDay} lần đi quay.`;

export function assertRate(value: unknown, path: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0 || value > DATA_LIMITS.rate) throw new Error(`${path}: ${RATE_LIMIT_MESSAGE}`);
}
export function assertKm(value: unknown, path: string): asserts value is number | null {
  if (value !== null && (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > DATA_LIMITS.km)) throw new Error(path ? `${path}: ${KM_LIMIT_MESSAGE}` : KM_LIMIT_MESSAGE);
}
export function assertShootCount(count: number, path: string) {
  if (!Number.isSafeInteger(count) || count < 0 || count > DATA_LIMITS.shootsPerDay) throw new Error(`${path}: ${SHOOT_LIMIT_MESSAGE}`);
}

export const UNSAFE_MONEY_MESSAGE = 'Không thể hiển thị tiền: tổng không phải số nguyên an toàn. Hãy kiểm tra dữ liệu.';
export const isSafeMoney = (value: number) => Number.isSafeInteger(value) && value >= 0;
