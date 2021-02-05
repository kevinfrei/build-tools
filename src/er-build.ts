#!/usr/bin/env node

import shelljs from 'shelljs';

export function electronReactBuild(args: string[]): number {
  shelljs.exec('react-scripts build');
  return 0;
}

if (require.main === module) {
  electronReactBuild(process.argv.slice(2));
}
