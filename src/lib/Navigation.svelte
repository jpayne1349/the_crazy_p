<script lang="ts">
	import { page } from '$app/stores';
	import MenuIcon from './MenuIcon.svelte';
	import { fly } from 'svelte/transition';

	let mobileNavShow = false;

	$: {
		$page.url.pathname;
		mobileNavShow = false;
	}
</script>

<div class="mobile-title">
	<slot />
</div>

<button
	class="nav-button"
	on:click={() => {
		mobileNavShow = !mobileNavShow;
	}}><MenuIcon /></button
>
<nav>
	{#if mobileNavShow}
		<div class="mobile-nav" in:fly={{ x: 100 }}>
			<a class="nav-link text-2xl" href="/inventory" class:homepage={$page.url.pathname === '/'}
				>Inventory</a
			>
			<a class="nav-link text-2xl" href="/custom-order" class:homepage={$page.url.pathname === '/'}
				>Custom Order</a
			>
			<a class="nav-link text-2xl" href="/contact-us" class:homepage={$page.url.pathname === '/'}
				>Contact Us</a
			>
			<a class="nav-link text-2xl" href="/faq" class:homepage={$page.url.pathname === '/'}>FAQ</a>
			<a class="nav-link text-2xl" href="/about" class:homepage={$page.url.pathname === '/'}
				>About</a
			>
		</div>
	{/if}
	<div class="desktop-nav">
		<a class="nav-link" href="/inventory" class:homepage={$page.url.pathname === '/'}>Inventory</a>
		<a class="nav-link" href="/contact" class:homepage={$page.url.pathname === '/'}>contact-us Us</a
		>
		<slot />
		<a class="nav-link" href="/faq" class:homepage={$page.url.pathname === '/'}>FAQ</a>
		<a class="nav-link" href="/about" class:homepage={$page.url.pathname === '/'}>About</a>
	</div>
</nav>

<style>
	nav {
		display: flex;
		justify-content: center;
	}
	.nav-button {
		display: none;
		position: absolute;
		right: 25px;
		top: 12px;
		z-index: 10;
		border-radius: 5px;
		-webkit-tap-highlight-color: rgba(245, 245, 245, 0.265);
	}
	.mobile-nav {
		display: none;
	}
	.desktop-nav {
		display: flex;
		width: 800px;
		padding-top: 13px;
		justify-content: space-around;
		align-items: center;
		left: 0;
		top: 0;
		z-index: 10;
	}
	.nav-link {
		font-family: docktrin;
		color: hsl(var(--ac));
		font-size: 24px;
	}
	.nav-link.homepage {
		color: hsl(var(--b2));
	}
	.mobile-title {
		display: none;
	}

	@media screen and (max-width: 800px) {
		.nav-button {
			display: flex;
		}
		.desktop-nav {
			display: none;
		}
		.mobile-nav {
			position: absolute;
			display: flex;
			flex-direction: column;
			width: 100vw;
			right: 0;
			background-color: hsl(var(--a));
			top: 0;
			padding-top: 75px;
			align-items: center;
			justify-content: space-evenly;
			z-index: 9;
		}
		.nav-link {
			border-bottom: 1px solid #f5f5f52e;
			width: 100%;
			text-align: center;
			padding: 10px;
		}
		.mobile-title {
			display: flex;
		}
	}
</style>
