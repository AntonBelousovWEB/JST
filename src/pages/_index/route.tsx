import { Badge, Box, Button, Card, Group, Loader, Stack, Text, Title } from '@mantine/core'
import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { useSyncExternalStore } from 'react'
import { useService } from '@/app/container/container.context'
import { TemplateModuleStore } from '@/entities/templateModule/templateModule.store'
import { TemplateCatalogEntry } from '@/features/templateCatalog/templateCatalog.entry'
import { TemplateCatalogInjector } from '@/features/templateCatalog/templateCatalog.injector'
import { APP_CONFIG } from '@/shared/config'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

const HomePage = reatomComponent(() => {
	const templateModuleStore = useService(TemplateModuleStore)
	const hydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
	const selectedItems = hydrated ? templateModuleStore.selectedItems() : []
	const { description, name: title } = APP_CONFIG

	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta name="twitter:card" content="summary" />

			<Stack gap="xl" py="xl">
				<Stack gap="md" maw={760}>
					<Group gap="xs">
						<Badge variant="light">React</Badge>
						<Badge variant="light">SSR</Badge>
						<Badge variant="light">Mantine</Badge>
						<Badge variant="light">DI</Badge>
					</Group>

					<Title order={1}>
						Frontend starter for projects that should stay pleasant after day
						one.
					</Title>

					<Text c="dimmed" size="lg">
						This removable example wires a route module, feature, entity, store,
						repository, persistence adapter, DI container, and Mantine UI without
						mixing their responsibilities.
					</Text>
				</Stack>

				<Card withBorder radius="md" padding="lg">
					<Group justify="space-between" align="center">
						<Stack gap={4}>
							<Text fw={700}>Selected example blocks</Text>
							<Text c="gray.7" size="sm">
								{selectedItems.length
									? selectedItems.map(item => item.title).join(', ')
									: 'Nothing selected yet. Selection is persisted through shared storage.'}
							</Text>
						</Stack>

						<Button
							variant="light"
							disabled={!selectedItems.length}
							onClick={wrap(templateModuleStore.clearSelected)}
						>
							Clear
						</Button>
					</Group>
				</Card>

				{hydrated
					? (
							<TemplateCatalogInjector value={{ templateModuleStore }}>
								<TemplateCatalogEntry />
							</TemplateCatalogInjector>
						)
					: (
							<Box ta="center" py="lg">
								<Loader aria-label="Loading catalog" />
							</Box>
						)}
			</Stack>
		</>
	)
}, 'HomePage')

export default HomePage
