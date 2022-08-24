import { execaSync } from 'execa';

execaSync(
  'pnpm',
  ['concurrently', '"npm run dev -C packages/client"', '"npm run dev -C packages/server"'],
  { stdio: 'inherit' }
);
