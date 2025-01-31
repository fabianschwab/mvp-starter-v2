<script lang="ts">
	import '../app.css';
	import { authClient } from '$lib/client/auth-client';
	import {
		Header,
		SkipToContent,
		Content,
		SideNav,
		SideNavItems,
		SideNavLink,
		HeaderUtilities,
		HeaderGlobalAction,
		HeaderAction,
		HeaderPanelDivider,
		HeaderPanelLink,
		HeaderPanelLinks
	} from 'carbon-components-svelte';

	import { Login, Logout, UserAvatar } from 'carbon-icons-svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import Notifications from '$lib/components/Notifications.svelte';

	let { children, data } = $props();

	let isSideNavOpen = $state(false);
</script>

<Header
	href="/"
	persistentHamburgerMenu={data.session ? true : false}
	company="IBM"
	platformName="Carbon Svelte"
	bind:isSideNavOpen
>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<ThemeSwitcher />
		{#if data.session}
			<HeaderAction icon={UserAvatar}>
				<div class="welcome">Welcome</div>
				<div class="user">{data.user?.name}</div>
				<HeaderPanelLinks>
					<HeaderPanelDivider>Settings</HeaderPanelDivider>
					<HeaderPanelLink href="/">Example Entry</HeaderPanelLink>
				</HeaderPanelLinks>
			</HeaderAction>
			<HeaderGlobalAction
				iconDescription="Log out"
				tooltipAlignment="end"
				icon={Logout}
				on:click={async () => {
					await authClient.signOut();
					window.location.reload();
				}}
			/>
		{:else}
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
		{/if}
	</HeaderUtilities>
</Header>
{#if data.session}
	<SideNav bind:isOpen={isSideNavOpen}>
		<SideNavItems>
			<SideNavLink text="Notifications" href="/notifications" />
			<SideNavLink text="Link 2" />
			<SideNavLink text="Link 3" />
		</SideNavItems>
	</SideNav>
{/if}
<Notifications />
<Content>
	{@render children()}
</Content>

<style>
	.user {
		margin-left: 1rem;
		font-size: x-large;
	}
	.welcome {
		margin-top: 1rem;
		margin-left: 1rem;
	}
</style>
