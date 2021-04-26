#!/usr/bin/env node

import * as process from 'process';

// eslint-disable-next-line no-console
const err = console.error;

function isNumber(obj: unknown): obj is number {
  return typeof obj === 'number' && !isNaN(obj - 0);
}

export function invoke(
  command: (args: string[]) => Promise<number> | number,
): void {
  const res = command(process.argv.slice(2));
  if (!isNumber(res)) {
    res
      .then((val) => process.exit(val))
      .catch((rsn) => {
        err(rsn);
        process.exit(-1);
      });
  } else {
    process.exit(res);
  }
}
