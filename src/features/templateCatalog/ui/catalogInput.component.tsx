import { TextInput } from '@mantine/core'
import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { useTemplateCatalogService } from '../templateCatalog.injector'

export const CatalogInput = reatomComponent(() => {
	const {
		templateModuleStore: { search },
	} = useTemplateCatalogService()

	return (
		<TextInput
			classNames={{ input: 'catalog-search__input', label: 'catalog-search__label' }}
			label="Explore the starter"
			placeholder="Search app, entities, features, shared..."
			value={search()}
			onChange={wrap(event => search.set(event.target.value))}
		/>
	)
})
