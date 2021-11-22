import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: () => ({
			resolve: {
				alias: {
					$graphql: path.resolve('./src/graphql'),
					$src: path.resolve('./src')
				}
			}
		})
	}
};

export default config;
