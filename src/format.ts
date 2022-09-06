import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import { Git } from '@freik/node-utils';
import { Type } from '@Freik/core-utils';

const execp = promisify(exec);

function makeFileList(files: string[]) {
  return files.map((f) => (f.startsWith('"') ? f : `"${f}"`)).join(' ');
}

export async function formatFiles(unparsed: string[]): Promise<number> {
  let pkgmgr = 'yarn';
  if (unparsed.length === 1) {
    if (
      unparsed[0] === 'npm' ||
      unparsed[0] === 'yarn' ||
      unparsed[0] === 'pnpm'
    ) {
      pkgmgr = unparsed[0];
    } else {
      console.error('Unknown package manager: ' + unparsed[0]);
      return -1;
    }
  } else if (unparsed.length !== 0) {
    console.error('Unknown arguments to format');
    return -1;
  }
  const files = await Git.files({
    groups: {
      prettier: (filename: string) => {
        if (filename === '.prettierrc') {
          return true;
        }
        return /\.(ts|tsx|js|jsx|md|html|css|json)$/i.test(filename);
      },
      clang: /\.(cpp|c|cc|h|hh|hpp)$/i,
    },
  });
  const js = files.groups.get('prettier');
  const cpp = files.groups.get('cpp');
  if (!Type.isUndefined(js)) {
    const fileList = makeFileList(js);
    const jsres = await execp(`${pkgmgr} prettier ${fileList}`);
    console.log(jsres.stdout);
    console.error(jsres.stderr);
  }
  if (!Type.isUndefined(cpp)) {
    const fileList = makeFileList(cpp);
    const cppres = await execp(`clang-format -i ${fileList}`);
    console.log(cppres.stdout);
    console.error(cppres.stderr);
  }
  return 0;
}
