<script lang="ts">
	import { alertStore, firebaseStore, ownerStore } from '../../customStores';
	import { afterUpdate, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { signOut } from 'firebase/auth';

	let userAuthenticated = false;
	let authChecks = 0;
	let pageViewingTitle = '';
	let pageViewingPath = '';

	onMount(awaitAuth);

	async function awaitAuth() {
		// check if user is authenticated
		if (get(ownerStore)) {
			if ($ownerStore.loggedIn) {
				userAuthenticated = true;

				let monitorAuth = ownerStore.subscribe(async (data) => {
					if (!data.loggedIn) {
						await goto('/owner-login');
					}
				});
				return;
			}
		}

		authChecks += 1;
		if (authChecks > 4) {
			await goto('/owner-login');
		} else {
			setTimeout(awaitAuth, 500);
		}
	}

	afterUpdate(updateHeader);

	function updateHeader() {
		let pagePath = $page.url.pathname;
		pageViewingPath = pagePath;

		let pageArray: string[] = pagePath.split('/');

		if (pageArray.length > 3) {
			pageArray.pop();
			let backPath = pageArray.join('/');
			pageViewingPath = backPath;
		}

		if (pageArray.length > 2) {
			let tempString = pageArray[2];
			let displayString = '';
			if (tempString.includes('-')) {
				let tempArray = tempString.split('-');
				for (let entry of tempArray) {
					displayString += entry;
					displayString += ' ';
				}
			}
			pageViewingTitle = displayString.toUpperCase();
		} else {
			pageViewingTitle = '';
		}
	}

	async function logoutUser() {
		$ownerStore.loggedIn = false;

		await signOut($firebaseStore.auth);

		alertStore.set({
			show: true,
			type: 'info',
			message: 'Logged Out'
		});
	}

	function fullTimestampToDisplay(millis: string) {
		let millisTime = parseInt(millis);
		console.log(millisTime);

		let date = new Date(millisTime);

		let localString = date.toLocaleString();

		return localString;
	}
</script>

{#if userAuthenticated}
	<div class="cms-title">
		<a href="/cms">CMS &nbsp; </a>
		{#if pageViewingTitle != ''}
			<a href={pageViewingPath}> &#8594 &nbsp;{pageViewingTitle}</a>
		{/if}
	</div>

	<section><slot /></section>

	<div class="separation-bar" />

	<div class="user-info-container">
		<div class="user-info-row">
			<p class="user-label">Logged in as: &nbsp;</p>
			<p class="user-data">
				{#if $firebaseStore.auth.currentUser}
					{$firebaseStore.auth.currentUser.email}
				{/if}
			</p>
		</div>
		<div class="user-info-row">
			<p class="user-label">Last Login: &nbsp;</p>
			<p class="user-data">
				{#if $firebaseStore.auth.currentUser}
					{#if $firebaseStore.auth.currentUser.metadata.lastLoginAt}
						{fullTimestampToDisplay($firebaseStore.auth.currentUser.metadata.lastLoginAt)}
					{/if}
				{/if}
			</p>
		</div>
		<div class="user-info-row">
			<button class="logout btn" on:click={logoutUser}> Log Out </button>
		</div>
	</div>
{:else}
	<div class="loading-container">
		<div class="loading-spinner" />
	</div>
{/if}

<style>
	.user-info-container {
		display: flex;
		flex-direction: column;
		margin: 5px auto 25px;
		max-width: 900px;
	}
	.user-info-row {
		display: flex;
	}
	.logout {
		margin-top: 15px;
		margin-bottom: 50px;
	}
	.separation-bar {
		width: 90%;
		height: 1px;
		background-color: hsl(var(--nf));
		border-radius: 1px;
		margin: 50px auto;
	}
	.cms-title {
		margin: 85px auto 25px;
		max-width: 800px;
	}
	.cms-title a {
		font-family: lato-regular;
		text-align: left;
		font-size: 20px;
		margin: 0 0px;
	}

	section {
		min-height: 75vh;
		margin: 0 auto 50px;
		max-width: 800px;
	}
	.loading-container {
		min-height: 500px;
		margin-bottom: 400px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loading-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid hsl(var(--a));
		border-right: 2px solid transparent;
		width: 80px;
		height: 80px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 0px;
	}
	@media screen and (max-width: 800px) {
		section {
			min-height: 600px;
			margin: 0 25px;
			max-width: 100vw;
		}
		.cms-title,
		.user-info-container {
			margin-left: 25px;
		}
		.loading-container {
			min-height: 500px;
			margin-bottom: 400px;
		}
	}
	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
