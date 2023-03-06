<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import smallBackgroundPhoto from '$lib/assets/smallBg.jpg';
	import bigBackgroundPhoto from '$lib/assets/bigBg.jpg';
	import bigBackgroundPhoto2 from '$lib/assets/bigHomebg3.jpg';
	import Carousel from '../lib/Carousel.svelte';
	import { alertStore } from './customStores';

	let textShowing = false;

	onMount(() => {
		textShowing = true;
	});
</script>

<section>
	<picture>
		<source srcset={smallBackgroundPhoto} media="(max-width: 800px)" />
		<source srcset={bigBackgroundPhoto2} />
		<img class="bg-img" src={smallBackgroundPhoto} alt="background-hat" />
	</picture>

	{#if textShowing}
		<div class="cta-container">
			<h2 class="text-3xl" in:fly={{ y: -20, duration: 1000, delay: 400 }}>Hand Burned Hats</h2>

			<div class="button-container">
				<a class="text" href="/custom-order" in:fly={{ y: -20, duration: 1000, delay: 800 }}
					>Custom Order</a
				>
				<a class="text" href="/inventory" in:fly={{ y: -20, duration: 1000, delay: 800 }}
					>Inventory</a
				>
			</div>
		</div>
	{/if}
</section>

<Carousel autoPlay={5000} storagePath={'homepageCarousel'} />

<style>
	section {
		position: relative;
		max-height: 500px;
		overflow-y: hidden;
	}
	picture {
		transition: all 0.5s ease;
	}
	.bg-img {
		width: 100%;
		z-index: 1;
		/* filter: brightness(0.6); */
		pointer-events: none;
	}

	.cta-container {
		position: absolute;
		bottom: 0px;
		right: 500px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* padding: 30px 15px; */
		color: hsl(var(--b2));
		height: 250px;
		transition: all 0.5s ease;
	}
	h2 {
		font-family: lato-bolditalic;
		font-size: 42px;
	}

	.button-container {
		display: flex;
		justify-content: space-between;
		width: 267px;
		margin-top: 15px;
	}
	a {
		text-align: center;
		align-self: flex-end;
		font-family: lato-light;
		width: 121px;
		padding: 15px 0;
		border: 1px solid hsl(var(--b2));
	}
	@media screen and (max-width: 800px) {
		.cta-container {
			right: 15px;
		}
		h2 {
			font-size: 28px;
		}
	}
	@media screen and (max-width: 1400px) and (min-width: 800px) {
		.cta-container {
			right: 200px;
		}
		h2 {
			font-size: 32px;
		}
	}
</style>
