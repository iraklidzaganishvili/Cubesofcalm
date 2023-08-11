import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'docs',
			assets: 'docs',
			strict: false
		}),
		paths: {
			base: process.env.NODE_ENV === 'development' ? '' : '/Cubesofcalm',
		}
	}
};

export default config;