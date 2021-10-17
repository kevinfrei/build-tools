// Taken from
// https://adostes.medium.com/authoring-a-javascript-library-that-works-everywhere-using-rollup-f1b4b527b2a9

import nodeResolve from '@rollup/plugin-node-resolve';
import { rollup, RollupOptions } from 'rollup';

const err = console.error; // eslint-disable-line no-console
const log = console.log; // eslint-disable-line no-console

const inputOptions: RollupOptions = {
  plugins: [nodeResolve()],
};
const outputOptions: RollupOptions = {
  output: [
    { dir: 'dist/esm', format: 'esm', exports: 'named', sourcemap: 'inline' },
    { dir: 'dist/cjs', format: 'cjs', exports: 'named', sourcemap: 'inline' },
  ],
};

export async function makeDualModeModule(root: string[]): Promise<number> {
  const bundle = await rollup({ input: root, ...inputOptions });
  log(bundle.watchFiles);
  const { output } = await bundle.generate(outputOptions);
  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === 'asset') {
      log('Asset:', chunkOrAsset);
    } else {
      log('Chunk:', chunkOrAsset.modules);
    }
  }
  await bundle.write(outputOptions);
  await bundle.close();
  return 0;
}
