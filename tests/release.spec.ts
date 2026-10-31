import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const key = 'cham-cong-ca-nhan:v1';
const rates = { seo: 80000, mkt: 100000, fee1: 50000, fee2: 100000, fee3: 200000 };
const sample = { schemaVersion: 1, rates, days: {
  '2026-11-01': { am: 'seo', pm: null, shoots: [] },
  '2026-11-02': { am: 'seo', pm: 'mkt', shoots: [] },
  '2026-11-03': { am: 'mkt', pm: null, shoots: [{ place: 'Hồ Tây', km: 8 }, { place: 'Ngoại thành', km: 25 }] },
  '2026-11-04': { am: null, pm: 'seo', shoots: [] },
  '2026-11-30': { am: null, pm: 'mkt', shoots: [] },
  '2026-10-30': { am: 'seo', pm: 'seo', shoots: [] },
} };

async function start(page: Page, data?: unknown, time = '2026-11-01T10:00:00+07:00') {
  await page.clock.install({ time: new Date(time) });
  await page.addInitScript(({ key, data }) => {
    if (data && !sessionStorage.getItem('seeded')) {
      localStorage.setItem(key, JSON.stringify(data)); sessionStorage.setItem('seeded', 'yes');
    }
  }, { key, data });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Tháng 11/2026');
}
async function selectDay(page: Page, number: number) { await page.locator('.calendar-day').nth(number - 1).click(); }
async function session(page: Page, slot: 'sáng' | 'chiều', job: string) { await page.getByRole('button', { name: `Buổi ${slot}: ${job}`, exact: true }).click(); }
async function addShoot(page: Page, place: string, km: string) {
  await page.getByRole('button', { name: '+ Thêm lần đi quay', exact: true }).click();
  const row = page.locator('.shoot-row').last();
  await expect(row.locator('input[list]')).toBeFocused();
  await row.locator('input[list]').fill(place); await page.keyboard.press('Tab');
  await expect(row.locator('input[inputmode="decimal"]')).toBeFocused();
  await page.keyboard.type(km); await page.keyboard.press('Tab');
}
async function saved(page: Page) { return page.evaluate(key => JSON.parse(localStorage.getItem(key)!), key); }
async function upload(page: Page, data: unknown = { schemaVersion: 1, rates, days: {} }) {
  await page.locator('#backup-file').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
  await expect(page.locator('.import-preview')).toBeVisible();
}

test('nhập từ giao diện: 790.000 tháng 11, đúng sáu tuần; tháng 10 = 160.000', async ({ page }) => {
  await start(page);
  await session(page, 'sáng', 'SEO');
  await selectDay(page, 2); await session(page, 'sáng', 'SEO'); await session(page, 'chiều', 'Marketing');
  await selectDay(page, 3); await session(page, 'sáng', 'Marketing'); await addShoot(page, 'Hồ Tây', '8'); await addShoot(page, 'Ngoại thành', '25');
  await selectDay(page, 4); await session(page, 'chiều', 'SEO');
  await selectDay(page, 30); await session(page, 'chiều', 'Marketing');
  await page.getByRole('button', { name: 'Tháng trước', exact: true }).click();
  await selectDay(page, 30); await session(page, 'sáng', 'SEO'); await session(page, 'chiều', 'SEO');
  await expect(page.locator('.grand-total')).toHaveText('160.000 ₫');
  await page.getByRole('button', { name: 'Tháng sau', exact: true }).click();
  await expect(page.locator('.grand-total')).toHaveText('790.000 ₫');
  const details = page.locator('.breakdown-description');
  await expect(details.nth(0)).toContainText('3 buổi (2 sáng, 1 chiều)'); await expect(details.nth(1)).toContainText('3 buổi (1 sáng, 2 chiều)');
  await expect(page.locator('.breakdown-money').nth(2)).toHaveText('250.000 ₫');
  await expect(page.locator('.week-total-heading strong')).toHaveText(['80.000 ₫', '610.000 ₫', '0 ₫', '0 ₫', '0 ₫', '100.000 ₫']);
  expect(await saved(page)).toEqual(sample);
  const totals = await page.locator('.week-total-heading strong').allTextContents();
  expect(totals.reduce((sum, text) => sum + Number(text.replace(/\D/g, '')), 0)).toBe(790000);
  await page.reload(); await expect(page.locator('.grand-total')).toHaveText('790.000 ₫');
});

