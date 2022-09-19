import { Git } from '@freik/node-utils';
import { Type } from '@Freik/core-utils';
import rl from 'readline';
import fs from 'fs';
import { once } from 'events';

export async function countLines(unparsed: string[]): Promise<number> {
  const include = unparsed
    .filter((v) => v.startsWith('.'))
    .map((v) => v.substring(1));
  const exclude = unparsed
    .filter((v) => v.startsWith('-'))
    .map((v) => v.substring(1));
  if (include.length + exclude.length !== unparsed.length) {
    console.error('Unknown arguments to ');
    return -1;
  }
  console.error(`Include: ${include.length} Exclude: ${exclude.length}`);
  const rgexp = '\\.(' + include.join('|') + ')$';
  const toCount = new RegExp(rgexp, 'i');
  const files = await Git.files({ groups: { toCount } });
  console.error(
    `Git files: ${files.groups.get('toCount')?.length || -1}, ${
      files.remaining.length
    }`,
  );
  const types = files.groups.get('toCount');
  if (Type.isUndefined(types)) {
    return 0;
  }
  // Remove any files that contain one of the excluded string patterns
  const filtered = types.filter((v) => !exclude.some((e) => v.indexOf(e) >= 0));
  // filtered should be the list of files to count lines in
  let total = 0;
  for (const pathname of filtered) {
    const rdln = rl.createInterface(fs.createReadStream(pathname, 'utf8'));
    let count = 0;
    rdln.on('line', (line) => {
      if (line.trim().length > 0) {
        count++;
      }
    });
    await once(rdln, 'close');
    console.log(pathname, ':', count);
    total += count;
  }
  console.log(`Total lines: ${total}`);
  return 0;
}
