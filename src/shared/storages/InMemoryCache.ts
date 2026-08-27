import type { Cache } from './types'

export class InMemoryCache<T> implements Cache<T> {
	private cache = new Map<string, { data: T, timestamp: number }>()

	constructor(private readonly ttl: number = 5 * 60 * 1000) {}

	get(key: string): T | null {
		const entry = this.cache.get(key)

		if (!entry) {
			return null
		}

		const isExpired = Date.now() - entry.timestamp > this.ttl

		if (isExpired) {
			this.cache.delete(key)
			return null
		}

		return entry.data
	}

	has(key: string): boolean {
		return this.cache.has(key)
	}

	set(key: string, value: T): void {
		this.cache.set(key, { data: value, timestamp: Date.now() })
	}

	clear(): void {
		this.cache.clear()
	}
}
