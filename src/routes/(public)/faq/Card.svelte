<script lang="ts">
	export let question: string;
	export let answer: string;
	export let photoSrc: string;
</script>

<div class="container">
	<div class="img-container" style="background-image: url({photoSrc});">
		<!-- <img src={photoSrc} alt="Associated Hat with FAQ" /> -->
	</div>

	<div class="content">
		<div class="dash">-</div>
		<div class="text-container">
			<h3 class="question">{question}</h3>
			<p class="answer">{answer}</p>
		</div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		border: 1px solid hsl(var(--n));
		border-radius: 5px;
	}
	.img-container {
		overflow: hidden;
		height: 250px;
		background-position: center;
		background-size: 100%;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		background-color: hsl(var(--n));
	}
	.content {
		display: flex;
	}
	.dash {
		font-size: 18px;
		line-height: 18px;
		margin-left: 10px;
		margin-top: 13px;
		margin-right: 4px;
	}
	.question {
		font-family: lato-regular;
		font-size: 18px;
		margin: 10px 0;
	}
	.answer {
		font-family: lato-light;
		font-size: 18px;
		margin-right: 13px;
		margin-bottom: 25px;
	}
</style>
