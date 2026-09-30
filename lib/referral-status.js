export const FAILURE_MESSAGE = 'Applied through LinkedIn';

export function referralStatusPayload(referral) {
  return {
    referralEmail: referral.referralEmail,
    status: referral.status,
    ...(referral.status === 'failure' ? { message: FAILURE_MESSAGE } : {}),
  };
}
