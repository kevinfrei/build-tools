import shelljs from 'shelljs';

// eslint-disable-next-line no-console
const err = console.error;

export function electronReactBuildWithEnv(env: string, args: string[]): number {
  if (args.length === 0) {
    shelljs.exec(`${env} react-scripts build`);
  } else {
    err('No arguments to er-types currently...');
    err(args);
    err(args.length);
    return -1;
  }
  return 0;
}

export async function electronReactBuild(args: string[]): Promise<number> {
  return Promise.resolve(electronReactBuildWithEnv('', args));
}
