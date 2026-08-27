import { expect, test } from '@playwright/test'

test.describe('SSR / hydration smoke', () => {
	test('home page renders server-side HTML', async ({ page }) => {
		await page.route('**/*.{js,mjs}', route => route.abort())

		const response = await page.goto('/')

		expect(response?.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin')
		expect(response?.headers()['x-content-type-options']).toBe('nosniff')
		await expect(page).toHaveTitle(/\S+/)
		await expect(page.locator('meta[name="description"]')).toHaveAttribute(
			'content',
			/\S+/,
		)
		await expect(page.getByRole('main')).toBeVisible()
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('home page hydrates without console errors', async ({ page }) => {
		const errors: string[] = []
		page.on('pageerror', error => errors.push(error.message))
		page.on('console', (message) => {
			if (message.type() === 'error') {
				errors.push(message.text())
			}
		})

		await page.goto('/')

		await expect(page.getByRole('heading', { level: 1 })).toBeVisible({
			timeout: 10_000,
		})

		expect(errors).toEqual([])
	})
})
