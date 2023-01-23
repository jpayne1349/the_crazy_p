<script lang="ts">
	import { carouselStore, firebaseStore, alertStore } from '../../../../customStores';
	import { doc, updateDoc } from 'firebase/firestore';
	import { ref, deleteObject } from 'firebase/storage';
	import CarouselPhoto from './CarouselPhoto.svelte';
	import AddItem from './AddItem.svelte';
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import type { SortableEvent } from 'sortablejs';
	import type { CrazyCarouselItem } from 'src/routes/customTypes';

	let storeLoading = true;
	let sortableContainer: HTMLElement;

	onMount(checkForStore);

	function checkForStore() {
		if ($carouselStore) {
			storeLoading = false;
			return;
		}
		setTimeout(checkForStore, 250);
	}

	$: if (sortableContainer != undefined) {
		makeSortable();
	}

	// run after storLoading = false, create the sortable object.
	function makeSortable() {
		var sortable = Sortable.create(sortableContainer, {
			handle: '.drag-handle',
			animation: 150,
			direction: 'vertical',
			ghostClass: 'ghost',
			onEnd: updateCarouselItems
		});
	}

	async function updateCarouselItems(
		evt: SortableEvent | null,
		options?: { justRemovedItem?: boolean }
	) {
		if (evt) {
			if (evt.oldIndex == evt.newIndex) return;
		}

		try {
			for (let n = 0; n < sortableContainer.children.length; n++) {
				let element = sortableContainer.children[n];
				let oldIndex = element.getElementsByClassName('index');

				if (options?.justRemovedItem) {
					if ($carouselStore.photos[n]) {
						$carouselStore.photos[n].index = n;
					}
				} else {
					//@ts-ignore
					$carouselStore.photos[parseInt(oldIndex[0].textContent)].index = n;
				}

				oldIndex[0].textContent = n.toString();
				element.setAttribute('data-id', n.toString());
			}

			let docRef = doc($firebaseStore.db, 'content-management', 'carousel');
			let update = await updateDoc(docRef, {
				photos: $carouselStore.photos
			});

			alertStore.set({
				show: true,
				type: 'success',
				message: 'Success! Changes Saved.'
			});
		} catch (e) {
			console.log(e);

			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! Something went wrong.'
			});
			alertStore.set({
				show: true,
				type: 'error',
				message: 'Please refresh the page...'
			});
		}
	}

	async function removeCarouselItem(evt: CustomEvent) {
		let removedPhotoFilename: string | undefined;

		for (let item of $carouselStore.photos) {
			if (item.index == evt.detail) {
				$carouselStore.photos.splice(item.index, 1);
				removedPhotoFilename = item.filename;
			}
		}
		$carouselStore.photos = $carouselStore.photos;

		try {
			// remove photo from storage
			let photoStorageRef = ref(
				$firebaseStore.storage,
				'/homepageCarousel/' + removedPhotoFilename
			);
			let deletePhoto = await deleteObject(photoStorageRef);
		} catch (e) {
			console.log(e);
			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! Something went wrong.'
			});
			alertStore.set({
				show: true,
				type: 'error',
				message: 'Please refresh the page...'
			});
			return;
		}

		setTimeout(() => updateCarouselItems(null, { justRemovedItem: true }), 200);
	}
</script>

<h2>CAROUSEL PHOTOS</h2>
<div class="separation-bar" />

{#if storeLoading}
	<div class="loading-container">
		<div class="loading-spinner" />
	</div>
{:else}
	<div class="sortable-container" bind:this={sortableContainer}>
		{#each $carouselStore.photos as photo (photo.filename)}
			<CarouselPhoto {photo} on:delete={removeCarouselItem} />
		{/each}
	</div>
	<AddItem />
{/if}

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
		padding: 0 100px;
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
	@media screen and (max-width: 800px) {
		.sortable-container {
			padding: 0;
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
