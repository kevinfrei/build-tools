#!/usr/bin/env node

import concurrently from 'concurrently';
import { invoke } from './tools';

export async function electronReactTypes(args: string[]): Promise<number> {
  await concurrently([
    'tsc --noEmit',
    'tsc --noEmit -p tsconfig.static.json',
    'tsc --noEmit -p tsconfig.render.json',
  ]);
  return 0;
}

if (require.main === module) {
  invoke(electronReactTypes);
}
