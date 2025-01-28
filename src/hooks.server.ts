import { auth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';

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

export const handle: Handle = sequence(betterAuth, themeSetter);
