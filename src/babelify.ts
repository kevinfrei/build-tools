#!/usr/bin/env node
import process from 'process';
import shell from 'shelljs';

// This is a holdover to my flow days. Leaving it here for posterity, I guess
function Babel(source: string, output: string, ...presets: string[]) {
  const preset = presets && presets.length > 0 ? presets : ['react', 'flow'];
  const out = output ? output : 'lib';
  const src = source ? source : 'src';
  shell.rm('-rf', out);
  if (preset.indexOf('flow') >= 0) {
    shell.exec(`gen-flow-files "${src}" --out-dir "${out}"`);
  }
  process.env.BABEL_ENV = 'production';
  const prst = preset.map((v) => `@babel/preset-${v}`).join(',');
  shell.exec(
    `babel "${src}" --out-dir "${out}" --source-maps --presets=${prst}`,
  );
  shell.rm('-rf', `${out}/__tests__`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 1) {
    const src = args[0];
    const out = args[1];
    Babel(src, out, ...args.slice(2));
  }
}
