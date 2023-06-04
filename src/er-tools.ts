#!/usr/bin/env node

/**
 * This is the entry point for Electron+React scripts invoked by the package manager
 */

import { electronReactAnalyze } from './er-analyze.js';
import { electronReactBuild } from './er-build.js';
import { electronReactCheck } from './er-check.js';
import { electronReactPrepare } from './er-prepare.js';
import { electronReactStart } from './er-start.js';
import { electronReactTest } from './er-test.js';
import { electronReactTypes } from './er-types.js';
import { invoke } from './helpers.js';

invoke(
  new Map([
    ['start', electronReactStart],
    ['types', electronReactTypes],
    ['test', electronReactTest],
    ['prepare', electronReactPrepare],
    ['check', electronReactCheck],
    ['analyze', electronReactAnalyze],
    ['build', electronReactBuild],
  ]),
);
