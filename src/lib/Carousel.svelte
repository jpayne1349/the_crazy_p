<script lang="ts">
	import Siema from 'siema';
	import { onMount } from 'svelte';
	import { firebaseStore, carouselStore } from '../routes/customStores';
	import { ref, listAll, getDownloadURL } from 'firebase/storage';
	import type { FirebaseStorage } from 'firebase/storage';
	import type { CrazyCarouselItem } from '../routes/customTypes';
	import { fly } from 'svelte/transition';

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
	export let dragDistanceRequired = 5;
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
	let windowWidth: number;
	let imagesLoaded: number = 0;
	let controllerCreated: boolean = false;
	let dotsArray: number[] = [];
	let totalPhotoCount: number;
	let loadingDotActive: boolean = true;

	onMount(() => {
		firebaseStore.subscribe((storeData) => {
			if (storeData && !sourceListPopulated) {
				if (windowWidth > 800) {
					elementsPerPage = 3;
				}
				console.log('storeData active', new Date());
				getSourceListV2(storeData.storage);
			}
		});
	});

	// used in conjunction with the carouselStore to index the photos in a certain order.. specific to this use case
	async function getSourceListV2(storageRef: FirebaseStorage) {
		//console.log('getting source list v2', $carouselStore);
		if (!$carouselStore) {
			setTimeout(getSourceListV2, 200);
			return;
		}

		let sortedArray = $carouselStore.photos.sort((a, b) => {
			return a.index - b.index;
		});
		totalPhotoCount = $carouselStore.photos.length;

		let loopPass = 0;
		// ****** Below is slow.. takes 3-6 seconds
		for (let photoObject of sortedArray) {
			loopPass += 1;
			let fileRef = ref($firebaseStore.storage, storagePath + '/' + photoObject.filename);
			let photoUrl = await getDownloadURL(fileRef);
			photoObject.generatedUrl = photoUrl;
			if (photoObject.inventoryName) {
				let newElem = createCarouselImageElement(photoUrl, {
					isLink: true,
					inventoryName: photoObject.inventoryName
				});
			} else {
				let newElem = createCarouselImageElement(photoUrl);
			}
		}
		console.log('urls retrieved', new Date());
		sourceListPopulated = true;
	}

	// should work for all use cases, just does not account for indexing photos differently
	async function getSourceList(storageRef: FirebaseStorage) {
		let folderRef = ref(storageRef, storagePath);

		let tempList: string[] = [];

		let storageResponse = await listAll(folderRef);

		for (let fileRef of storageResponse.items) {
			let newUrl = await getDownloadURL(fileRef);

			tempList = [...tempList, newUrl];
		}

		//srcList = [...tempList];
		sourceListPopulated = true;

		createController();
	}

	function createController() {
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
			onInit: () => {
				controllerCreated = true;
				showCarousel = true;
			},
			onChange: () => {
				if (showPositionDots) {
					updatePositionDots();
				}
			}
		});

		return startCarousel();
	}

	function startCarousel() {
		console.log('carousel starting', new Date());
		pausedAutoPlay = false;
		// may have to wait until image.onload is called?

		// showCarousel = true;

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

	function linkClicked() {
		console.log('linkClicked');
	}

	function createCarouselImageElement(
		src: string,
		options?: { isLink: boolean; inventoryName: string }
	) {
		let imageElement = document.createElement('img');
		imageElement.src = src;
		imageElement.className = 'carousel-item';
		imageElement.alt = 'Custom Hat';
		imageElement.addEventListener('ontouchstart', pauseCarousel);
		imageElement.addEventListener('mousedown', pauseCarousel);

		if (options?.isLink) {
			let availableNowDiv = document.createElement('div');
			availableNowDiv.className = 'carousel-link-banner';
			availableNowDiv.innerText = 'Available Now';

			let linkWrapper = document.createElement('a');
			linkWrapper.className = 'carousel-link-container';
			linkWrapper.href = '/inventory/' + options.inventoryName;

			linkWrapper.appendChild(availableNowDiv);
			linkWrapper.appendChild(imageElement);

			imageElement.onload = (ev) => {
				imageLoadedListener(ev, linkWrapper);
			};
			return;
		}

		imageElement.onload = (ev) => {
			imageLoadedListener(ev, imageElement);
		};
	}

	function imageLoadedListener(event: any, elem: HTMLImageElement | HTMLAnchorElement) {
		dotsArray = [...dotsArray, imagesLoaded]; // starts at zero, has to come before increment
		imagesLoaded += 1;
		if (controllerCreated) {
			carouselController.append(elem);
		} else {
			carouselElement.appendChild(elem);
		}
		if (imagesLoaded == elementsPerPage) {
			createController();
		}
		if (imagesLoaded == totalPhotoCount) {
			loadingDotActive = false;
		}
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

<section>
	<div class="loading-placeholder" class:active={!showCarousel}>
		<div />
		<div />
		<div />
	</div>
	<div bind:this={carouselElement} class="carousel-container" class:active={showCarousel} />

	{#if showPositionDots}
		<ul class="carousel-dot-container" class:active={true}>
			{#each dotsArray as dot}
				<li id={dot.toString()} class:active={activeDot == dot} in:fly={{ x: 15 }} />
			{/each}
			<li class="dot-loader" class:show={loadingDotActive} />
		</ul>
	{/if}
</section>

<style>
	section {
		margin: 50px 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		/* overflow-y: hidden; */
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
	:global(.carousel-item) {
		width: 20vw;
		margin: 0 2.5vw;
	}
	.loading-placeholder.active div {
		content: '';
		animation-duration: 3s;
		animation-fill-mode: forwards;
		animation-iteration-count: infinite;
		animation-name: shimmer;
		animation-timing-function: linear;
		background: hsl(var(--b3));
		background: linear-gradient(to right, #eaeaea 8%, #f6f6f6 18%, #eaeaea 33%) fixed;
		background-size: 1200px 100%;
		width: 20vw;
		height: 20vw;
		margin: 0 2.5vw;
		display: block;
		border-radius: 2px;
	}
	.loading-placeholder {
		display: flex;
	}
	:global(.carousel-link-container) {
		position: relative;
	}
	:global(.carousel-link-banner) {
		display: block;
		position: absolute;
		left: 32px;
		top: 21px;
		border: 1px solid hsl(var(--a));
		padding: 0px 20px;
		font-family: lato-bold;
		border-radius: 5px;
		font-size: 12px;
		color: hsl(var(--b1));
		background-color: hsl(var(--a));
		z-index: 10;
		width: 122px;
		text-align: center;
	}

	.carousel-dot-container {
		display: flex;
		list-style-type: none;
		justify-content: center;
		width: 100%;
		transition: all 0.5s ease;
		opacity: 0;
	}
	.carousel-dot-container.active {
		opacity: 1;
	}
	.carousel-dot-container li {
		margin: 6px;
		border-radius: 100%;
		background-color: hsl(var(--b1));
		border: 1px solid hsl(var(--b3));
		height: 8px;
		width: 8px;
		transition: all 0.2s ease;
	}
	li.dot-loader.show {
		animation-name: spin;
		animation-duration: 0.8s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		border: none;
		border-right: transparent;
		border-top: 1px solid hsl(var(--b3));
		display: block;
	}
	li.dot-loader {
		display: none;
	}
	.carousel-dot-container li.active {
		background-color: hsl(var(--b3));
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
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
			width: 100vw;
			height: 91vw;
			padding-left: 5vw;
		}
		:global(.carousel-item) {
			width: 90vw;
			height: 90vw;
			margin: 0;
		}
		.loading-placeholder.active {
			width: 90vw;
			height: 90vw;
			content: '';
			animation-duration: 3s;
			animation-fill-mode: forwards;
			animation-iteration-count: infinite;
			animation-name: shimmer;
			animation-timing-function: linear;
			background: hsl(var(--b3));
			background: linear-gradient(to right, #eaeaea 8%, #f6f6f6 18%, #eaeaea 33%) fixed;
			background-size: 1200px 100%;
			margin: 0 2.5vw;
			display: block;
			border-radius: 2px;
		}
		.loading-placeholder.active div {
			display: none;
		}
		:global(.carousel-link-banner) {
			display: block;
			position: absolute;
			left: 4px;
			top: 20px;
			border: 1px solid hsl(var(--a));
			padding: 0px 20px;
			font-family: lato-bold;
			border-radius: 5px;
			font-size: 14px;
			color: hsl(var(--b1));
			background-color: hsl(var(--a));
			z-index: 10;
			width: 150px;
			text-align: center;
		}
	}
</style>
