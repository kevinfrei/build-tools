#!/usr/bin/env node

import { electronReactPrepare } from './er-prepare';
import { invoke } from './tools';
import concurrently from 'concurrently';

/*
er-prepare &&
concurrently --kill-others
  \"cross-env BROWSER=none yarn react-start\"
  \"wait-on http://localhost:3000 && electron .\"",
*/

export async function electronReactStart(args: string[]): Promise<number> {
  await electronReactPrepare([]);
  const setPort = args[0] === undefined ? '' : `PORT=${args[0]} `;
  await concurrently(
    [
      `cross-env BROWSER=none ${setPort}react-scripts start`,
      'wait-on http://localhost:3000 && electron .',
    ],
    // This kills the electron process if the browser process quits
    // (and vice versa)
    { killOthers: ['success', 'failure'] },
  );
  return 0;
}

if (require.main === module) {
  invoke(electronReactStart);
}
