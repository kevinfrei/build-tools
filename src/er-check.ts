import concurrently from 'concurrently';

export async function electronReactCheck(): Promise<number> {
  await concurrently(['yarn types', 'yarn lint', 'yarn test']);
  return 0;
}
