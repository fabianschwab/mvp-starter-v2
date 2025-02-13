import { checkDrizzleConnection } from '$lib/server/db';
import { json } from '@sveltejs/kit';

/*
 * Readiness Probe
 * Sometimes, applications are temporarily unable to serve traffic.
 * For example, an application might need to load large data or configuration files during startup,
 * or depend on external services after startup. In such cases, you don't want to kill the application,
 * but you don't want to send it requests either. Kubernetes provides readiness probes to detect and mitigate these situations.
 * A pod with containers reporting that they are not ready does not receive traffic through Kubernetes Services.
 *
 * Check if all needed services are connected
 *
 * - PostgreSQL
 * - Kafka / Event Streams
 */

export async function GET() {
	const postgres = await checkDrizzleConnection();

	const overallStatus = postgres && true;

	return json(
		{
			status: overallStatus ? 'ready' : 'not ready',
			uptime: process.uptime(),
			services: {
				postgres: postgres ? 'up' : 'down'
			}
		},
		{ status: overallStatus ? 200 : 503 }
	);
}
