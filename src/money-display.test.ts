import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';

// Simulate a broken upstream calculation, bypassing the normal validated store.
vi.mock('./logic', async importOriginal => {
  const actual = await importOriginal<typeof import('./logic')>();
  return {
    ...actual,
    monthSummary: (...args: Parameters<typeof actual.monthSummary>) => ({ ...actual.monthSummary(...args), total: Infinity }),
    daySummary: (...args: Parameters<typeof actual.daySummary>) => ({ ...actual.daySummary(...args), total: NaN }),
    weekSummary: (...args: Parameters<typeof actual.weekSummary>) => actual.weekSummary(...args).map(week => ({ ...week, total: Number.MAX_SAFE_INTEGER + 1 })),
  };
});
import App from './App';
import { UNSAFE_MONEY_MESSAGE } from './limits';

it('tổng tháng, tuần và ngày đều cảnh báo thay vì hiển thị số lỗi', () => {
  const html = renderToStaticMarkup(createElement(App));
  expect(html).toMatch(/class="grand-total numeric"[^>]*><span class="money-warning" role="status">/);
  expect(html).toMatch(/class="week-total-heading"[\s\S]*?<strong[^>]*><span class="money-warning" role="status">/);
  expect(html).toMatch(/class="day-amount"[\s\S]*?<strong[^>]*><span class="money-warning" role="status">/);
  expect(html).toContain(UNSAFE_MONEY_MESSAGE);
  expect(html).not.toContain('Infinity'); expect(html).not.toContain('NaN');
});
