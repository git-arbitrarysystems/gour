import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: 'src/components/game/index.js',
	output: [
		{
			dir: 'dist/game',
			format: 'cjs'
		},
		{
			file: 'dist/game/index-es.js',
			format: 'es'
		}],
	plugins: [nodeResolve(), commonjs()]
};