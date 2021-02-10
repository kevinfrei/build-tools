#!/usr/bin/env node

import { MakeError } from '@freik/core-utils';
import shelljs from 'shelljs';

const err = MakeError('er-build-err');

export function electronReactBuildWithEnv(env: string, args: string[]): number {
  if (args.length === 0) {
    shelljs.exec(`${env} react-scripts build`);
  } else {
    err('No arguments to er-types currently...');
    return -1;
  }
  return 0;
}

export function electronReactBuild(args: string[]): number {
  return electronReactBuildWithEnv('', args);
}

if (require.main === module) {
  electronReactBuild(process.argv.slice(2));
}
