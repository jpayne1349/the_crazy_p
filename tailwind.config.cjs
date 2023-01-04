/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/routes/**/*.{svelte,js,ts}'],
	theme: {
		extend: {}
	},
	daisyui: {
		themes: [
			{
				thecrazyp: {
					primary: '#AC6D68', // plum
					secondary: '#B5553D', // rustic red
					accent: '#C7AF8B', // crisp hay
					neutral: '#d1d5db',
					'base-100': '#f5f5f4'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
