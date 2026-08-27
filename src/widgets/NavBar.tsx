import type { Route } from '@/shared/routes'
import { Anchor, Box, Container, Group, Text } from '@mantine/core'
import { Link, NavLink } from 'react-router'
import { ROUTES } from '@/shared/routes'

export function NavBar({ routes }: { routes: Route[] }) {
	return (
		<Box component="header" className="app-header">
			<Container size="lg">
				<Group h={64} justify="space-between">
					<Anchor component={Link} to={ROUTES.HOME.path} underline="never">
						<Text fw={800} c="dark">
							Frontend Starter
						</Text>
					</Anchor>

					<Group gap="xs">
						{routes.map(route => (
							<Anchor
								key={route.path}
								component={NavLink}
								to={route.path}
								end={route.path === ROUTES.HOME.path}
								underline="never"
								className="app-header__link"
							>
								{route.label}
							</Anchor>
						))}
					</Group>
				</Group>
			</Container>
		</Box>
	)
}
