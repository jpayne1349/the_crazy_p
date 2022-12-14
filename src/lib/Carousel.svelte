<script lang="ts">
	import Siema from 'siema';
	import { onMount } from 'svelte';
	import { firebaseStore } from '../routes/customStores.js';
	import { ref, listAll, getDownloadURL } from 'firebase/storage';
	import type { FirebaseStorage } from 'firebase/storage';

	// always required list of image sources
	export let autoPlay = 4000;
	export let pauseAutoPlayDuration = 10000;
	export let showPositionDots = true;
	export let storagePath = '';

	// SiemaOptions list for constructor
	export let transitionDuration = 400;
	export let easingFunction = 'ease-out';
	export let elementsPerPage = 1;
	export let startIndex = 0;
	export let draggable = true;
	export let multipleDrag = true;
	export let dragDistanceRequired = 20;
	export let loop = true;
	export let rightToLeft = false;

	// bound to the DOM element below
	let carouselElement: HTMLElement;
	let autoPlayHandler: NodeJS.Timer;
	let carouselController: Siema;
	let pauseAutoPlayHandler: NodeJS.Timer;
	let pausedAutoPlay = false;
	$: activeDot = 0;
	let showCarousel = false;
	let sourceListPopulated = false;
	// get's filled with the urls for the firebase storage
	let srcList: string[] = [];
	let windowWidth: number;

	onMount(() => {
		firebaseStore.subscribe((storeData) => {
			if (storeData && !sourceListPopulated) {
				if (windowWidth > 800) {
					elementsPerPage = 3;
				}
				getSourceList(storeData.storage);
			}
		});
	});

	async function getSourceList(storageRef: FirebaseStorage) {
		let folderRef = ref(storageRef, storagePath);

		let tempList: string[] = [];

		let storageResponse = await listAll(folderRef);

		for (let fileRef of storageResponse.items) {
			let newUrl = await getDownloadURL(fileRef);

			tempList = [...tempList, newUrl];
		}

		srcList = [...tempList];
		sourceListPopulated = true;

		createController();
	}

	function createController() {
		// this is here to prevent jumping the gun on the controller creation, the element needs to be filled with img's first.
		if (carouselElement.children.length < srcList.length) {
			setTimeout(createController, 200);
			return;
		}

		carouselController = new Siema({
			selector: carouselElement,
			duration: transitionDuration,
			easing: easingFunction,
			perPage: elementsPerPage,
			startIndex: startIndex,
			draggable: draggable,
			multipleDrag: multipleDrag,
			threshold: dragDistanceRequired,
			loop: loop,
			rtl: rightToLeft,
			onInit: () => {},
			onChange: () => {
				if (showPositionDots) {
					updatePositionDots();
				}
			}
		});

		return startCarousel();
	}

	function startCarousel() {
		pausedAutoPlay = false;
		// may have to wait until image.onload is called?

		setTimeout(() => (showCarousel = true), 500);

		// start the autoPlay type movement
		autoPlayHandler = setInterval(() => {
			// only move the carousel if the tab/window is in view of the user
			if (!document.hidden) {
				carouselController.next();
			}
		}, autoPlay);
	}

	function pauseCarousel() {
		if (!carouselController) return;

		if (!pausedAutoPlay) {
			// stop auto play, and set pause timer

			clearInterval(autoPlayHandler);

			pauseAutoPlayHandler = setTimeout(startCarousel, pauseAutoPlayDuration);
			pausedAutoPlay = true;
		} else {
			// refresh pause timer
			clearInterval(pauseAutoPlayHandler);

			pauseAutoPlayHandler = setTimeout(startCarousel, pauseAutoPlayDuration);
		}
	}

	function updatePositionDots() {
		activeDot = carouselController.currentSlide;
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

<section>
	<div class="loading-placeholder" class:active={!showCarousel} />
	<div bind:this={carouselElement} class="carousel-container" class:active={showCarousel}>
		{#if sourceListPopulated}
			{#each srcList as src}
				{console.log(src)}
				<img
					class="carousel-item"
					{src}
					alt="Custom Hand Burned Hat"
					on:touchstart={pauseCarousel}
					on:mousedown={pauseCarousel}
				/>
			{/each}
		{/if}
	</div>

	{#if showPositionDots}
		<ul class:active={showCarousel}>
			{#each srcList as src, index}
				<li id={index.toString()} class:active={activeDot == index} />
			{/each}
		</ul>
	{/if}
</section>

<style>
	section {
		margin: 100px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		overflow-y: hidden;
	}
	.carousel-container {
		width: 75vw;
		overflow: hidden;
		height: 20vw;
		transition: all 0.5s ease;
		opacity: 0;
	}
	.carousel-container.active {
		opacity: 1;
	}
	.carousel-item {
		width: 20vw;
		margin: 0 2.5vw;
	}
	.loading-placeholder.active {
		animation-duration: 3.2s;
		animation-fill-mode: forwards;
		animation-iteration-count: infinite;
		animation-name: shimmer;
		animation-timing-function: linear;
		background: hsl(var(--b3));
		background: linear-gradient(to right, #f6f6f6 8%, #f0f0f0 18%, #f6f6f6 33%);
		background-size: 1200px 100%;
		width: 70vw;
		height: 20vw;
		position: absolute;
		display: block;
	}
	.loading-placeholder {
		display: none;
	}

	ul {
		display: flex;
		list-style-type: none;
		justify-content: center;
		width: 100%;
		transition: all 0.5s ease;
		opacity: 0;
	}
	ul.active {
		opacity: 1;
	}
	ul li {
		margin: 6px;
		border-radius: 100%;
		background-color: hsl(var(--b1));
		border: 1px solid hsl(var(--b3));
		height: 8px;
		width: 8px;
		transition: all 0.2s ease;
	}
	ul li.active {
		background-color: hsl(var(--b3));
	}

	@keyframes shimmer {
		0% {
			background-position: -1200px 0;
		}
		100% {
			background-position: 1200px 0;
		}
	}

	@media screen and (max-width: 800px) {
		ul {
			display: flex;
		}
		.carousel-container {
			width: 85vw;
			height: 85vw;
		}
		.carousel-item {
			width: 85vw;
			height: 85vw;
			margin: 0;
		}
		.loading-placeholder.active {
			width: 85vw;
			height: 85vw;
		}
	}
</style>
