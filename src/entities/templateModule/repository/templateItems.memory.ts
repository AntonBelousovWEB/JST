import type { TemplateItemsRepository } from './types'
import type { TemplateItemDTO } from '@/shared/dto/templateItemDto.types'

const TEMPLATE_ITEMS: TemplateItemDTO[] = [
	{
		id: 1,
		title: 'SSR document shell',
		description:
			'React Router owns requests, status codes, server rendering, hydration, and route errors.',
		area: 'app',
		badge: 'SSR',
	},
	{
		id: 2,
		title: 'Dependency rules',
		description:
			'ESLint rejects imports that point against the app, page, feature, entity, and shared layers.',
		area: 'architecture',
		badge: 'Lint',
	},
	{
		id: 3,
		title: 'Replaceable boundaries',
		description:
			'Repositories and effectful adapters are selected through a request-scoped Needle DI container.',
		area: 'entities',
		badge: 'Domain',
	},
	{
		id: 4,
		title: 'Delivery baseline',
		description:
			'TypeScript, Vitest, production builds, Knip, Playwright, Axe, and CI are ready to run.',
		area: 'tooling',
		badge: 'CI',
	},
]

export class TemplateItemsMemoryRepository implements TemplateItemsRepository {
	async getTemplateItems(query: string = '') {
		const normalizedQuery = query.trim().toLowerCase()

		if (!normalizedQuery) {
			return { items: TEMPLATE_ITEMS }
		}

		return {
			items: TEMPLATE_ITEMS.filter(item =>
				[
					item.title,
					item.description,
					item.area,
					item.badge,
				].some(value => value.toLowerCase().includes(normalizedQuery)),
			),
		}
	}
}
