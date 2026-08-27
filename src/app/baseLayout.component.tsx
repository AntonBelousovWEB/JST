import { Container } from '@mantine/core'
import { Outlet } from 'react-router'
import { getRoutes } from '@/shared/routes'
import { NavBar } from '@/widgets/NavBar'

export function BaseLayout() {
	return (
		<>
			<NavBar routes={getRoutes()} />
			<Container component="main" size="lg">
				<Outlet />
			</Container>
		</>
	)
}
