import * as process from 'node:process';
import { isNumber } from './typechk.js';

const err = console.error; // eslint-disable-line no-console

export type Command = (args: string[]) => Promise<number> | number;

export function invoke(commands: Map<string, Command>): void {
  const cmd = commands.get(process.argv[2].toLocaleLowerCase());
  if (cmd !== undefined) {
    const res = cmd(process.argv.slice(3));
    if (!isNumber(res)) {
      res
        .then((val) => process.exit(val))
        .catch((rsn) => {
          err(rsn);
          process.exit(-1);
        });
    } else {
      process.exit(res);
    }
  } else {
    err('Sorry, unrecognized er command!');
    err('Supported commands:\n  ');
    err([...commands.keys()].join(', '));
    process.exit(-1);
  }
}
