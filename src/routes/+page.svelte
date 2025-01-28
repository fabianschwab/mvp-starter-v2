<script lang="ts">
	import { authClient } from '$lib/auth-client';
	const session = authClient.useSession();
</script>

<div>
	{#if $session.data}
		<pre>
				{JSON.stringify($session?.data?.user, null, 2)}
		</pre>
	{/if}
</div>
