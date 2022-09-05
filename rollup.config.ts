import pkg from './package.json';
import { swc, defineRollupSwcOption } from 'rollup-plugin-swc3';
import type { RollupOptions } from 'rollup';
//todo: maybe use "rollup-plugin-dts" for d.ts
const config: RollupOptions =
  // CommonJS (for Node) & ESM (for bundlers)
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: false },
      { file: pkg.module, format: 'es', sourcemap: false },
    ],
    plugins: [
      swc(
        defineRollupSwcOption({
          minify: true,
          tsconfig: './tsconfig.build.json',
        }),
      ),
    ],
    external: ['oxide.ts'],
  };

export default config;
