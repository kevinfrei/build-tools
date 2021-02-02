#!/usr/bin/env node

import minimist from 'minimist';
import * as process from 'process';
import shelljs from 'shelljs';
import Uglify from 'uglify-es';
import { promises as fsp } from 'fs';
import { MakeError, Type } from '@freik/core-utils';
import path from 'path';

const err = MakeError('index-err');

const uglifyOptions = {
  toplevel: true,
  compress: {
    passes: 2,
  },
  mangle: true,
  output: {
    beautify: false,
    semicolons: false,
    ecma: 6,
  },
};

function getSuffixedName(name: string, suffix: string, outDir: string) {
  const dir =
    outDir.length > 0
      ? path.join(outDir, path.dirname(name))
      : path.dirname(name);
  const p = `${path.basename(name, '.js')}.${suffix}.js`;
  return path.join(dir, p);
}

async function minify(args: string[]): Promise<number> {
  // -e : halt on first error (defaults to false)
  // -i : 'in-place', defaults to false (overwrites foo.js)
  // -r : 'recursive', defaults to false
  // -s min : 'suffix', defaults to min (i.e. foo.min.js)
  // -o dir : 'out-dir', defaults to '', prepended to path
  // everything else is either files or dirs to minify individually
  // eslint-disable-next-line
  const m = minimist(args, { boolean: ['e', 'i', 'r'] });

  const suffix = Type.hasStr(m, 's')
    ? m.s.replace(/^\.*/, '').replace(/\.*$/, '') // Get rid of .'s
    : undefined;
  const inPlace = m.i === true;
  const recursive = m.r === true;
  const outDir = Type.hasStr(m, 'o') ? m.o : undefined;
  if (inPlace && suffix) {
    err("-i (in-place) and -s (suffix) don't work together");
    return -1;
  }
  if (recursive && outDir) {
    err("-r (recursive) and -o (output dir) don't work together");
    return -1;
  }
  if (m._.length === 0) {
    err('Please pass some files or a directory or something');
    return -1;
  }

  let fnRes = true;
  // Run uglify on each file specified
  for (const loc of m._) {
    // TODO: Add recursion (if specified) & full directory scanning
    const orig = await fsp.readFile(loc, 'utf-8');
    const res = Uglify.minify(orig, uglifyOptions);
    if (res.error) {
      err(res.error);
      if (m.e) {
        return -1;
      }
      fnRes = false;
      continue;
    }
    const dest = inPlace
      ? loc
      : getSuffixedName(loc, suffix || 'min', outDir || '');
    if (outDir) {
      shelljs.mkdir('-p', path.dirname(dest));
    }
    await fsp.writeFile(dest, res.code, 'utf-8');
    // console.log(`Before: ${orig.length} after ${res.code.length}`);
  }
  return fnRes ? 0 : -1;
}

export default async function main(): Promise<number> {
  if (process.argv.length < 3) {
    err('Please invoke a command:');
    err('opt-build');
  }
  const command = process.argv[2].toLowerCase();
  const rest = process.argv.slice(3);
  switch (command) {
    case 'minify':
      return await minify(rest);
    case 'er-start': // Electron + React start (untested!)
      /* async () => {
        await concurrently(['yarn prepare']);
        await concurrently(
          [
            'cross-env BROWSER=none yarn react-start',
            'wait-on http://localhost:3000 && electron .',
          ],
          { killOthers: ['failure', 'success'] },
        );
        [
          'yarn prepare',
          'concurrently --kill-others',
          [
            'cross-env BROWSER=none yarn react-start',
            'wait-on http://localhost:3000 && electron .',
          ],
        ];
      };*/
      break;

    /*
    case 'analyze':
      "yarn react-scripts build && yarn source-map-explorer 'build/static/js/*.js'";
      break;
    case 'react-start':
      'react-scripts start';
      break;
    case 'react-build':
      'react-scripts build';
      break;
    case 'react-test':
      'react-scripts test';
      break;
    case 'react-eject':
      'react-scripts eject';
      break;
    case 'release':
      'yarn build && electron-builder --publish=always';
      break;
    case 'clean':
      'rimraf public/main public/*.js public/*.js.map .ts*.tsbuildinfo';
      break;
    case 'build':
      'yarn clean && yarn prepare && yarn react-build';
      break;
    case 'prepare':
      'tsc -p tsconfig.static.json && tsc -p tsconfig.render.json';
      break;
    case 'compile':
      'tsc --noEmit && tsc --noEmit -p tsconfig.static.json && tsc --noEmit -p tsconfig.render.json';
      break;
    case 'test':
      'jest --config jest.jsdom.config.js && jest --config jest.node.config.js --passWithNoTests';
      break;
    case 'testui':
      'jest --config jest.jsdom.config.js --watch';
      break;
    case 'testnode':
      'jest --config jest.node.config.js --watch';
      break;
    case 'format':*/
    //      'prettier --write "src/**/*.ts" "src/**/*.tsx" "static/**/*.ts" "*.js" "*.json" "*.md" "src/**/*.css" .prettierrc';
    /*    break;
    case 'lint':
      'yarn eslint --fix --ext .ts --ext .tsx ./';
      break;
    case 'chk':
      'yarn compile && yarn lint && yarn test';
      break;
    case 'linecount':
      'git ls-files|grep "\\.\\(css\\|ts\\|tsx\\)$"|grep -v "__\\|\\.d\\.ts"|xargs wc -l';
      break;*/
  }
  return -1;
}

if (require.main === module) {
  main()
    .then((val) => process.exit(val))
    .catch((rsn) => {
      err(rsn);
      process.exit(-1);
    });
}
