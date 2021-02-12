#!/usr/bin/env node

import { invoke } from './tools';
import concurrently from 'concurrently';

export async function electronReactCheck(): Promise<number> {
  await concurrently(['yarn types', 'yarn lint', 'yarn test']);
  return 0;
}

if (require.main === module) {
  invoke(electronReactCheck);
}
