import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/visual',
  timeout: 35_000,
  expect: { timeout: 12_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3030',
    ...devices['Desktop Chrome'],
    channel: 'chrome',
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npx slidev --port 3030',
    url: 'http://127.0.0.1:3030/',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI
  },
  workers: 1
})
