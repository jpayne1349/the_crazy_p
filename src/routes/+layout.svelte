<script lang="ts">
	import './app.css';
	import InstaIcon from '../lib/InstaIcon.svelte';
	import FbIcon from '../lib/FbIcon.svelte';
	import Navigation from '../lib/Navigation.svelte';
	import { page } from '$app/stores';
	import type {
		CrazyProduct,
		CrazyCarousel,
		CrazyCustomOrderTemplate,
		CrazyCustomOrderForm
	} from './customTypes';
	import type { User } from 'firebase/auth';
	import {
		inventoryStore,
		firebaseStore,
		carouselStore,
		customOrderTemplateStore
	} from './customStores';
	import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import Toast from '$lib/Toast.svelte';

	onMount(() => {
		loadTemplates();
		loadInventory();
	});

	// set up the firebase snapshot listener..

	// lazy load the inventory data once to be accessible from within app
	async function loadInventory() {
		const q = query(collection($firebaseStore.db, 'inventory'));
		//const querySnapshot = await getDocs(collection($firebaseStore.db, 'inventory'));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			let productList: CrazyProduct[] = [];
			querySnapshot.forEach((doc) => {
				let loadedProduct = doc.data() as CrazyProduct;
				loadedProduct.id = doc.id;
				productList.push(loadedProduct);

				productList.sort((a, b) => {
					return b.updated.seconds - a.updated.seconds;
				});

				inventoryStore.set(productList);
			});
		});
	}

	async function loadTemplates() {
		const contentManagementSnapshot = await getDocs(
			collection($firebaseStore.db, 'content-management')
		);

		let productList: CrazyProduct[] = [];
		contentManagementSnapshot.forEach((doc) => {
			if (doc.id == 'carousel') {
				let carouselTemplate = doc.data() as CrazyCarousel;
				carouselTemplate.photos.sort((a, b) => a.index - b.index);
				carouselStore.set(carouselTemplate);
			}

			if (doc.id == 'custom-order') {
				let customOrderTemplate = doc.data() as CrazyCustomOrderTemplate;
				customOrderTemplate.fields.sort((a, b) => a.index - b.index);
				customOrderTemplateStore.set(customOrderTemplate);
			}
		});

		// also getting customOrders here for viewing in CMS
	}
</script>

<svelte:head>
	<title>The Crazy P | Hand Burned Hats - One of a kind</title>

	<meta
		name="description"
		content="Creating custom and one of a kind, hand burned pyrography art on fashionable western hats for the cowgirl, bride or everyday hat lover in you. What unique design do you want on your personalized hat today?"
	/>
</svelte:head>

<header>
	<Navigation>
		<a href="/" class="header" class:homepage={$page.url.pathname === '/'}>THE CRAZY P</a>
	</Navigation>
</header>
<div class="underline" />

<slot />

<Toast />

<footer>
	<div class="footer-row">
		<a href="https://www.instagram.com/thecrazyp_/?hl=en"><InstaIcon /></a>
		<a href="https://www.facebook.com/TheCrazyP/"><FbIcon /></a>
	</div>
	<br />
	<div class="footer-row">
		<a class="footer-link" href="/contact-us">CONTACT</a>
		<a class="footer-link" href="/">&#169; THE CRAZY P</a>
		<a class="footer-link" href="/faq">FAQ</a>
	</div>
	<div class="footer-row">
		<!-- <a class="footer-link" href="/terms-of-service">TERMS OF SERVICE</a> -->
		<a class="footer-link" href="/cms">CMS</a>
		<!-- <a class="footer-link" href="/privacy-policy">PRIVACY POLICY</a> -->
	</div>
</footer>

<style>
	header {
		display: flex;
		position: absolute;
		top: 0;
		width: 100%;
		justify-content: center;
		align-items: center;
		height: 60px;
		/* box-shadow: 0 0px 4px hsl(var(--ac)); */
	}
	a.header {
		font-family: docktrin;
		color: hsl(var(--ac));
		z-index: 10;
		font-size: 36px;
		width: 200px;
		text-align: center;
	}
	a.header.homepage {
		color: hsl(var(--b2));
	}
	footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: hsl(var(--a));

		padding: 25px 0 25px;
	}
	.underline {
		width: 60vw;
		margin-left: 20vw;
		height: 1px;
		background-color: hsl(var(--n));
		position: absolute;
		top: 69px;
		left: 0;
	}
	.footer-row {
		display: flex;
		width: 300px;
		justify-content: space-evenly;
		font-size: 12px;
		padding: 5px 0;
	}
	.footer-link {
		font-family: lato-light;
		color: hsl(var(--ac));
	}

	@media screen and (max-width: 500px) {
		.underline {
			width: 90vw;
			margin-left: 5vw;
		}
		a.header.homepage {
			color: hsl(var(--b2));
		}
	}
</style>
