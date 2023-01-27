<script lang="ts">
	import smallCustomOrder from '$lib/assets/smallCustomOrder.jpeg';
	import bigCustomOrder from '$lib/assets/bigCustomOrder.jpg';
	import bigCustomOrder2 from '$lib/assets/bigCustomOrder2.jpeg';
	import CustomOrderForm from './CustomOrderForm.svelte';
	import CustomsClosed from './CustomsClosed.svelte';
	import { customOrderTemplateStore, customOrderForm } from '../../customStores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let templateLoaded = false;
	let customsAvailable: boolean;

	onMount(loadTemplate);

	function loadTemplate() {
		if ($customOrderTemplateStore == undefined) {
			setTimeout(loadTemplate, 200);
			return;
		}
		customsAvailable = $customOrderTemplateStore.available;
		customOrderForm.set({
			fields: $customOrderTemplateStore.fields,
			name: '',
			phone: '',
			email: '',
			address: '',
			fulfilled: false
		});
		templateLoaded = true;
	}

	// await customOrder global store before updating page.
</script>

<picture>
	<source srcset={smallCustomOrder} media="(max-width: 800px)" />
	<source srcset={bigCustomOrder2} />
	<img class="bg-img" src={smallCustomOrder} alt="background-hat" />
</picture>

<p class="overlay-text">
	Thank you for your interest in a custom Crazy P lid! Custom hat orders start at $275, and can vary
	depending on the hat we go with, plus shipping (~$15).
</p>

<!-- customOrderForm or closedMessage... -->
{#if templateLoaded}
	{#if customsAvailable}
		<CustomOrderForm />
	{:else}
		<CustomsClosed />
	{/if}
{:else}
	<div class="loading-container">
		<div class="loading-spinner" in:fade />
	</div>
{/if}

<style>
	picture {
		position: absolute;
		width: 100vw;
		height: 525px;
		overflow: hidden;
		left: 0;
		top: 70px;
		z-index: -1;
	}
	img {
		width: 100vw;
		filter: brightness(0.8);
	}
	.overlay-text {
		color: white;
		font-family: lato-regular;
		font-size: 18px;
		text-align: center;
		max-width: 900px;
		margin: 15px auto 450px;
	}
	.loading-container {
		margin-top: 50px;
		display: flex;
		justify-content: center;
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
		picture {
			height: auto;
		}
		.overlay-text {
			margin-bottom: 99vw;
		}
	}
	@media screen and (max-width: 700px) {
		.overlay-text {
			margin-bottom: 92vw;
		}
	}
	@media screen and (max-width: 500px) {
		.overlay-text {
			margin-bottom: 78vw;
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
