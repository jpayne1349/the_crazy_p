<script>
	import about from '$lib/assets/about.jpg';
</script>

<p class="message">
	Hi there! Thanks for being here! I'm Katherine, a pediatric occupational therapist, wife, dog,
	cat, horse, cow and chicken mom, and artist. I love Jesus, my family and country living. I create
	one of a kind, wearable pyrography art for my western loving friends.
</p>

<div class="background-photo" style="background-image:url({about});" />

<style>
	.message {
		font-family: lato-regular;
		text-align: center;
		max-width: 900px;
		margin: 15px auto;
		font-size: 18px;
	}
	.background-photo {
		width: 900px;
		height: 900px;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		border-radius: 10px;
		background-color: hsl(var(--n));
		margin: 0 auto 50px;
	}

	@media screen and (max-width: 800px) {
		.background-photo {
			width: 100vw;
			margin-left: -25px;
			height: 500px;
			background-position: left;
			background-size: cover;
			background-repeat: no-repeat;
			margin-bottom: 40px;
			border-radius: 0;
		}
	}
</style>
