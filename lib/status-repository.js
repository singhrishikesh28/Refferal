import { FAILURE_MESSAGE } from './referral-status.js';

export function createStatusRepository(getPrisma) {
  return async function updateStatus(referralEmail, status) {
    return getPrisma().referral.update({
      where: { referralEmail },
      data: {
        status,
        statusMessage: status === 'failure' ? FAILURE_MESSAGE : null,
      },
      select: { referralEmail: true, status: true, statusMessage: true },
    });
  };
}
