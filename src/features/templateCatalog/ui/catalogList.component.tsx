import { reatomComponent } from '@reatom/react'
import { TemplateItemList } from '@/entities/templateModule/ui/templateItemList.component'
import { useTemplateCatalogService } from '../templateCatalog.injector'
import { CatalogCard } from './catalogCard.component'

export const CatalogList = reatomComponent(() => {
	const {
		templateModuleStore: { items },
	} = useTemplateCatalogService()

	return (
		<TemplateItemList>
			{items.data().map(item => (
				<CatalogCard key={item.id} item={item} />
			))}
		</TemplateItemList>
	)
})
