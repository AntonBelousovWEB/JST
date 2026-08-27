import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const projectName = getProjectName()
const demoDependencies = ['@reatom/core', '@reatom/react']

const demoPaths = [
	'src/entities/templateModule',
	'src/features/templateCatalog',
	'src/shared/dto/templateItemDto.types.ts',
	'src/shared/lib/react.ts',
	'e2e/template-catalog',
]

for (const demoPath of demoPaths) {
	await rm(resolve(root, demoPath), { force: true, recursive: true })
}

const homePageDir = resolve(root, 'src/pages/_index')

await mkdir(homePageDir, { recursive: true })
await writeFile(
	resolve(homePageDir, 'route.tsx'),
	`import { Container, Stack, Text, Title } from '@mantine/core'

export default function HomePage() {
\treturn (
\t\t<>
\t\t\t<title>${toTitle(projectName)}</title>
\t\t\t<meta name="description" content="${toTitle(projectName)} web application." />
\t\t\t<Container size="sm" py="xl">
\t\t\t\t<Stack gap="sm">
\t\t\t\t\t<Title order={1}>${toTitle(projectName)}</Title>
\t\t\t\t\t<Text c="dimmed">
\t\t\t\t\t\tThe starter example has been removed. Begin building your app here.
\t\t\t\t\t</Text>
\t\t\t\t</Stack>
\t\t\t</Container>
\t\t</>
\t)
}
`,
)

await writeFile(
	resolve(root, 'src/app/container/container.context.ts'),
	`import type { Container } from '@needle-di/core'
import { createContext } from 'react'

export const AppContainerContext = createContext<Container | null>(null)
`,
)

await updatePackageJson()
await updatePackageLock()
await writeReadme()
await rm(resolve(root, 'scripts/reset-template.mjs'), { force: true })

console.log(`Template example removed for ${projectName}.`)
console.log('Start from src/pages/_index/route.tsx')

function getProjectName() {
	const nameIndex = process.argv.indexOf('--name')
	const explicitName = nameIndex >= 0 ? process.argv[nameIndex + 1] : null

	return sanitizePackageName(explicitName || basename(process.cwd()))
}

function sanitizePackageName(value) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9._-]+/g, '-')
		.replace(/^-+|-+$/g, '')
		|| 'new-project'
}

function toTitle(value) {
	return value
		.split(/[-_]/)
		.filter(Boolean)
		.map(part => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ')
}

async function readJson(path) {
	return JSON.parse(await readFile(path, 'utf-8'))
}

async function writeJson(path, value) {
	await writeFile(path, `${JSON.stringify(value, null, '\t')}\n`)
}

async function updatePackageJson() {
	const packageJsonPath = resolve(root, 'package.json')
	const packageJson = await readJson(packageJsonPath)

	packageJson.name = projectName
	delete packageJson.scripts['template:reset']
	for (const dependency of demoDependencies) {
		delete packageJson.dependencies[dependency]
	}

	await writeJson(packageJsonPath, packageJson)
}

async function updatePackageLock() {
	const packageLockPath = resolve(root, 'package-lock.json')
	const packageLock = await readJson(packageLockPath)

	packageLock.name = projectName
	if (packageLock.packages?.['']) {
		packageLock.packages[''].name = projectName
		for (const dependency of demoDependencies) {
			delete packageLock.packages[''].dependencies?.[dependency]
			delete packageLock.packages[`node_modules/${dependency}`]
		}
	}

	await writeJson(packageLockPath, packageLock)
}

async function writeReadme() {
	await writeFile(
		resolve(root, 'README.md'),
		`# ${toTitle(projectName)}

React application created from Frontend Starter.

## Development

\`\`\`bash
npm ci
npm run dev
\`\`\`

## Scripts

- \`npm run dev\` — React Router SSR development server.
- \`npm run typecheck\` — generate route types and run TypeScript.
- \`npm run build\` — create production client and server builds.
- \`npm start\` — serve the production build.
- \`npm test\` — run Vitest in watch mode.
- \`npm run test:unit\` — run unit and integration tests once.
- \`npm run test:e2e\` — run the SSR, route-error, hydration, and accessibility smoke tests.
- \`npm run lint\` — run type-aware ESLint.
- \`npm run knip\` — find unused files, exports, and dependencies.
- \`npm run check\` — run the local CI quality gate.

Route modules are discovered from \`src/pages\` at build time. Start the
application in \`src/pages/_index/route.tsx\` and keep lower layers independent
of \`app\` and \`pages\`. Add Playwright tests by product area under \`e2e/\`;
keep universal SSR and accessibility checks in \`e2e/smoke/\`.
`,
	)
}
