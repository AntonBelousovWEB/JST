import type { Container } from '@needle-di/core'
import type { ReactNode } from 'react'
import { MantineProvider } from '@mantine/core'
import { AppContainerProvider } from './container/container.provider'

export function AppProviders({
	container,
	children,
}: {
	container: Container
	children: ReactNode
}) {
	return (
		<AppContainerProvider container={container}>
			<MantineProvider defaultColorScheme="light">
				{children}
			</MantineProvider>
		</AppContainerProvider>
	)
}
