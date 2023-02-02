<script lang="ts">
	import Arrow from '$lib/Arrow.svelte';
</script>

<div class="button-container">
	<div class="row">
		<a href="/cms/custom-orders">
			Custom Orders
			<Arrow />
		</a>
		<a href="/cms/product-inventory">
			Product Inventory
			<Arrow />
		</a>
	</div>
	<div class="row">
		<a href="/cms/contact-requests">
			Contact Requests
			<Arrow />
		</a>
		<a href="/cms/manage-site"
			>Manage Site
			<Arrow />
		</a>
	</div>
</div>

<style>
	.button-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.row {
		display: flex;
		justify-content: center;
		width: 100%;
		margin-bottom: 25px;
	}
	a {
		font-family: lato-regular;
		font-size: 22px;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		text-align: center;
		height: 225px;
		width: 250px;
		margin-left: 25px;
		border: solid 1px hsl(var(--n));
		border-radius: 2px;
	}

	@media screen and (max-width: 800px) {
		.row {
			justify-content: space-around;
		}
		a {
			height: 40vw;
			width: 40vw;
			margin: 0;
		}
	}
</style>
