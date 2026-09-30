import { auth } from '@clerk/nextjs/server';
import { createReferralHandler } from '../../../lib/referral-handler.js';
import { createReferralRepository } from '../../../lib/referral-repository.js';
import { getPrisma } from '../../../lib/prisma.js';

export const runtime = 'nodejs';

export const POST = createReferralHandler({
  getUserId: async () => (await auth()).userId,
  saveReferral: createReferralRepository(getPrisma),
});
