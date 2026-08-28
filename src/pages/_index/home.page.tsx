import { Badge, Box, Button, Card, Group, Loader, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { useSyncExternalStore } from 'react'
import { useService } from '@/app/container/container.context'
import { PostsStore } from '@/entities/post/posts.store'
import { TemplateModuleStore } from '@/entities/templateModule/templateModule.store'
import { PostsFeedEntry } from '@/features/postsFeed/postsFeed.entry'
import { PostsFeedInjector } from '@/features/postsFeed/postsFeed.injector'
import { TemplateCatalogEntry } from '@/features/templateCatalog/templateCatalog.entry'
import { TemplateCatalogInjector } from '@/features/templateCatalog/templateCatalog.injector'
import './home.css'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

const architectureLayers = [
	{ number: '01', name: 'Page', detail: 'Composes a route and resolves dependencies.' },
	{ number: '02', name: 'Feature', detail: 'Owns one user-facing workflow.' },
	{ number: '03', name: 'Entity', detail: 'Keeps models, services, and view-model state together.' },
	{ number: '04', name: 'Repository', detail: 'Isolates HTTP and persistence contracts.' },
]

const qualitySignals = [
	['Server rendering', 'React Router owns the request, document, and hydration lifecycle.'],
	['Replaceable boundaries', 'Needle DI swaps effectful adapters without service locators.'],
	['Enforced direction', 'ESLint checks imports across app, pages, features, entities, and shared.'],
	['Real delivery gates', 'TypeScript, Vitest, Playwright, Axe, Knip, and CI ship configured.'],
]

export const HomePage = reatomComponent(() => {
	const templateModuleStore = useService(TemplateModuleStore)
	const postsStore = useService(PostsStore)
	const hydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
	const selectedItems = hydrated ? templateModuleStore.selectedItems() : []

	return (
		<Stack gap={0}>
			<section className="home-hero" aria-labelledby="home-title">
				<div className="home-hero__eyebrow">
					<span aria-hidden="true" />
					Production-oriented React foundation
				</div>
				<Title order={1} id="home-title" className="home-hero__title">
					Ship the product.
					<br />
					<span>Keep the architecture.</span>
				</Title>
				<Text className="home-hero__copy">
					A removable reference application for teams that want SSR, explicit
					boundaries, typed data flow, and serious quality gates without a private
					framework.
				</Text>
				<Group mt="xl" gap="sm">
					<Button component="a" href="#live-api" size="md">Inspect the live API flow</Button>
					<Button component="a" href="#architecture" variant="default" size="md">
						View the system map
					</Button>
				</Group>

				<div className="home-hero__facts" aria-label="Starter capabilities">
					<div>
						<strong>React 19</strong>
						<span>stable runtime</span>
					</div>
					<div>
						<strong>SSR</strong>
						<span>framework-owned</span>
					</div>
					<div>
						<strong>6 layers</strong>
						<span>lint-enforced</span>
					</div>
					<div>
						<strong>4 gates</strong>
						<span>before merge</span>
					</div>
				</div>
			</section>

			<section id="architecture" className="home-section" aria-labelledby="architecture-title">
				<div className="home-section__heading">
					<div>
						<Text className="home-kicker">System map</Text>
						<Title order={2} id="architecture-title">Clear ownership from screen to network.</Title>
					</div>
					<Text>
						Each layer does one job. Dependencies move downward; effectful adapters
						are selected once at the composition root.
					</Text>
				</div>

				<div className="architecture-flow">
					{architectureLayers.map(layer => (
						<article key={layer.name}>
							<Text ff="monospace" className="architecture-flow__number">{layer.number}</Text>
							<Title order={3}>{layer.name}</Title>
							<Text>{layer.detail}</Text>
						</article>
					))}
				</div>
			</section>

			<section className="home-section" aria-labelledby="catalog-title">
				<div className="home-section__heading">
					<div>
						<Text className="home-kicker">Interactive reference</Text>
						<Title order={2} id="catalog-title">Explore what ships in the starter.</Title>
					</div>
					<Text>Search and persist a selection to see state, service, repository, and storage boundaries working together.</Text>
				</div>

				<Card className="selection-panel" padding="lg" radius="md">
					<Group justify="space-between" align="center" wrap="nowrap">
						<Stack gap={3}>
							<Text size="xs" ff="monospace" className="selection-panel__label">SELECTED MODULES</Text>
							<Text size="sm" c="var(--color-text-muted)">
								{selectedItems.length
									? selectedItems.map(item => item.title).join(' · ')
									: 'Nothing selected yet. Selection is persisted through shared storage.'}
							</Text>
						</Stack>
						<Button
							variant="subtle"
							disabled={!selectedItems.length}
							onClick={wrap(templateModuleStore.clearSelected)}
						>
							Clear
						</Button>
					</Group>
				</Card>

				<Box mt="lg">
					{hydrated
						? (
								<TemplateCatalogInjector value={{ templateModuleStore }}>
									<TemplateCatalogEntry />
								</TemplateCatalogInjector>
							)
						: (
								<Box role="status" aria-label="Loading catalog">
									<Loader aria-hidden="true" size="sm" />
								</Box>
							)}
				</Box>
			</section>

			<section id="live-api" className="home-section" aria-labelledby="api-title">
				<div className="home-section__heading">
					<div>
						<Group gap="xs">
							<Text className="home-kicker">Live boundary</Text>
							<Badge variant="light">JSONPlaceholder</Badge>
						</Group>
						<Title order={2} id="api-title">A real request, without leaking transport into UI.</Title>
					</div>
					<Text>The repository owns the endpoint contract, the service maps DTOs, and the view model owns loading, errors, and retry.</Text>
				</div>

				{hydrated
					? (
							<PostsFeedInjector value={{ postsStore }}>
								<PostsFeedEntry />
							</PostsFeedInjector>
						)
					: (
							<Box role="status" aria-label="Loading posts">
								<Loader aria-hidden="true" size="sm" />
							</Box>
						)}
			</section>

			<section className="home-section home-section--last" aria-labelledby="quality-title">
				<div className="home-section__heading">
					<div>
						<Text className="home-kicker">Engineering baseline</Text>
						<Title order={2} id="quality-title">Boring where reliability matters.</Title>
					</div>
					<Text>The starter chooses explicit conventions over clever infrastructure. Remove the demo; keep the gates.</Text>
				</div>
				<SimpleGrid cols={{ base: 1, sm: 2 }} spacing={0} className="quality-grid">
					{qualitySignals.map(([title, detail]) => (
						<div key={title}>
							<Title order={3}>{title}</Title>
							<Text>{detail}</Text>
						</div>
					))}
				</SimpleGrid>
			</section>
		</Stack>
	)
}, 'HomePage')
