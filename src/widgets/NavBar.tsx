import type { NavigationItem } from '@/shared/navigation.types'
import { Anchor, Box, Container, Group, Text } from '@mantine/core'
import { Link, NavLink } from 'react-router'
import { APP_CONFIG } from '@/shared/config'
import { SvgIcon } from '@/shared/ui/SvgIcon'

export function NavBar({ items }: { items: NavigationItem[] }) {
	return (
		<Box component="header" className="app-header">
			<Container size="lg">
				<Group h={64} justify="space-between">
					<Anchor component={Link} to="/" underline="never">
						<Group component="span" gap="xs" wrap="nowrap">
							<SvgIcon name="app" width={20} height={20} />
							<Text fw={800} c="dark">{APP_CONFIG.name}</Text>
						</Group>
					</Anchor>

					<Group component="nav" aria-label="Primary navigation" gap="xs">
						{items.map(item => (
							<Anchor
								key={item.path}
								component={NavLink}
								to={item.path}
								end={item.path === '/'}
								underline="never"
								className="app-header__link"
							>
								{item.label}
							</Anchor>
						))}
					</Group>
				</Group>
			</Container>
		</Box>
	)
}
