#!/usr/bin/env node

import shelljs from 'shelljs';

// eslint-disable-next-line no-console
const err = console.error;

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