test('lịch qua năm, tháng nhuận, đầu Chủ nhật và Thứ hai', async ({ page }) => {
  await start(page);
  expect(await page.locator('.calendar-day').first().evaluate(el => getComputedStyle(el).gridColumnStart)).toBe('7');
  for (let n = 0; n < 5; n++) await page.getByRole('button', { name: 'Tháng trước', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('Tháng 6/2026');
  expect(await page.locator('.calendar-day').first().evaluate(el => getComputedStyle(el).gridColumnStart)).toBe('1');
  for (let n = 0; n < 7; n++) await page.getByRole('button', { name: 'Tháng sau', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('Tháng 1/2027');
  await page.getByRole('button', { name: 'Tháng trước', exact: true }).click(); await expect(page.locator('h1')).toHaveText('Tháng 12/2026');
  for (let n = 0; n < 2; n++) await page.getByRole('button', { name: 'Tháng sau', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('Tháng 2/2027'); await expect(page.locator('.calendar-day')).toHaveCount(28);
  for (let n = 0; n < 12; n++) await page.getByRole('button', { name: 'Tháng sau', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('Tháng 2/2028'); await expect(page.locator('.calendar-day')).toHaveCount(29);
});

test('xóa giữa không lệch dòng; xóa ngày trống; nhập–hoàn tác–tải lại', async ({ page }) => {
  const data = structuredClone(sample);
  data.days['2026-11-03'].shoots.push({ place: 'Lần thứ ba', km: 10 });
  await start(page, data); await selectDay(page, 3);
  const last = page.locator('.shoot-row').last().locator('input[list]'); const lastId = await last.getAttribute('id');
  await last.evaluate(el => { (window as any).lastInput = el; });
  await page.getByRole('button', { name: 'Xóa lần này: lần đi quay 2', exact: true }).click();
  await page.getByRole('button', { name: 'Xác nhận xóa lần đi quay 2', exact: true }).click();
  await expect(page.locator('.shoot-row').last().locator('input[list]')).toHaveValue('Lần thứ ba');
  expect(await page.locator('.shoot-row').last().locator('input[list]').getAttribute('id')).toBe(lastId);
  expect(await last.evaluate(el => el === (window as any).lastInput)).toBe(true);
  while (await page.locator('.shoot-row').count()) {
    await page.getByRole('button', { name: 'Xóa lần này: lần đi quay 1', exact: true }).click();
    await page.getByRole('button', { name: 'Xác nhận xóa lần đi quay 1', exact: true }).click();
  }
  await session(page, 'sáng', 'Nghỉ'); expect((await saved(page)).days['2026-11-03']).toBeUndefined();
  const before = await saved(page);
  await upload(page); await page.getByRole('button', { name: 'Thay thế toàn bộ dữ liệu hiện tại', exact: true }).click();
  await expect(page.locator('.grand-total')).toHaveText('0 ₫'); await page.reload();
  await page.getByRole('button', { name: 'Hoàn tác lần nhập gần nhất', exact: true }).click(); await page.reload();
  expect(await saved(page)).toEqual(before);
});

test('giữ focus hợp lý sau hủy, nhập thành công và hoàn tác', async ({ page }) => {
  await start(page, sample);
  const importButton = page.getByRole('button', { name: 'Nhập dữ liệu', exact: true });
  await upload(page); await page.getByRole('button', { name: 'Hủy nhập', exact: true }).press('Enter'); await expect(importButton).toBeFocused();
  await upload(page); await page.getByRole('button', { name: 'Thay thế toàn bộ dữ liệu hiện tại', exact: true }).press('Space'); await expect(importButton).toBeFocused();
  await page.getByRole('button', { name: 'Hoàn tác lần nhập gần nhất', exact: true }).press('Enter'); await expect(importButton).toBeFocused();
});

for (const width of [360, 400, 768, 1280]) for (const scheme of ['light', 'dark'] as const) {
  test(`bố cục và WCAG AA ${width}px ${scheme}: nhiều dòng, chữ dài`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 }); await page.emulateMedia({ colorScheme: scheme });
    const data = structuredClone(sample);
    for (let day = 5; day <= 24; day++) data.days[`2026-11-${String(day).padStart(2, '0')}` as keyof typeof data.days] = { am: null, pm: null, shoots: [{ place: day === 5 ? 'Vị_trí_rất_dài_'.repeat(30) : `Địa điểm ${day}`, km: 8 }, { place: `Lần quay khác ${day}`, km: 10 }] } as any;
    await start(page, data); await selectDay(page, 3); await page.locator('.rate-settings summary').click();
    const metrics = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth,
      smallButtons: [...document.querySelectorAll('button')].filter(el => el.getClientRects().length).filter(el => { const box = el.getBoundingClientRect(); return box.width < 43.99 || box.height < 43.99; }).map(el => el.getAttribute('aria-label') || el.innerText),
      inputs: [...document.querySelectorAll('input:not([type="file"])')].filter(el => el.getClientRects().length).filter(el => el.getBoundingClientRect().height < 44 || parseFloat(getComputedStyle(el).fontSize) < 16).map(el => el.id),
    }));
    expect(metrics.content).toBe(metrics.viewport); expect(metrics.smallButtons).toEqual([]); expect(metrics.inputs).toEqual([]);
    await page.locator('.shoot-row input[list]').first().fill('Một vị trí dài '.repeat(100)); await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    await testInfo.attach('accessibility', { body: JSON.stringify(audit.violations, null, 2), contentType: 'application/json' });
    expect(audit.violations).toEqual([]);
    await page.locator('#day-editor').screenshot({ path: testInfo.outputPath('day-editor.png') });
    await page.locator('.rate-settings').screenshot({ path: testInfo.outputPath('settings.png') });
    await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({ path: testInfo.outputPath('full-page.png'), fullPage: true });
  });
}

test('đi từ lịch đến sao lưu bằng Tab/Enter/Space; trạng thái được đọc và focus rõ', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new DOMException('Blocked', 'NotAllowedError'); } } }));
  await start(page, sample);
  await page.keyboard.press('Tab'); await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Tháng trước', exact: true })).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('h1')).toHaveText('Tháng 10/2026');
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Tháng sau', exact: true })).toBeFocused(); await page.keyboard.press('Space'); await expect(page.locator('h1')).toHaveText('Tháng 11/2026');
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Shift+Tab'); await expect(page.locator('.skip-link')).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('#day-editor')).toBeFocused();
  await page.keyboard.press('Tab'); const off = page.getByRole('button', { name: 'Buổi sáng: Nghỉ', exact: true }); await expect(off).toBeFocused(); await page.keyboard.press('Space'); await expect(off).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Tab'); const seo = page.getByRole('button', { name: 'Buổi sáng: SEO', exact: true }); await expect(seo).toBeFocused(); await page.keyboard.press('Enter'); await expect(seo).toHaveAttribute('aria-pressed', 'true');
  expect(await seo.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  async function tabTo(selector: string) {
    for (let n = 0; n < 150; n++) { if (await page.locator(selector).evaluate(el => el === document.activeElement)) return; await page.keyboard.press('Tab'); }
    throw new Error(`Không Tab tới được ${selector}`);
  }
  await tabTo('#add-shoot'); await page.keyboard.press('Enter'); await expect(page.locator('.shoot-row input[list]')).toBeFocused();
  await page.keyboard.type('Điểm quay'); await page.keyboard.press('Tab'); await expect(page.locator('.shoot-row input[inputmode="decimal"]')).toBeFocused();
  await page.keyboard.type('8,5'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await expect(page.locator('.delete-action')).toBeFocused(); await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); await expect(page.locator('.delete-shoot')).toBeFocused();
  await tabTo('.copy-table'); await page.keyboard.press('Enter'); await expect(page.locator('.manual-copy textarea')).toBeFocused();
  await expect(page.locator('.copy-message')).toHaveAttribute('aria-live', 'polite');
  expect(await page.locator('.manual-copy textarea').evaluate(el => (el as HTMLTextAreaElement).selectionEnd === (el as HTMLTextAreaElement).value.length)).toBe(true);
  await page.keyboard.press('Tab'); await expect(page.locator('.shoot-table-scroll')).toBeFocused(); await page.keyboard.press('Tab'); await expect(page.locator('.table-date').first()).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('#day-editor')).toBeFocused();
  await tabTo('.rate-settings summary'); await page.keyboard.press('Space'); await page.keyboard.press('Tab'); await expect(page.locator('#rate-seo')).toBeFocused();
  await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.type('90000'); await page.keyboard.press('Tab'); await expect(page.locator('#rate-mkt')).toBeFocused();
  await expect(page.locator('#rates-message')).toHaveAttribute('aria-live', 'polite');
  await tabTo('.settings-content > .secondary-action'); await page.keyboard.press('Enter'); await expect(page.locator('.inline-confirm .primary-action')).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page.locator('.settings-content > .secondary-action')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Xuất dữ liệu', exact: true })).toBeFocused();
  const download = page.waitForEvent('download'); await page.keyboard.press('Enter'); expect((await download).suggestedFilename()).toBe('chamcong-2026-11-01.json');
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Nhập dữ liệu', exact: true })).toBeFocused();
  const chooser = page.waitForEvent('filechooser'); await page.keyboard.press('Enter'); await (await chooser).setFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(sample)) });
  const confirm = page.getByRole('button', { name: 'Thay thế toàn bộ dữ liệu hiện tại', exact: true }); await expect(confirm).toBeFocused(); await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Nhập dữ liệu', exact: true })).toBeFocused(); await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Hoàn tác lần nhập gần nhất', exact: true })).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Nhập dữ liệu', exact: true })).toBeFocused();
});

