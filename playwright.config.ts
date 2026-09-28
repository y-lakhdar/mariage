import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:4399' },
  webServer: { command: 'npm run preview -- --port 4399 --ignore-lock', url: 'http://localhost:4399', reuseExistingServer: !process.env.CI },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'], browserName: 'webkit' } },
  ],
});
