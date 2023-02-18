<script lang="ts">
	import { alertStore } from '../routes/customStores';
	import { fly } from 'svelte/transition';
	import type { CrazyAlert } from '../routes/customTypes';

	let alertQueue: CrazyAlert[] = [];
	let alertActive = false;

	let activeAlert: CrazyAlert;

	let unsub = alertStore.subscribe((alertObject) => {
		//console.log('store updated to: ', alertObject);

		if (alertActive) {
			alertQueue.push(alertObject);
			//console.log('next alert pushed onto queue', alertQueue);
			return;
		}

		if (alertObject?.show) {
			activeAlert = alertObject;
			alertActive = true;

			setTimeout(() => {
				alertActive = false;

				if (alertQueue.length > 0) {
					let nextAlert = alertQueue[0]; // the length check above will make sure this is not undefined

					// remove the first element from the queue...
					alertQueue.splice(0, 1);

					//@ts-ignore
					setTimeout(() => {
						alertStore.set(nextAlert);
					}, 500);
				}
			}, 4000);
		}
	});
</script>

{#if alertActive}
	<div class="wrapper" transition:fly={{ y: 50 }}>
		<div class="alert-container {activeAlert.type}">
			{#if activeAlert.type == 'error'}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			{:else if activeAlert.type == 'success'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
			{:else if activeAlert.type == 'info'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="h-6 w-6 flex-shrink-0 stroke-current"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
			{/if}
			<span>{activeAlert.message}</span>
		</div>
	</div>
{/if}

<style>
	svg {
		width: 24px;
		height: 24px;
		stroke: white;
		margin: 0 15px;
	}
	.alert-container {
		background-color: hsl(var(--er));
		display: flex;
		align-items: center;
		width: 400px;
		border-radius: 10px;
		font-family: lato-bold;
		height: 60px;
		font-size: 18px;
		box-shadow: 0px 1px 2px hsl(var(--ac));
		color: white;
	}
	.alert-container.success {
		background-color: hsl(var(--su));
	}
	.alert-container.info {
		background-color: hsl(var(--in));
	}
	.wrapper {
		display: flex;
		justify-content: center;
		width: 100%;
		position: fixed;
		bottom: 15px;
	}
</style>
