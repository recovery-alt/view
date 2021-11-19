import { execaSync } from 'execa';

execaSync(
  'pnpm',
  [
    'concurrently',
    '"pnpm dev --filter ./packages/client"',
    '"pnpm dev --filter ./packages/server"',
  ],
  { stdio: 'inherit' }
);
