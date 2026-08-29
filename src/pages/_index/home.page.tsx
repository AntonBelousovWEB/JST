import { Badge, Box, Button, Group, Loader, Stack, Text, Title } from '@mantine/core'
import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { useEffect, useRef, useSyncExternalStore } from 'react'
import { useService } from '@/app/container/container.context'
import { PostsStore } from '@/entities/post/posts.store'
import { TemplateModuleStore } from '@/entities/templateModule/templateModule.store'
import { PostsFeedEntry } from '@/features/postsFeed/postsFeed.entry'
import { PostsFeedInjector } from '@/features/postsFeed/postsFeed.injector'
import { TemplateCatalogEntry } from '@/features/templateCatalog/templateCatalog.entry'
import { TemplateCatalogInjector } from '@/features/templateCatalog/templateCatalog.injector'
import styles from './home.page.module.css'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

const requestPath = [
	['01', 'Page', 'compose dependencies'],
	['02', 'Feature', 'own the user flow'],
	['03', 'Store', 'loading, errors, actions'],
	['04', 'Service', 'run the use case'],
	['05', 'Repository', 'declare the endpoint'],
	['06', 'HttpClient', 'execute the request'],
]

const stack = ['React 19', 'React Router', 'TypeScript', 'Reatom', 'Needle DI', 'Mantine']

function useScrollReveal() {
	const rootRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const root = rootRef.current
		if (!root) {
			return
		}

		const elements = root.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group]')
		if (
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
			|| !('IntersectionObserver' in window)
		) {
			return
		}

		root.dataset.motion = 'ready'
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					(entry.target as HTMLElement).dataset.visible = 'true'
					observer.unobserve(entry.target)
				}
			}
		}, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 })

		elements.forEach(element => observer.observe(element))
		return () => observer.disconnect()
	}, [])

	return rootRef
}

export const HomePage = reatomComponent(() => {
	const pageRef = useScrollReveal()
	const templateModuleStore = useService(TemplateModuleStore)
	const postsStore = useService(PostsStore)
	const hydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
	const selectedItems = hydrated ? templateModuleStore.selectedItems() : []

	return (
		<Stack ref={pageRef} className={styles.page} gap={0}>
			<section className={styles.homeHero} aria-labelledby="home-title">
				<div className={styles.heroCopy}>
					<Text className={styles.kicker}>React 19 / SSR / TypeScript</Text>
					<Title order={1} id="home-title" className={styles.heroTitle}>
						A React starter without the starter debt.
					</Title>
					<Text className={styles.heroLead}>
						Routing, DI, view models, tests, and CI are already wired as a removable
						reference app—not a framework you have to fight.
					</Text>
					<Group mt="xl" gap="sm">
						<Button component="a" href="#quick-start" size="md">Start a project</Button>
						<Button component="a" href="#request-flow" variant="default" size="md">
							See the request pipeline
						</Button>
					</Group>
				</div>

				<aside id="quick-start" className={styles.quickStart} aria-label="Quick start commands">
					<div className={styles.quickStartBar}>
						<span>quick-start</span>
						<span>zsh</span>
					</div>
					<div className={styles.quickStartBody}>
						<p>
							<span>$</span>
							{' '}
							npm ci
						</p>
						<p>
							<span>$</span>
							{' '}
							npm run template:setup
						</p>
						<p>
							<span>$</span>
							{' '}
							npm run dev
						</p>
						<div className={styles.quickStartResult}>
							<span>ready</span>
							<strong>localhost:5173</strong>
						</div>
					</div>
				</aside>
			</section>

			<div className={styles.stackStrip} data-reveal="up" aria-label="Included technologies">
				{stack.map(item => <span key={item}>{item}</span>)}
			</div>

			<section id="request-flow" className={styles.section} aria-labelledby="request-flow-title">
				<div className={styles.sectionHeading} data-reveal="up">
					<div>
						<Text className={styles.kicker}>Working code, not a diagram</Text>
						<Title order={2} id="request-flow-title">Follow one request through every boundary.</Title>
					</div>
					<Text>
						The demo calls JSONPlaceholder. Transport data stays below the service;
						the UI receives a domain model and explicit async state.
					</Text>
				</div>

				<div className={styles.requestLab}>
					<ol className={styles.requestPath} data-reveal-group="left" aria-label="Request architecture">
						{requestPath.map(([number, name, detail]) => (
							<li key={name}>
								<span>{number}</span>
								<div>
									<strong>{name}</strong>
									<small>{detail}</small>
								</div>
							</li>
						))}
					</ol>

					<div className={styles.requestPreview} data-reveal="right">
						<div className={styles.requestPreviewBar}>
							<span>live response</span>
							<Badge className={styles.requestBadge} variant="light">JSONPlaceholder</Badge>
						</div>
						{hydrated
							? (
									<PostsFeedInjector value={{ postsStore }}>
										<PostsFeedEntry />
									</PostsFeedInjector>
								)
							: (
									<Box className={styles.apiLoading} role="status" aria-label="Loading posts">
										<Loader aria-hidden="true" size="sm" />
									</Box>
								)}
					</div>
				</div>
			</section>

			<section id="playground" className={styles.section} aria-labelledby="playground-title">
				<div className={styles.sectionHeading} data-reveal="up">
					<div>
						<Text className={styles.kicker}>Small state playground</Text>
						<Title order={2} id="playground-title">Search it. Select it. Reload it.</Title>
					</div>
					<Text>
						A second, local-only slice shows the same boundaries with persistence
						instead of HTTP. The setup CLI can remove both demos.
					</Text>
				</div>

				<div className={styles.selectionPanel} data-reveal="up">
					<div>
						<span>selected</span>
						<strong>
							{selectedItems.length
								? selectedItems.map(item => item.title).join(' / ')
								: 'Nothing selected yet.'}
						</strong>
					</div>
					<Button
						variant="subtle"
						disabled={!selectedItems.length}
						onClick={wrap(templateModuleStore.clearSelected)}
					>
						Clear
					</Button>
				</div>

				<Box mt="lg" data-reveal="up">
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

			<section className={styles.deliveryStrip} aria-labelledby="delivery-title">
				<div data-reveal="left">
					<Text className={styles.kicker}>Before every pull request</Text>
					<Title order={2} id="delivery-title">One command. The whole baseline.</Title>
				</div>
				<code data-reveal="right">
					<span>$</span>
					{' '}
					npm run check
				</code>
				<ul data-reveal="up" aria-label="Quality gates">
					<li>ESLint</li>
					<li>Vitest</li>
					<li>TypeScript</li>
					<li>Build</li>
					<li>Knip</li>
				</ul>
			</section>
		</Stack>
	)
}, 'HomePage')
