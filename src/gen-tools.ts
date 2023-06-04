#!/usr/bin/env node

/**
 * This is the entry point for scripts invoked by your package manager
 */

import { formatFiles } from './format.js';
import { countLines } from './line-count.js';
import { invoke } from './helpers.js';

invoke(
  new Map([
    ['format', formatFiles],
    ['line-count', countLines],
    ['linecount', countLines],
  ]),
);
