import { expect, test } from '@playwright/test'

test('search filters the catalog and handles an empty result', async ({ page }) => {
	await page.goto('/')

	const search = page.getByRole('textbox', { name: 'Filter the reference app' })
	await search.fill('Delivery baseline')

	await expect(page.getByRole('heading', { name: 'Delivery baseline' })).toBeVisible()
	await expect(page.getByRole('button', { name: 'Select example' })).toHaveCount(1)

	await search.fill('does-not-exist')
	await expect(page.getByText('No template blocks found.')).toBeVisible()
})
