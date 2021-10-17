#!/usr/bin/env node

import * as process from 'node:process';
import { electronReactAnalyze } from './er-analyze.js';
import { electronReactBuild } from './er-build.js';
import { electronReactCheck } from './er-check.js';
import { electronReactPrepare } from './er-prepare.js';
import { electronReactStart } from './er-start.js';
import { electronReactTest } from './er-test.js';
import { electronReactTypes } from './er-types.js';
import { makeDualModeModule } from './make-module.js';
import { minify } from './minify.js';

// eslint-disable-next-line no-console
const err = console.error;

function isNumber(obj: unknown): obj is number {
  return typeof obj === 'number' && !isNaN(obj - 0);
}

function invoke(command: (args: string[]) => Promise<number> | number): void {
  const res = command(process.argv.slice(3));
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

switch (process.argv[2].toLocaleLowerCase()) {
  case 'minify':
    invoke(minify);
    break;
  case 'start':
    invoke(electronReactStart);
    break;
  case 'types':
    invoke(electronReactTypes);
    break;
  case 'test':
    invoke(electronReactTest);
    break;
  case 'prepare':
    invoke(electronReactPrepare);
    break;
  case 'check':
    invoke(electronReactCheck);
    break;
  case 'analyze':
    invoke(electronReactAnalyze);
    break;
  case 'build':
    electronReactBuild(process.argv.slice(2));
    break;
  case 'makemodule':
    invoke(makeDualModeModule);
    break;
  default:
    err('Sorry, unrecognized ER command!');
    err('Supported commands:');
    err('minify, start, types, test, prepar, check, analyze, build');
}
