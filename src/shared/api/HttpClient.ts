import type {
	ApiResponse,
	RequestOptions,
	SearchParams,
} from './types'

export class HttpClient {
	private baseUrl: string
	public headers?: Record<string, string>

	private token?: string

	constructor(init: { baseUrl: string, headers?: Record<string, string> }) {
		this.baseUrl = init.baseUrl
		this.headers = init.headers
	}

	setToken(token: string) {
		this.token = token
	}

	private createSearchParams(params: SearchParams) {
		const searchParams = new URLSearchParams()

		for (const key in params) {
			if (Object.hasOwn(params, key)) {
				const value = params[key]

				if (Array.isArray(value)) {
					value.forEach(currentValue =>
						searchParams.append(key, currentValue),
					)
				}
				else if (value) {
					searchParams.set(key, value)
				}
			}
		}

		return `?${searchParams.toString()}`
	}

	private async request<T>(
		endpoint: string,
		method: RequestInit['method'],
		options: RequestOptions = {},
	): ApiResponse<T> {
		let url = `${this.baseUrl}/${endpoint}`
		if (options.params) {
			url += this.createSearchParams(options.params)
		}

		const config = {
			...options,
			url: endpoint,
			method,
			headers: {
				...(!!options?.headers && options.headers),
				...this.headers,
				...(!!this.token && { Authorization: `Bearer ${this.token}` }),
			},
		}

		const response: Response = await fetch(url, config)

		return {
			success: response.ok,
			status: response.status,
			statusText: response.statusText,
			data: (await response.json()) as unknown as T,
		}
	}

	get<T>(endpoint: string, options: Omit<RequestOptions, 'body'> = {}) {
		return this.request<T>(endpoint, 'GET', options)
	}

	delete<T>(endpoint: string, options: Omit<RequestOptions, 'body'> = {}) {
		return this.request<T>(endpoint, 'DELETE', options)
	}

	post<T>(
		endpoint: string,
		body?: Record<string, unknown>,
		options: RequestOptions = {},
	) {
		return this.request<T>(endpoint, 'POST', {
			...options,
			...(!!body && { body: JSON.stringify(body) }),
		})
	}

	put<T>(
		endpoint: string,
		body?: Record<string, unknown>,
		options: RequestOptions = {},
	) {
		return this.request<T>(endpoint, 'PUT', {
			...options,
			...(!!body && { body: JSON.stringify(body) }),
		})
	}

	patch<T>(
		endpoint: string,
		body?: Record<string, unknown>,
		options: RequestOptions = {},
	) {
		return this.request<T>(endpoint, 'PATCH', {
			...options,
			...(!!body && { body: JSON.stringify(body) }),
		})
	}
}

export const httpClient = new HttpClient({
	baseUrl: '/api',
})
