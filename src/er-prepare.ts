#!/usr/bin/env node

import { MakeError } from '@freik/core-utils';
import concurrently from 'concurrently';
import { invoke } from './tools';

const err = MakeError('er-prepare-err');

export async function electronReactPrepareWithEnv(
  env: string,
  args: string[],
): Promise<number> {
  if (args.length > 0 && args[0] === '-r') {
    await concurrently([
      `${env} tsc -p config/tsconfig.static.rel.json`,
      `${env} tsc -p config/tsconfig.render.rel.json`,
    ]);
  } else if (args.length === 0) {
    await concurrently([
      `${env} tsc -p config/tsconfig.static.json`,
      `${env} tsc -p config/tsconfig.render.json`,
    ]);
  } else {
    err('No arguments to er-types currently...');
    return -1;
  }
  return 0;
}
export async function electronReactPrepare(args: string[]): Promise<number> {
  return await electronReactPrepareWithEnv('', args);
}

if (require.main === module) {
  invoke(electronReactPrepare);
}
