import type { RollupOptions } from 'rollup';

import pkg from './package.json';
import { swc, defineRollupSwcOption } from 'rollup-plugin-swc3';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import externals from 'rollup-plugin-node-externals';

const config: RollupOptions =
	// CommonJS (for Node) & ESM (for bundlers)
	{
		input: 'src/index.ts',
		output: [
			{ file: pkg.main, format: 'cjs', sourcemap: false },
			{ file: pkg.module, format: 'es', sourcemap: false },
		],
		plugins: [
			typescriptPaths({ preserveExtensions: true }),
			externals(),
			swc(
				defineRollupSwcOption({
					minify: true,
					tsconfig: './tsconfig.build.json',
					jsc: {
						minify: {
							mangle: false,
							compress: true,
						},
					},
				}),
			),
		],
		// external: ['oxide.ts', 'oxide.ts/dist/core', 'node:crypto'],
	};

export default config;
