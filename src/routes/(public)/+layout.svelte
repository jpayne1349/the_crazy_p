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

<h2 class="route-title">
	{title}
</h2>

<div class="breaker-bar"><div /></div>

<div class="text-sm breadcrumbs">
	<ul>
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
		font-family: lato-bolditalic;
		padding-top: 65px;
		text-align: center;
		font-size: 32px;
	}
	.breaker-bar {
		display: flex;
		justify-content: center;
	}
	.breaker-bar div {
		width: 50px;
		height: 4px;
		border-radius: 5px;
		background-color: hsl(var(--ac));
	}
	ul {
		padding: 0 15px;
	}
	section {
		min-height: 600px;
		padding: 0 15px;
	}
</style>
