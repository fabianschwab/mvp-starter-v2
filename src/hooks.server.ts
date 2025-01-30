import { auth } from '$lib/server/auth';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';

const betterAuth: Handle = async ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth });
};

const themeSetter: Handle = async ({ event, resolve }) => {
	let theme = event.cookies.get('theme');

	if (!theme) {
		// Default theme when nothing set
		theme = 'g10';
	}
	return await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('theme=""', `theme="${theme}"`);
		}
	});
};

const secureRoutes: Handle = async ({ event, resolve }) => {
	const exceptions = ['/', '/api/health', '/api/health/ready'];

	if (exceptions.includes(event.url.pathname)) {
		console.debug('DEBUG: ', `Route ${event.url.pathname} is public.`);
		return resolve(event);
	}

	// API
	if (event.url.pathname.startsWith('/api')) {
		const authHeader = event.request.headers.get('Authorization');

		if (!authHeader) {
			console.error('ERROR: ', `API route ${event.url.pathname} called without authentication.`);
			return error(401, 'Unauthorized');
		}

		const [, token] = authHeader.split(' ');
		if (!token || token !== env.API_KEY) {
			console.error('ERROR: ', `API route ${event.url.pathname} called without or wrong api key.`);
			return error(401, 'Unauthorized');
		}
		console.debug('DEBUG: ', `Secure API route ${event.url.pathname} is called.`);
		return resolve(event);
	}

	// Non API
	const session = await auth.api.getSession({
		headers: event.request.headers
	});
	if (session) {
		console.debug(
			'DEBUG: ',
			`User ${session.user.name} is calling protected route ${event.url.pathname}.`
		);
		return resolve(event);
	}

	// If user is not signed in or session is no longer valid, redirect to login for all other routes
	return redirect(303, '/');
};

export const handle: Handle = sequence(betterAuth, secureRoutes, themeSetter);
