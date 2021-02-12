#!/usr/bin/env node

import { invoke } from './tools';
import concurrently from 'concurrently';

export async function electronReactTest(): Promise<number> {
  await concurrently([
    'jest --config config/jest.jsdom.js --passWithNoTests',
    'jest --config config/jest.node.js --passWithNoTests',
  ]);
  return 0;
}

if (require.main === module) {
  invoke(electronReactTest);
}
