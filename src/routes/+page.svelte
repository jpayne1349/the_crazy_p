<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import smallBackgroundPhoto from '$lib/assets/smallBg.jpg';
	import bigBackgroundPhoto from '$lib/assets/bigBg.jpg';
	import Carousel from '../lib/Carousel.svelte';

	let textShowing = false;

	onMount(() => {
		textShowing = true;
	});
</script>

<svelte:head>
	<title>The Crazy P | Custom Hats</title>

	<!-- TODO: @owner fills out content -->
	<meta name="description" content="google displays this" />
</svelte:head>

<section>
	<picture>
		<source
			srcset={smallBackgroundPhoto}
			alt="Custom Hat as Background"
			media="(max-width: 800px)"
		/>
		<source srcset={bigBackgroundPhoto} alt="Custom Hat as Background" />
		<img class="bg-img" src={smallBackgroundPhoto} alt="background-hat" />
	</picture>

	{#if textShowing}
		<div class="cta-container">
			<h4 class="text" in:fly={{ y: -20, duration: 1000, delay: 0 }}>Custom Made, $500 & Under</h4>
			<h2 class="text-3xl" in:fly={{ y: -20, duration: 1000, delay: 400 }}>Hand Burned Hats</h2>

			<a class="text" href="/customs" in:fly={{ y: -20, duration: 1000, delay: 800 }}>ORDER NOW</a>
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
		filter: brightness(0.7);
		pointer-events: none;
	}

	.cta-container {
		position: absolute;
		bottom: 0px;
		right: 400px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 30px 15px;
		color: hsl(var(--b2));
		height: 250px;
		transition: all 0.5s ease;
	}
	h2 {
		font-family: lato-bolditalic;
		font-size: 42px;
	}
	h4 {
		font-family: lato-light;
		font-size: 24px;
	}
	a {
		text-align: center;
		align-self: flex-end;
		font-family: lato-light;
		width: 80%;
		padding: 15px 0;
		border: 1px solid hsl(var(--b2));
		/* box-shadow: 0px 1px 4px hsl(var(--b2)) inset, 0px -1px 4px hsl(var(--b2)) inset; */
		margin-top: 20px;
		margin-right: 10px;
	}
	@media screen and (max-width: 800px) {
		.cta-container {
			right: 25px;
		}
		h2 {
			font-size: 28px;
		}
		h4 {
			font-size: 16px;
		}
	}
	@media screen and (max-width: 1400px) and (min-width: 800px) {
		.cta-container {
			right: 150px;
		}
		h2 {
			font-size: 32px;
		}
		h4 {
			font-size: 20px;
		}
	}
</style>
