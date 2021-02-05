#!/usr/bin/env node

import { MakeError } from '@freik/core-utils';
import concurrently from 'concurrently';
import { invoke } from './tools';

const err = MakeError('er-types-err');

export async function electronReactTypes(args: string[]): Promise<number> {
  if (args.length === 0) {
    await concurrently([
      'tsc --noEmit',
      'tsc --noEmit -p config/tsconfig.static.json',
      'tsc --noEmit -p config/tsconfig.render.json',
    ]);
    return 0;
  } else {
    err('No arguments to er-types currently...');
    return -1;
  }
}

if (require.main === module) {
  invoke(electronReactTypes);
}
