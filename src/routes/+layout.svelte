<script lang="ts">
	import '../app.css';
	import { authClient } from '$lib/auth-client';
	import {
		Header,
		SkipToContent,
		Content,
		SideNav,
		SideNavItems,
		SideNavLink,
		HeaderUtilities,
		HeaderGlobalAction
	} from 'carbon-components-svelte';

	import { Login, Logout } from 'carbon-icons-svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import Notifications from '$lib/components/Notifications.svelte';

	let { children } = $props();

	const session = authClient.useSession();
	let isSideNavOpen = $state(false);
</script>

<Header
	href="/"
	persistentHamburgerMenu={$session.data ? true : false}
	company="IBM"
	platformName="Carbon Svelte"
	bind:isSideNavOpen
>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<ThemeSwitcher />
		{#if !$session.data}
			<HeaderGlobalAction
				iconDescription="Log in"
				tooltipAlignment="end"
				icon={Login}
				on:click={async () => {
					await authClient.signIn.oauth2({
						providerId: 'ibm',
						callbackURL: '/'
					});
				}}
			></HeaderGlobalAction>
		{:else}
			<HeaderGlobalAction
				iconDescription="Log out"
				tooltipAlignment="end"
				icon={Logout}
				on:click={async () => {
					await authClient.signOut();
					window.location.reload();
				}}
			/>
		{/if}
	</HeaderUtilities>
</Header>
{#if $session.data}
	<SideNav bind:isOpen={isSideNavOpen}>
		<SideNavItems>
			<SideNavLink text="Link 1" />
			<SideNavLink text="Link 2" />
			<SideNavLink text="Link 3" />
		</SideNavItems>
	</SideNav>
{/if}
<Notifications />
<Content>
	{@render children()}
</Content>