for (const [timezoneId, offset] of [['UTC', '+00:00'], ['America/Los_Angeles', '-07:00'], ['Asia/Ho_Chi_Minh', '+07:00']]) {
  test.describe(`giờ địa phương ${timezoneId}`, () => {
    test.use({ timezoneId });
    test('khóa ngày và tên file sau nửa đêm không lệch UTC', async ({ page }) => {
      await start(page, undefined, `2026-11-01T00:15:00${offset}`); await session(page, 'sáng', 'SEO'); expect(Object.keys((await saved(page)).days)).toEqual(['2026-11-01']);
      const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Xuất dữ liệu', exact: true }).click(); const file = await pending;
      expect(file.suggestedFilename()).toBe('chamcong-2026-11-01.json'); const data = JSON.parse(await readFile((await file.path())!, 'utf8')); expect(Object.keys(data.days)).toEqual(['2026-11-01']);
    });
  });
}

test('bản phát hành không gửi dữ liệu ra ngoài; font và giấy phép nằm trong bản build', async ({ page, request }) => {
  const requests: { url: string; type: string; method: string }[] = [];
  page.on('request', req => requests.push({ url: req.url(), type: req.resourceType(), method: req.method() }));
  await start(page, sample); await selectDay(page, 3); await addShoot(page, 'Vị trí cá nhân', '10,001');
  await page.locator('.rate-settings summary').click(); await page.locator('#rate-seo').fill('90000'); await page.locator('#rate-seo').press('Tab');
  await upload(page); await page.getByRole('button', { name: 'Thay thế toàn bộ dữ liệu hiện tại', exact: true }).click(); await page.getByRole('button', { name: 'Hoàn tác lần nhập gần nhất', exact: true }).click();
  expect(requests.filter(req => !req.url.startsWith('http://127.0.0.1:4173/') && !req.url.startsWith('blob:'))).toEqual([]);
  expect(requests.filter(req => ['fetch', 'xhr', 'websocket', 'ping'].includes(req.type) || req.method !== 'GET')).toEqual([]);
  await page.evaluate(() => document.fonts.ready); expect(await page.evaluate(() => document.fonts.check('400 16px "Be Vietnam Pro"') && document.fonts.check('500 32px "IBM Plex Mono"'))).toBe(true);
  for (const name of ['be-vietnam-pro', 'ibm-plex-mono']) { const response = await request.get(`/licenses/${name}-LICENSE.txt`); expect(response.status()).toBe(200); expect(await response.text()).toContain('SIL OPEN FONT LICENSE Version 1.1'); }
});
