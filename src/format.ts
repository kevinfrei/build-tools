import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import { Git } from '@freik/node-utils';
import { Type } from '@freik/core-utils';

const execp = promisify(exec);

function makeFileLists(files: string[]): string[] {
  const res: string[] = [''];
  for (const file of files) {
    const cleaned = file.startsWith('"') ? file : `"${file}"`;
    if (
      res[res.length - 1].length === 0 ||
      res[res.length - 1].length + cleaned.length < 2048
    ) {
      res[res.length - 1] += ` ${cleaned}`;
    } else {
      res.push(cleaned);
    }
  }
  return res;
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
  const cpp = files.groups.get('clang');
  if (!Type.isUndefined(js)) {
    // Have to batch files: truly delightful... Thanks, windows shell...
    const fileLists = makeFileLists(js);
    for (const file of fileLists) {
      let jsres;
      try {
        jsres = await execp(`${pkgmgr} prettier --write ${file}`);
      } catch (e) {
        console.error(e);
        console.error(file);
        console.error(fileLists);
      }
      if (jsres !== undefined) {
        console.log(jsres.stdout);
        console.error(jsres.stderr);
      }
    }
  }
  if (!Type.isUndefined(cpp)) {
    const fileLists = makeFileLists(cpp);
    // Have to batch files: truly delightful... Thanks, windows shell...
    for (const file of fileLists) {
      let cppres;
      try {
        cppres = await execp(`clang-format -i ${file}`);
      } catch (e) {
        console.error(e);
        console.error(file);
        console.error(fileLists);
      }
      if (cppres !== undefined) {
        console.log(cppres.stdout);
        console.error(cppres.stderr);
      }
    }
  }
  return 0;
}
