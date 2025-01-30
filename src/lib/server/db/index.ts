import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL);

export const db = drizzle(client);

export async function checkDrizzleConnection() {
	try {
		await db.execute('SELECT 1'); // A simple query to check the connection
		console.debug('DEBUG: ', 'Connection to the database is successful!');
		return true;
	} catch (error) {
		console.error('ERROR: ', 'Connection to the database failed:', error);
	}
	return false;
}
