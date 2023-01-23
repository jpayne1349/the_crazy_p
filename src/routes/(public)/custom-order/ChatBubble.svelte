<script lang="ts">
	export let selected: boolean | undefined;
	let fillColor = 'white';

	$: if (selected) {
		fillColor = 'hsl(var(--s))';
	} else {
		fillColor = 'white';
	}
</script>

<svg
	viewBox="0 0 12 11"
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
>
	<title>Add Details</title>
	<g
		id="Landing-Page-v2"
		stroke="none"
		stroke-width="1"
		fill="none"
		fill-rule="evenodd"
		stroke-opacity="0.06"
	>
		<g
			id="custom-order-open-mobile"
			transform="translate(-333.000000, -1122.000000)"
			stroke="black"
			fill={fillColor}
			stroke-width="0.733333333"
		>
			<g id="selection-group" transform="translate(25.000000, 1119.000000)">
				<path
					d="M314.5,3.36666667 C315.917531,3.36666667 317.200864,3.94123457 318.129815,4.87018519 C319.058765,5.79913581 319.633333,7.08246914 319.633333,8.5 C319.633333,9.91753086 319.058765,11.2008642 318.129815,12.1298148 C317.200864,13.0587654 315.917531,13.6333333 314.5,13.6333333 C312.839152,13.6333333 311.694175,13.3092693 311.112338,12.5760535 L308.723835,13.372221 L309.912659,10.9945734 C309.543604,10.3471911 309.366667,9.51428651 309.366667,8.5 C309.366667,7.08246914 309.941235,5.79913581 310.870185,4.87018519 C311.799136,3.94123457 313.082469,3.36666667 314.5,3.36666667 Z"
					id="Oval"
				/>
			</g>
		</g>
	</g>
</svg>

<style>
	svg {
		width: 20px;
		height: 19px;
	}
</style>
