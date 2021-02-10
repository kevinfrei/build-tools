#!/usr/bin/env node

import { MakeError } from '@freik/core-utils';
import { electronReactBuildWithEnv } from './er-build';
import { electronReactPrepareWithEnv } from './er-prepare';
import { invoke } from './tools';
import shelljs from 'shelljs';
import { minify } from './minify';

const err = MakeError('er-analyze-err');
/*
GENERATE_SOURCEMAP=true yarn build && yarn source-map-explorer 'build/static/js/*.js' 'build/main/*.js' 'build/*.js'
*/

export async function electronReactAnalyze(args: string[]): Promise<number> {
  const env = 'GENERATE_SOURCEMAP=true';
  if (args.length > 0) {
    err('No arguments to er-types currently...');
    return -1;
  }
  let res = await electronReactPrepareWithEnv(env, ['-r']);
  if (res !== 0) {
    return res;
  }
  res = electronReactBuildWithEnv(env, []);
  if (res !== 0) {
    return res;
  }
  res = await minify(['-i', '-m', '-r', 'build']);
  const r = shelljs.exec(
    "source-map-explorer 'build/static/js/*.js' 'build/main/*.js' 'build/*.js'",
  );
  return r.code;
}

if (require.main === module) {
  invoke(electronReactAnalyze);
}
