import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 375, height: 812 } })

test('home page fits a small viewport without horizontal overflow', async ({ page }) => {
	await page.route('https://jsonplaceholder.typicode.com/posts?userId=1', route =>
		route.fulfill({ json: [] }))

	await page.goto('/')

	await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	await expect(page.getByRole('link', { name: 'See the request pipeline' })).toBeVisible()

	const viewport = page.viewportSize()
	const main = await page.getByRole('main').boundingBox()

	expect(viewport).not.toBeNull()
	expect(main).not.toBeNull()
	expect((main?.x ?? 0) + (main?.width ?? 0)).toBeLessThanOrEqual(viewport?.width ?? 0)
})
