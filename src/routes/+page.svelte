<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data }: LayoutProps = $props();
</script>

<div>
	<pre>{JSON.stringify(data.user, null, 2)}</pre>
</div>
