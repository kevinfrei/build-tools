// @format

const shell = require('shelljs');
const process = require('process');

const Babel = (source, output, ...presets) => {
  const preset = (presets && presets.length > 0) ? presets : ['react', 'flow'];
  const out = output ? output : 'lib';
  const src = source ? source : 'src';
  shell.rm('-rf', out);
  if (preset.indexOf('flow') >= 0) {
    shell.exec(`gen-flow-files "${src}" --out-dir "${out}"`);
  }
  process.env['BABEL_ENV'] = 'production';
  const prst = preset.map(v => `@babel/preset-${v}`).join(',');
  shell.exec(`babel "${src}" --out-dir "${out}" --source-maps --presets=${prst}`);
  shell.rm('-rf', `${out}/__tests__`);
};

module.exports = { Babel };