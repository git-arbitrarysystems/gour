export default {
	input: 'src/index.js',
	output: [
		{
			dir: 'dist',
			format: 'cjs'
		},
		{
			file: 'dist/index-es.js',
			format: 'es'
		}]
};