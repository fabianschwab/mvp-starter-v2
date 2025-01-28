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
	]
});
