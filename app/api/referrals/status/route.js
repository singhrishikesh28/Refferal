import { createStatusHandler } from '../../../../lib/status-handler.js';
import { createStatusRepository } from '../../../../lib/status-repository.js';
import { getPrisma } from '../../../../lib/prisma.js';

export const runtime = 'nodejs';

export const PATCH = createStatusHandler({
  getSecret: () => process.env.STATUS_UPDATE_SECRET,
  updateStatus: createStatusRepository(getPrisma),
});
