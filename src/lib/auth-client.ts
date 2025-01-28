import { createAuthClient } from 'better-auth/svelte'; // make sure to import from better-auth/svelte
import { genericOAuthClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	baseURL: 'http://localhost:5173',
	plugins: [genericOAuthClient()]
});
