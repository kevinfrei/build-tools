#!/usr/bin/env node

import concurrently from 'concurrently';
import { invoke } from './tools';

export async function electronReactPrepare(args: string[]): Promise<number> {
  if (args.length > 0 && args[0] === '-r') {
    await concurrently([
      'tsc -p tsconfig.static.rel.json',
      'tsc -p tsconfig.render.rel.json',
    ]);
  } else {
    await concurrently([
      'tsc -p tsconfig.static.json',
      'tsc -p tsconfig.render.json',
    ]);
  }
  return 0;
}

if (require.main === module) {
  invoke(electronReactPrepare);
}
