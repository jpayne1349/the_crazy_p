<script lang="ts">
	import { customOrderTemplateStore, firebaseStore, alertStore } from '../../../customStores';
	import Arrow from '$lib/Arrow.svelte';
	import { doc, updateDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let templateLoading = true;

	onMount(checkForStore);

	function checkForStore() {
		if ($customOrderTemplateStore) {
			templateLoading = false;
			return;
		}
		setTimeout(checkForStore, 250);
	}

	async function updateLeadtime() {
		// submit changes to firebase and show alert success / fail
		try {
			let docRef = doc($firebaseStore.db, 'content-management', 'custom-order');
			let update = await updateDoc(docRef, {
				leadTime: $customOrderTemplateStore.leadTime
			});

			alertStore.set({
				show: true,
				type: 'success',
				message: 'Success! Change Saved'
			});
		} catch (e) {
			console.log(e);

			alertStore.set({
				show: true,
				type: 'error',
				message: 'Save Failed. Please try again.'
			});
		}
	}

	async function updateStatus() {
		//@ts-ignore
		let updatedStatus = this.checked;

		$customOrderTemplateStore.available = updatedStatus;

		// submit changes to firebase and show alert success / fail
		try {
			let docRef = doc($firebaseStore.db, 'content-management', 'custom-order');
			let update = await updateDoc(docRef, {
				available: updatedStatus
			});

			alertStore.set({
				show: true,
				type: 'success',
				message: 'Success! Change Saved'
			});
		} catch (e) {
			console.log(e);

			alertStore.set({
				show: true,
				type: 'error',
				message: 'Save Failed. Please try again.'
			});
		}
	}
</script>

<div class="button-container">
	<a href="/cms/manage-site/custom-order-form">
		Custom Order Form
		<Arrow />
	</a>
	<a href="/cms/manage-site/homepage-carousel">
		Homepage Carousel
		<Arrow />
	</a>
</div>

{#if templateLoading}
	<div class="loading-container">
		<div class="loading-spinner" />
	</div>
{:else}
	<div class="status-container">
		<h3 class="status-title">Custom Order Status</h3>
		<div class="toggle-row">
			<p class="closed-label">Closed</p>

			<input
				type="checkbox"
				class="toggle toggle-lg toggle-success"
				bind:checked={$customOrderTemplateStore.available}
				on:click={updateStatus}
			/>
			<p class="open-label">Open</p>
		</div>
	</div>

	<div class="leadtime-container">
		<h4 class="leadtime-title">Current lead time:</h4>
		<form class="input-container" on:submit|preventDefault={updateLeadtime}>
			<input
				class="leadtime"
				type="text"
				placeholder="New Message"
				required
				bind:value={$customOrderTemplateStore.leadTime}
			/>
			<button type="submit">UPDATE</button>
		</form>
	</div>
{/if}

<style>
	.button-container {
		display: flex;
		justify-content: center;
	}
	a {
		font-family: lato-regular;
		font-size: 22px;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		text-align: center;
		height: 225px;
		width: 250px;
		margin-left: 25px;
		border: solid 1px hsl(var(--n));
		border-radius: 2px;
		transition: all 0.2s;
	}
	a:hover {
		border: solid 1px hsl(var(--nf));
	}

	.input-container {
		display: flex;
		width: 300px;
		margin: 0 auto;
		border: 1px solid hsl(var(--n));
		border-radius: 2px;
	}
	input.leadtime {
		background-color: hsl(var(--bg));
		font-size: 18px;
		flex-grow: 1;
		flex-basis: 150px;
		height: 45px;
		padding-left: 10px;
		outline: none;
	}
	button {
		font-family: lato-regular;
		width: 70px;
		background-color: hsl(var(--n));
		border-radius: 8px;
		margin: 4px;
		font-size: 14px;
		flex-grow: 0;
	}
	.status-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 50px 0;
	}
	.status-title {
		font-family: lato-bold;
		font-size: 22px;
	}
	.toggle-row {
		display: flex;
		align-items: center;
		margin-top: 15px;
		font-size: 18px;
	}
	.toggle {
		margin: 0 10px;
	}
	.open-label {
		color: hsl(var(--su));
	}
	.closed-label {
		color: grey;
	}
	.leadtime-title {
		font-family: lato-bold;
		font-size: 20px;
		margin-bottom: 10px;
		text-align: center;
	}
	.loading-container {
		min-height: 300px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loading-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid hsl(var(--a));
		border-right: 2px solid transparent;
		width: 40px;
		height: 40px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 0px;
	}
	@media screen and (max-width: 800px) {
		.button-container {
			display: flex;
			justify-content: space-around;
		}
		a {
			height: 40vw;
			width: 40vw;
			margin: 0;
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
