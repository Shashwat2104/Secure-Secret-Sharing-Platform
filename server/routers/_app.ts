import { router } from '../trpc';
import { secretsRouter } from './secrets';

export const appRouter = router({
  secrets: secretsRouter,
});

export type AppRouter = typeof appRouter;