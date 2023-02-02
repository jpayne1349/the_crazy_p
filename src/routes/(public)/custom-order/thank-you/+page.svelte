<script>
	import thankYouPhoto from '$lib/assets/thankYou.jpg';
</script>

<p class="message">Your order has been submitted! We will reach out soon.</p>

<div class="image-container">
	<picture>
		<source srcset={thankYouPhoto} />
		<img class="bg-img" src={thankYouPhoto} alt="Thanks again!" />
	</picture>
</div>

<p class="message">
	Continue browsing the <a href="/inventory">inventory</a> or submit a new
	<a href="/custom-order">custom order</a>.
</p>

<style>
	.message {
		font-family: lato-light;
		font-size: 20px;
		text-align: center;
		margin-top: 15px;
	}
	a {
		color: hsl(var(--p));
		font-family: lato-regular;
		font-size: 20px;
	}
	.image-container {
		display: flex;
		justify-content: center;
		margin-top: 15px;
	}
	img {
		max-width: 250px;
		border-radius: 15px;
		box-shadow: 0px 1px 4px grey;
	}
	@media screen and (max-width: 800px) {
		.message {
			margin-top: 25px;
		}
		.image-container {
			margin-top: 15px;
		}
		img {
			max-width: 200px;
		}
	}
</style>
