import { TextInput } from '@mantine/core'
import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { useTemplateCatalogService } from '../templateCatalog.injector'
import styles from './catalogInput.component.module.css'

export const CatalogInput = reatomComponent(() => {
	const {
		templateModuleStore: { search },
	} = useTemplateCatalogService()

	return (
		<TextInput
			classNames={{ input: styles.input, label: styles.label }}
			label="Filter the reference app"
			placeholder="Search SSR, lint, DI, CI..."
			value={search()}
			onChange={wrap(event => search.set(event.target.value))}
		/>
	)
})
