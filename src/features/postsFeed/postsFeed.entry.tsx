import { Alert, Box, Button, Group, Loader, SimpleGrid, Stack, Text } from '@mantine/core'
import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { PostCard } from '@/entities/post/ui/postCard.component'
import { usePostsFeedService } from './postsFeed.injector'
import './postsFeed.css'

export const PostsFeedEntry = reatomComponent(() => {
	const { postsStore } = usePostsFeedService()
	const posts = postsStore.posts.data()
	const error = postsStore.posts.error()
	const ready = postsStore.posts.ready()

	return (
		<Stack gap="lg">
			<Group justify="space-between" align="center">
				<Group gap="xs">
					<span className="request-status" aria-hidden="true" />
					<Text size="xs" ff="monospace" c="var(--color-text-muted)">
						GET /posts?userId=1
					</Text>
				</Group>
				<Button
					variant="subtle"
					size="compact-sm"
					disabled={!ready}
					onClick={wrap(postsStore.refresh)}
				>
					Refresh response
				</Button>
			</Group>

			{!ready && !posts.length && (
				<Box className="api-loading" role="status" aria-live="polite">
					<Loader size="sm" aria-hidden="true" />
					<Text size="sm" c="var(--color-text-muted)">Requesting typed DTOs…</Text>
				</Box>
			)}

			{error && (
				<Alert color="red" title="The demo API is unavailable">
					{error.message}
					{' '}
					Use “Refresh response” to try again.
				</Alert>
			)}

			{posts.length > 0 && (
				<SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
					{posts.map((post, index) => (
						<PostCard key={post.id} post={post} index={index} />
					))}
				</SimpleGrid>
			)}
		</Stack>
	)
}, 'PostsFeedEntry')
