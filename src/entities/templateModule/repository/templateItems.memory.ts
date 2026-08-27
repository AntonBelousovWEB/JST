import type { TemplateItemsRepository } from './types'
import type { TemplateItemDTO } from '@/shared/dto/templateItemDto.types'

const TEMPLATE_ITEMS: TemplateItemDTO[] = [
	{
		id: 1,
		title: 'SSR-ready app shell',
		description:
			'Request-scoped DI container, server render entry, hydration entry, and shared route config.',
		area: 'app',
		badge: 'SSR',
	},
	{
		id: 2,
		title: 'Feature-first example',
		description:
			'A removable catalog feature that shows how pages compose stores, entities, and UI kit components.',
		area: 'features',
		badge: 'Feature',
	},
	{
		id: 3,
		title: 'Entity boundary',
		description:
			'Repository, service, model, builder, store, and presentational components are isolated by responsibility.',
		area: 'entities',
		badge: 'Domain',
	},
	{
		id: 4,
		title: 'Shared infrastructure',
		description:
			'Storage adapters, route metadata, and focused helpers live in shared without becoming a custom framework.',
		area: 'shared',
		badge: 'Infra',
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
