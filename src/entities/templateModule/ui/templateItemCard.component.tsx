import type { TemplateItemCardProps } from './types'
import { Badge, Button, Card, Group, Text, Title } from '@mantine/core'
import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import './templateItemCard.css'

export const TemplateItemCard = reatomComponent(
	({ item, onToggleSelected }: TemplateItemCardProps) => {
		const isSelected = item.isSelected()

		return (
			<Card className="template-item-card" radius="md" padding="lg" h="100%">
				<Group justify="space-between" align="flex-start" mb="md">
					<Badge variant="light">{item.badge}</Badge>
					<Text className="template-item-card__area" size="xs" tt="uppercase" fw={700}>
						{item.area}
					</Text>
				</Group>

				<Title order={3} className="template-item-card__title" mb="xs">
					{item.title}
				</Title>

				<Text className="template-item-card__description" size="sm" mb="xl">
					{item.description}
				</Text>

				<Button
					mt="auto"
					fullWidth
					variant={isSelected ? 'filled' : 'light'}
					onClick={wrap(() => onToggleSelected(item.id))}
				>
					{isSelected ? 'Selected' : 'Select example'}
				</Button>
			</Card>
		)
	},
)
