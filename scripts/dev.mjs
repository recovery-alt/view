import execa from 'execa';

execa.sync(
  'pnpm',
  [
    'concurrently',
    '"pnpm dev --filter ./packages/client"',
    '"pnpm dev --filter ./packages/server"',
  ],
  { stdio: 'inherit' }
);
