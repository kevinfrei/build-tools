#!/usr/bin/env node

/**
 * This is the entry point for scripts invoked by your package manager
 */

import { makeDualModeModule } from './make-module.js';
import { minify } from './minify.js';
import { invoke } from './helpers.js';

invoke(
  new Map([
    ['minify', minify],
    ['makemodule', makeDualModeModule],
  ]),
);
