import type { ReactNode } from 'react'
import type { Route } from './+types/root'
import { useState } from 'react'
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Scripts,
	ScrollRestoration,
} from 'react-router'
import { AppProviders } from './app/app.component'
import { BaseLayout } from './app/baseLayout.component'
import { createAppContainer } from './app/container/container'
import '@mantine/core/styles.css'
import './index.css'

export const headers: Route.HeadersFunction = () => ({
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'X-Content-Type-Options': 'nosniff',
	'X-XSS-Protection': '0',
})

export function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function Root() {
	const [container] = useState(createAppContainer)

	return (
		<AppProviders container={container}>
			<BaseLayout />
		</AppProviders>
	)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	const notFound = isRouteErrorResponse(error) && error.status === 404
	const title = notFound
		? 'Page not found | Frontend Starter'
		: 'Error | Frontend Starter'

	return (
		<>
			<title>{title}</title>
			<meta name="robots" content="noindex" />
			<main>
				<h1>{notFound ? '404' : 'Something went wrong'}</h1>
				<p>{notFound ? 'The requested page was not found.' : 'Please try again later.'}</p>
			</main>
		</>
	)
}
