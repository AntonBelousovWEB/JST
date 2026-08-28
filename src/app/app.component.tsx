import type { Container } from '@needle-di/core'
import type { ReactNode } from 'react'
import { createTheme, MantineProvider } from '@mantine/core'
import { APP_CONFIG } from '@/shared/config'
import { AppContainerProvider } from './container/container.provider'

const theme = createTheme({
	autoContrast: true,
	primaryColor: APP_CONFIG.primaryColor,
})

export function AppProviders({
	container,
	children,
}: {
	container: Container
	children: ReactNode
}) {
	return (
		<AppContainerProvider container={container}>
			<MantineProvider defaultColorScheme={APP_CONFIG.colorScheme} theme={theme}>
				{children}
			</MantineProvider>
		</AppContainerProvider>
	)
}
