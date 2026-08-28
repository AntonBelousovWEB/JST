import type { Post } from '../model/types'
import { Card, Group, Text, Title } from '@mantine/core'
import './postCard.css'

export function PostCard({ post, index }: { post: Post, index: number }) {
	return (
		<Card className="post-card" padding="lg" radius="md">
			<Group justify="space-between" mb="xl">
				<Text className="post-card__index" ff="monospace">{String(index + 1).padStart(2, '0')}</Text>
				<Text className="post-card__author" size="xs">{post.author}</Text>
			</Group>
			<Title order={3} className="post-card__title">{post.title}</Title>
			<Text className="post-card__excerpt" size="sm">{post.excerpt}</Text>
		</Card>
	)
}
