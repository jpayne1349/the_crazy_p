<script lang="ts">
	import { page } from '$app/stores';
	import { beforeUpdate } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let title: string;
	let crumbs: { name: string; path: string }[] = [];

	beforeUpdate(() => {
		title = data.title;
		crumbs = data.crumbs;
	});
</script>

<h2
	class="route-title"
	class:whiteText={$page.url.pathname === '/custom-order'}
	class:remove={$page.url.pathname.includes('/inventory/')}
>
	{#if title}
		{title}
	{/if}
</h2>

<div
	class="breaker-bar"
	class:whiteText={$page.url.pathname === '/custom-order'}
	class:remove={$page.url.pathname.includes('/inventory/')}
>
	<div />
</div>

<div
	class="text-sm breadcrumbs"
	class:customOrder={$page.url.pathname.includes('custom-order') ||
		$page.url.pathname.includes('contact-us') ||
		$page.url.pathname.includes('thank-you') ||
		$page.url.pathname.includes('faq') ||
		$page.url.pathname.includes('about')}
	class:lower={$page.url.pathname.includes('/inventory/')}
>
	<ul class="breadcrumbs-wrapper">
		<li><a href="/">Home</a></li>
		{#each crumbs as link}
			<li><a href={link.path}>{link.name}</a></li>
		{/each}
	</ul>
</div>

<section>
	<slot />
</section>

<style>
	.route-title {
		font-family: lato-regular;
		margin-top: 75px;
		text-align: center;
		font-size: 26px;
		/* height: 100px; */
	}
	.route-title.whiteText {
		color: white;
	}
	.route-title.remove {
		display: none;
	}
	.breaker-bar {
		display: flex;
		justify-content: center;
	}
	.breaker-bar.remove {
		display: none;
	}
	.breaker-bar div {
		width: 30px;
		height: 2px;
		border-radius: 5px;
		background-color: hsl(var(--ac));
		margin: 5px 0;
	}
	.breaker-bar.whiteText div {
		background-color: white;
	}

	.breadcrumbs {
		padding: 5px 0;
		max-width: 900px;
		margin: 0 auto;
	}
	.breadcrumbs.customOrder {
		display: none;
	}
	.breadcrumbs.lower {
		margin-top: 112px;
	}
	ul {
		padding: 0 15px;
	}
	section {
		min-height: 80vh;
		padding: 0 25px;
		width: 75vw;
		margin-left: 12.5vw;
	}
	@media screen and (max-width: 800px) {
		.breadcrumbs {
			padding: 5px 0;
			width: 100vw;
			margin-left: 10px;
		}
		section {
			width: 100vw;
			margin-left: 0;
		}
	}
</style>
