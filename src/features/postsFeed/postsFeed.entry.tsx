import { Alert, Box, Button, Group, Loader, Stack, Text } from '@mantine/core'
import { wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { PostCard } from '@/entities/post/ui/postCard.component'
import styles from './postsFeed.entry.module.css'
import { usePostsFeedService } from './postsFeed.injector'

export const PostsFeedEntry = reatomComponent(() => {
	const { postsStore } = usePostsFeedService()
	const posts = postsStore.posts.data()
	const error = postsStore.posts.error()
	const ready = postsStore.posts.ready()
	const pending = postsStore.posts.pending() > 0
	const refreshing = postsStore.refresh.pending() > 0

	return (
		<Stack gap="lg">
			<Group justify="space-between" align="center">
				<Group gap="xs">
					<span className={styles.requestStatus} data-pending={pending || refreshing || undefined} aria-hidden="true" />
					<Text size="xs" ff="monospace" c="var(--color-text-muted)">
						GET /posts?userId=1
					</Text>
					<Text className={styles.requestState} aria-live="polite">
						{pending || refreshing ? 'syncing' : 'ready'}
					</Text>
				</Group>
				<Button
					variant="subtle"
					size="compact-sm"
					disabled={!ready || refreshing}
					loading={refreshing}
					onClick={wrap(() => postsStore.refresh())}
				>
					{refreshing ? 'Refreshing response' : 'Refresh response'}
				</Button>
			</Group>

			{!ready && !posts.length && (
				<Box className={styles.apiLoading} role="status" aria-live="polite">
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
				<Stack className={styles.postsList} data-pending={refreshing || undefined} gap={0}>
					{posts.map((post, index) => (
						<PostCard key={post.id} post={post} index={index} />
					))}
				</Stack>
			)}
		</Stack>
	)
}, 'PostsFeedEntry')
