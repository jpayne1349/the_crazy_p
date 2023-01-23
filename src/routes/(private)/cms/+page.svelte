<script lang="ts">
	import Arrow from '$lib/Arrow.svelte';
</script>

<div class="button-container">
	<a href="/cms/custom-orders">
		Custom Orders
		<Arrow />
	</a>
	<a href="/cms/product-inventory">
		Product Inventory
		<Arrow />
	</a>
	<a href="/cms/contact-requests">
		Contact Requests
		<Arrow />
	</a>
	<a href="/cms/manage-site"
		>Manage Site
		<Arrow />
	</a>
</div>

<style>
	.button-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 25px;
		margin-top: 25px;
		padding: 0 50px;
	}
	a {
		font-family: lato-regular;
		font-size: 22px;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		text-align: center;
		height: 33vh;
		padding: 40px 0px;
		border: solid 1px hsl(var(--n));
		border-radius: 2px;
	}

	@media screen and (max-width: 800px) {
		.button-container {
			grid-template-columns: repeat(2, 1fr);
			padding: 0;
		}
		a {
			height: 40vw;
		}
	}
</style>
