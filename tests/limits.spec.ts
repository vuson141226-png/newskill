import { expect, test, type Page } from '@playwright/test';
import { DATA_LIMITS, KM_LIMIT_MESSAGE, RATE_LIMIT_MESSAGE, SHOOT_LIMIT_MESSAGE } from '../src/limits';
import { emptyData, type Data } from '../src/logic';

const key = 'cham-cong-ca-nhan:v1';
const archivePrefix = 'cham-cong-ca-nhan:corrupt:';
const rateNames = ['seo', 'mkt', 'fee1', 'fee2', 'fee3'] as const;
function dataWithShoots(count = 1): Data {
  return { ...emptyData(), days: { '2026-11-01': { am: 'seo', pm: null, shoots: Array.from({ length: count }, () => ({ place: 'Điểm quay', km: DATA_LIMITS.km })) } } };
}
async function open(page: Page, data = dataWithShoots()) {
  await page.clock.install({ time: new Date('2026-11-01T10:00:00+07:00') });
  await page.addInitScript(({ key, data }) => {
    if (!sessionStorage.getItem('seeded')) { localStorage.setItem(key, JSON.stringify(data)); sessionStorage.setItem('seeded', 'yes'); }
    const set = Storage.prototype.setItem; (window as any).writeCount = 0;
    Storage.prototype.setItem = function(key, value) { (window as any).writeCount++; return set.call(this, key, value); };
  }, { key, data });
  await page.goto('/'); await expect(page.locator('h1')).toHaveText('Tháng 11/2026');
}
const saved = (page: Page) => page.evaluate(key => localStorage.getItem(key), key);
const writes = (page: Page) => page.evaluate(() => (window as any).writeCount as number);
async function upload(page: Page, data: Data) {
  await page.locator('#backup-file').setInputFiles({ name: 'limits.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
}

test('Cài đặt: đủ 5 mức nhận đúng trần, vượt trần không lưu và trả mức cũ', async ({ page }) => {
  await open(page); await page.locator('.rate-settings summary').click();
  for (const name of rateNames) {
    const input = page.locator(`#rate-${name}`);
    await input.fill(String(DATA_LIMITS.rate)); await input.press('Tab'); await expect(input).toHaveValue(String(DATA_LIMITS.rate));
    expect(JSON.parse((await saved(page))!).rates[name]).toBe(DATA_LIMITS.rate);
    const before = await saved(page), count = await writes(page);
    await input.fill(String(DATA_LIMITS.rate + 1)); expect(await writes(page)).toBe(count);
    await input.press('Tab'); await expect(input).toHaveValue(String(DATA_LIMITS.rate));
    await expect(page.locator('#rates-message')).toContainText(RATE_LIMIT_MESSAGE);
    expect(await saved(page)).toBe(before); expect(await writes(page)).toBe(count);
  }
  await page.reload(); await page.locator('.rate-settings summary').click();
  for (const name of rateNames) await expect(page.locator(`#rate-${name}`)).toHaveValue(String(DATA_LIMITS.rate));
});

test('km và thêm quay: nhận 1.000/20; vượt không lưu, không mất focus dòng', async ({ page }) => {
  await open(page, dataWithShoots(DATA_LIMITS.shootsPerDay - 1));
  const input = page.locator('.shoot-row input[inputmode="decimal"]').first();
  const before = await saved(page), count = await writes(page);
  await input.fill(String(DATA_LIMITS.km + 1)); expect(await writes(page)).toBe(count); await input.press('Tab');
  await expect(input).toHaveValue(String(DATA_LIMITS.km));
  await expect(page.locator('.shoot-row .input-field .operation-message').first()).toHaveText(KM_LIMIT_MESSAGE);
  await expect(page.locator('.data-notice')).toContainText(KM_LIMIT_MESSAGE);
  expect(await saved(page)).toBe(before); expect(await writes(page)).toBe(count);
  await page.locator('#add-shoot').click(); await expect(page.locator('.shoot-row')).toHaveCount(DATA_LIMITS.shootsPerDay);
  await expect(page.locator('.shoot-row input[list]').last()).toBeFocused();
  const lastKm = page.locator('.shoot-row input[inputmode="decimal"]').last();
  await lastKm.fill(String(DATA_LIMITS.km)); await lastKm.press('Tab');
  const full = await saved(page), fullWrites = await writes(page);
  await page.locator('#add-shoot').click(); await expect(page.locator('.shoot-row')).toHaveCount(DATA_LIMITS.shootsPerDay);
  await expect(page.locator('#add-shoot-message')).toHaveText(SHOOT_LIMIT_MESSAGE); await expect(page.locator('#add-shoot')).toBeFocused();
  expect(await saved(page)).toBe(full); expect(await writes(page)).toBe(fullWrites);
  await page.reload(); await expect(page.locator('.shoot-row')).toHaveCount(DATA_LIMITS.shootsPerDay);
});

const violations: { name: string; field: string; message: string; mutate: (data: Data) => void }[] = [
  ...rateNames.map(name => ({ name: `rates.${name}`, field: `rates.${name}`, message: RATE_LIMIT_MESSAGE, mutate: (data: Data) => { data.rates[name] = DATA_LIMITS.rate + 1; } })),
  { name: 'km', field: 'days.2026-11-01.shoots[0].km', message: KM_LIMIT_MESSAGE, mutate: data => { data.days['2026-11-01'].shoots[0].km = DATA_LIMITS.km + 1; } },
  { name: 'số lần quay', field: 'days.2026-11-01.shoots', message: SHOOT_LIMIT_MESSAGE, mutate: data => { data.days['2026-11-01'].shoots = dataWithShoots(DATA_LIMITS.shootsPerDay + 1).days['2026-11-01'].shoots; } },
];

test('file vượt giới hạn bị từ chối nguyên bộ; đúng ba trần được nhập và hoàn tác', async ({ page }) => {
  await open(page); const original = await saved(page), count = await writes(page);
  for (const entry of violations) {
    const data = dataWithShoots(); entry.mutate(data); await upload(page, data);
    await expect(page.locator('.backup-panel .operation-message')).toContainText(entry.field);
    await expect(page.locator('.backup-panel .operation-message')).toContainText(entry.message);
    await expect(page.locator('.import-preview')).toHaveCount(0);
    expect(await saved(page)).toBe(original); expect(await writes(page)).toBe(count);
  }
  const max = dataWithShoots(DATA_LIMITS.shootsPerDay); for (const name of rateNames) max.rates[name] = DATA_LIMITS.rate;
  await upload(page, max); await expect(page.locator('.import-preview')).toBeVisible();
  await page.getByRole('button', { name: 'Thay thế toàn bộ dữ liệu hiện tại', exact: true }).click();
  expect(JSON.parse((await saved(page))!)).toEqual(max); await expect(page.locator('.money-warning')).toHaveCount(0);
  await page.reload(); await expect(page.locator('.shoot-row')).toHaveCount(DATA_LIMITS.shootsPerDay);
  await page.getByRole('button', { name: 'Hoàn tác lần nhập gần nhất', exact: true }).click(); await page.reload();
  expect(JSON.parse((await saved(page))!)).toEqual(JSON.parse(original!));
});

for (const entry of violations) {
  test(`localStorage ${entry.name} vượt trần: sao lưu nguyên văn trước khi khởi tạo`, async ({ page }) => {
    const data = dataWithShoots(); entry.mutate(data); const raw = JSON.stringify(data);
    await open(page, data);
    await expect(page.locator('.storage-notice')).toContainText(entry.field);
    await expect(page.locator('.storage-notice')).toContainText(entry.message);
    await expect(page.locator('.storage-notice')).toContainText('Đã khởi tạo dữ liệu mới');
    await expect(page.locator('.grand-total')).toHaveText('0 ₫');
    const archived = await page.evaluate(prefix => Object.keys(localStorage).filter(key => key.startsWith(prefix)).map(key => localStorage.getItem(key)), archivePrefix);
    expect(archived).toEqual([raw]); expect(JSON.parse((await saved(page))!)).toEqual(emptyData());
    await page.reload(); expect(await writes(page)).toBe(0);
  });
}

test('giới hạn vẫn áp dụng khi localStorage hết dung lượng', async ({ page }) => {
  await open(page, dataWithShoots(DATA_LIMITS.shootsPerDay - 1));
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.locator('#add-shoot').click(); await expect(page.locator('.shoot-row')).toHaveCount(DATA_LIMITS.shootsPerDay);
  await expect(page.locator('.storage-notice')).toContainText('Dữ liệu sẽ mất khi đóng trang');
  await page.locator('#add-shoot').click(); await expect(page.locator('.shoot-row')).toHaveCount(DATA_LIMITS.shootsPerDay);
  const km = page.locator('.shoot-row input[inputmode="decimal"]').first(); await km.fill(String(DATA_LIMITS.km + 1)); await km.press('Tab'); await expect(km).toHaveValue(String(DATA_LIMITS.km));
});
