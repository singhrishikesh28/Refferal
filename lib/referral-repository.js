export function createReferralRepository(getPrisma) {
  return async function saveReferral(referral) {
    return getPrisma().referral.create({
      data: {
        referralName: referral.referralName,
        graduationDate: referral.graduationDate,
        referralEmail: referral.referralEmail,
        jobId: referral.jobId,
        referralRole: referral.referralRole,
        referralRoleType: referral.referralRoleType,
        relationship: referral.relationship,
        recommendation: referral.recommendation,
        resumeFilename: referral.resumeFilename,
        resumeMimeType: referral.resumeMimeType,
        resumeBase64: referral.resumeBase64,
      },
      select: { referralEmail: true, jobId: true, referralRole: true, referralRoleType: true, status: true, createdAt: true },
    });
  };
}
