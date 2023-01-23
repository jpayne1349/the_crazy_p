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
					neutral: '#E4E4E4',
					'base-100': '#FAF7F5',
					'error': '#E5704B',
					'success': '#62916A',
					'info': '#466EA2'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
