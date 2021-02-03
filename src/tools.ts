#!/usr/bin/env node

import * as process from 'process';
import { MakeError, Type } from '@freik/core-utils';

const err = MakeError('tools-err');

export function invoke(
  command: (args: string[]) => Promise<number> | number,
): void {
  const res = command(process.argv.slice(2));
  if (!Type.isNumber(res)) {
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
