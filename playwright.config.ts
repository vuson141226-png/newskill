import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 400, height: 900 },
    timezoneId: 'Asia/Ho_Chi_Minh',
    launchOptions: { executablePath: process.env.CHAMCONG_CHROMIUM_PATH || undefined },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: { command: 'npm run preview -- --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
});
