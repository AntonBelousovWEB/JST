import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const isCI = Boolean(process.env.CI)

export default defineConfig({
	testDir: './e2e',
	testMatch: '**/*.spec.ts',
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 1 : 0,
	workers: isCI ? 1 : undefined,
	reporter: isCI
		? [['github'], ['html', { open: 'never' }]]
		: 'list',
	timeout: 30_000,

	use: {
		baseURL: 'http://localhost:5173',
		screenshot: 'only-on-failure',
		trace: 'on-first-retry',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

	webServer: {
		command: isCI ? 'npm start' : 'npm run build && npm start',
		env: { PORT: '5173' },
		port: 5173,
		reuseExistingServer: !isCI,
		timeout: 60_000,
	},
})
