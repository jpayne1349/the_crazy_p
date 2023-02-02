<script>
	import Card from './Card.svelte';
	import faq1 from '$lib/assets/faq1.jpeg';
	import faq2 from '$lib/assets/faq2.jpeg';
	import faq3 from '$lib/assets/faq3.jpeg';
	import faq4 from '$lib/assets/faq4.jpeg';
	import faq5 from '$lib/assets/faq5.jpeg';
	import faq6 from '$lib/assets/faq6.jpeg';
</script>

<p class="contact-us-message">
	If you have a questions you don't see here, feel free to <a href="/contact-us">contact us</a> and we'll
	get you an answer!
</p>

<div class="card-container">
	<!-- question , answer , photoSrc -->
	<Card
		question={'DO YOU DO DIFFERENT SIZES?'}
		answer={"Yes! For custom hats I'll have either a sized hat or an adjustable band depending on the hat we choose. Ready to ship hats listed will have their sizing described. Always feel free to inquire about sizing details,  if you have further questions."}
		photoSrc={faq1}
	/>

	<Card
		question={'CAN YOU DESIGN ON A HAT I ALREADY OWN?'}
		answer={'For sure! I love sprucing up hats you already have and giving them new life. Price for this starts at $200 + shipping.'}
		photoSrc={faq2}
	/>

	<Card
		question={'HOW MUCH DO CUSTOM HATS RUN?'}
		answer={'Check out the custom order form for details on pricing for custom hats.'}
		photoSrc={faq3}
	/>

	<Card
		question={"I WANT A CRAZY P LID BUT DON'T KNOW WHAT I WANT ON IT."}
		answer={'That’s okay! Please reach out and let me know! I will guide you through choosing design ideas based on things you like, and will provide you with a sketched up design plan before I burn your hat.'}
		photoSrc={faq4}
	/>

	<Card
		question={'DO YOU DO WEDDING HATS?'}
		answer={'Yes! Creating a custom hat for your wedding day is one of my favorite pieces to see come together. Many brides like to have their new last name and wedding date burned,  and incorporate wedding colors in the band details. I love seeing your floral inspirations and incorporating them into a one of a kind lid. My turn around time does vary throughout the year, so please let me know sooner than later.'}
		photoSrc={faq5}
	/>

	<Card
		question={'CAN I ADD A CUSTOM TOUCH TO A READY-TO-SHIP HAT IN YOUR INVENTORY?'}
		answer={'Yes! I can add a small custom detail (ie: initials, date, etc.) for an additional fee prior to shipping your hat out!'}
		photoSrc={faq6}
	/>
</div>

<style>
	.contact-us-message {
		font-family: lato-regular;
		text-align: center;
		margin-top: 25px;
		font-size: 19px;
	}
	.card-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 25px;

		margin: 25px 0;
	}
	a {
		color: hsl(var(--a));
	}

	@media screen and (max-width: 800px) {
		.card-container {
			display: grid;
			grid-template-columns: repeat(1, 1fr);
			gap: 25px;
			margin: 25px 0px;
		}
	}
</style>
