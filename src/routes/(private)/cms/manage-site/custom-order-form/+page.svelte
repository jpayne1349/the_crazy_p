<script lang="ts">
	import Field from './Field.svelte';
	import { customOrderTemplateStore, firebaseStore, alertStore } from '../../../../customStores';
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import type { SortableEvent } from 'sortablejs';
	import { writable } from 'svelte/store';
	import { doc, setDoc } from 'firebase/firestore';
	import { beforeNavigate } from '$app/navigation';
	import AddField from './AddField.svelte';

	let storeLoading = true;
	let sortableContainer: HTMLElement;
	let saveRequired = false;
	let saving = false;
	let forceNavigate = false;
	let emphasizeSave = false;

	let updateTracker = writable({
		templateUpdated: false,
		firebaseUpdated: false
	});

	updateTracker.subscribe((data) => {
		if (data.templateUpdated && data.firebaseUpdated) {
			saveRequired = false;
			data.templateUpdated = false;
			data.firebaseUpdated = false;
			return data;
		}
		if (data.templateUpdated) {
			saveRequired = true;
		}
	});

	onMount(awaitTemplateLoad);

	// one-time popup if trying to leave before saving.
	beforeNavigate((navigation) => {
		if (forceNavigate) return;

		if ($updateTracker.templateUpdated == true && $updateTracker.firebaseUpdated == false) {
			navigation.cancel();
			alert('You have unsaved changes.');
			forceNavigate = true;
			window.scrollTo({
				top: 9000,
				left: 0,
				behavior: 'smooth'
			});
			emphasizeSave = true;
		}
	});

	function awaitTemplateLoad() {
		if ($customOrderTemplateStore) {
			storeLoading = false;
			setTimeout(makeSortable, 200);
			return;
		}
		setTimeout(awaitTemplateLoad, 200);
	}

	function makeSortable() {
		var sortable = Sortable.create(sortableContainer, {
			handle: '.drag-handle',
			animation: 150,
			direction: 'vertical',
			ghostClass: 'ghost',
			onEnd: updateTemplateIndexes
		});
	}

	async function updateTemplateIndexes() {
		let movedFields = sortableContainer.children;
		for (let n = 0; n < sortableContainer.children.length; n++) {
			let element = sortableContainer.children[n];
			let fieldNameElem = element.getElementsByClassName('field-name');
			let foundName = fieldNameElem[0].textContent;

			for (let field of $customOrderTemplateStore.fields) {
				if (field.name == foundName) {
					field.index = n;
					break;
				}
			}

			let positionElement = element.getElementsByClassName('position');
			positionElement[0].textContent = n.toString();

			$updateTracker.templateUpdated = true;
		}
		saveToFirebase();
	}

	async function saveToFirebase() {
		if (saving) return;

		if ($updateTracker.templateUpdated == false) {
			alertStore.set({
				show: true,
				type: 'info',
				message: 'No changes detected!'
			});
			return;
		}

		saving = true;

		try {
			let docRef = doc($firebaseStore.db, 'content-management', 'custom-order');
			let update = await setDoc(docRef, $customOrderTemplateStore);

			alertStore.set({
				show: true,
				type: 'success',
				message: 'Success! Changes Saved.'
			});
			$updateTracker.firebaseUpdated = true;

			saving = false;
		} catch (e) {
			console.log(e);

			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! Something went wrong.'
			});
			saving = false;
		}
	}
</script>

<h2>CUSTOM ORDER FORM</h2>
<div class="separation-bar" />
{#if storeLoading}
	<div class="loading-container">
		<div class="loading-spinner" />
	</div>
{:else}
	<div class="sortable-container" bind:this={sortableContainer}>
		{#each $customOrderTemplateStore.fields as field}
			<Field fieldObject={field} {updateTracker} on:delete={updateTemplateIndexes} />
		{/each}
	</div>
{/if}
<AddField
	on:fieldAdded={() => {
		$updateTracker.templateUpdated = true;
	}}
/>
<button class="save-update" on:click={saveToFirebase} class:emphasize={emphasizeSave}>
	<p>
		{#if saving}
			<div class="button-spinner" />
		{:else}
			SAVE & UPDATE
		{/if}
	</p>
</button>

<style>
	h2 {
		text-align: center;
		font-family: lato-light;
		font-size: 24px;
	}
	.separation-bar {
		width: 100%;
		height: 1px;
		background-color: hsl(var(--n));
		border-radius: 1px;
	}
	.sortable-container {
		margin-bottom: 25px;
		margin-top: 5px;
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
		width: 60px;
		height: 60px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 0px;
	}
	.button-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid hsl(var(--ac));
		border-right: 2px solid transparent;
		width: 20px;
		height: 20px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 0px;
	}

	button.save-update {
		display: flex;
		width: 100%;
		border: 1px solid rgb(125, 124, 124);
		justify-content: center;
		align-items: center;
		height: 55px;
		font-size: 14px;
		font-family: lato-regular;
		margin: 25px 0;
	}
	button.emphasize {
		animation-name: glowing;
		animation: glowing 3s ease infinite;
	}

	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes glowing {
		0% {
			box-shadow: none;
		}
		50% {
			box-shadow: 0px 0px 15px hsl(var(--su));
		}
		100% {
			box-shadow: none;
		}
	}
</style>
