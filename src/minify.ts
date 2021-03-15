#!/usr/bin/env node

import minimist, { ParsedArgs, Opts as MinimistOpts } from 'minimist';
import shelljs from 'shelljs';
import Terser from 'terser';
import { promises as fsp } from 'fs';
import { MakeError, Type } from '@freik/core-utils';
import path from 'path';
import { invoke } from './tools';
import { ForFiles } from '@freik/node-utils';

const err = MakeError('minify-err');

const uglifyOptions: Terser.MinifyOptions = {
  toplevel: true,
  compress: {
    passes: 2,
  },
  mangle: true,
  output: {
    beautify: false,
    semicolons: false,
  },
  ecma: 2020,
};

function getSuffixedName(name: string, suffix: string, outDir: string) {
  const dir =
    outDir.length > 0
      ? path.join(outDir, path.dirname(name))
      : path.dirname(name);
  const p = `${path.basename(name, '.js')}.${suffix}.js`;
  return path.join(dir, p);
}

export type MinifyParams = {
  suffix?: string;
  inPlace: boolean;
  recurse: boolean;
  keepGoing: boolean;
  map: boolean;
  outDir?: string;
  args: string[];
};

export function minifyArgs(m: ParsedArgs): MinifyParams {
  return {
    suffix: Type.hasStr(m, 's')
      ? m.s.replace(/^\.*/, '').replace(/\.*$/, '') // Get rid of .'s
      : undefined,
    inPlace: m.i === true,
    recurse: m.r === true,
    keepGoing: m.e === true,
    map: m.m === true,
    outDir: Type.hasStr(m, 'o') ? m.o : undefined,
    args: m._,
  };
}

export async function minify(unparsed: string[]): Promise<number> {
  // -e : halt on first error (defaults to false)
  // -i : 'in-place', defaults to false (overwrites foo.js)
  // -r : 'recursive', defaults to false
  // -m : 'maps': read input maps (and product output map files)
  // -s min : 'suffix', defaults to min (i.e. foo.min.js)
  // -o dir : 'out-dir', defaults to '', prepended to path
  // everything else is either files or dirs to minify individually
  // eslint-disable-next-line
  const mo: MinimistOpts = { boolean: ['e', 'i', 'r', 'm'] };
  const m: ParsedArgs = minimist(unparsed, mo);

  const { suffix, inPlace, recurse, keepGoing, map, outDir, args } = minifyArgs(
    m,
  );

  if (inPlace && suffix) {
    err("-i (in-place) and -s (suffix) don't work together");
    return -1;
  }
  if (recurse && outDir) {
    err("-r (recursive) and -o (output dir) don't work together");
    return -1;
  }
  if (args.length === 0) {
    err('Please pass some files or a directory or something');
    return -1;
  }

  // Run uglify on each file specified
  if (
    await ForFiles(
      args,
      async (loc): Promise<boolean> => {
        try {
          const orig = await fsp.readFile(loc, 'utf-8');
          if (map) {
            uglifyOptions.sourceMap = {
              content: await fsp.readFile(loc + '.map', 'utf-8'),
            };
          }
          const res = await Terser.minify(orig, uglifyOptions);
          if (!res || !res.code) {
            err('No results when minifying ' + loc);
            return false;
          }
          const dest = inPlace
            ? loc
            : getSuffixedName(loc, suffix || 'min', outDir || '');
          if (outDir) {
            shelljs.mkdir('-p', path.dirname(dest));
          }
          await fsp.writeFile(dest, res.code, 'utf-8');
          if (map && Type.isString(res.map)) {
            await fsp.writeFile(dest + '.map', res.map, 'utf-8');
          } else if (map) {
            err('No map file produced for file ' + loc);
          }
          // console.log(`Before: ${orig.length} after ${res.code.length}`);
          return true;
        } catch (e) {
          err('Caught an exception while processing ' + loc);
          err(e);
          return false;
        }
      },
      { recurse, keepGoing, fileTypes: '.js' },
    )
  ) {
    return 0;
  }
  return -1;
}

if (require.main === module) {
  invoke(minify);
}
