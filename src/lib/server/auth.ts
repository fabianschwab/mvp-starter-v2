import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { genericOAuth } from 'better-auth/plugins';
import { db } from './db';
import { env } from '$env/dynamic/private';
import * as schema from './db/schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: schema
	}),
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: 'ibm',
					clientId: env.APPID_CLIENT_ID as string,
					clientSecret: env.APPID_CLIENT_SECRET as string,
					discoveryUrl: env.APPID_DISCOVERY_URL as string
				}
			]
		})
	],
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60 // 5 min cache duration in seconds (reduces the db calls)
		},
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
	},
	rateLimit: {
		window: 10, // time window in seconds
		max: 100 // max requests in the window
	}
});
