import { referralStatusPayload } from './referral-status.js';
import { getOpeningById } from './openings.js';
import { formatGraduationDate } from './graduation-date.js';

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_RESUME_BYTES + 64 * 1024;
const FIELD_LIMITS = {
  referralName: 200,
  graduationDate: 10,
  referralEmail: 320,
  jobId: 200,
  relationship: 2000,
  recommendation: 4000,
};

function error(message, status = 400) {
  return Response.json({ error: message }, { status });
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function resumeMimeType(file, bytes) {
  const filename = file.name.toLowerCase();
  if (filename.endsWith('.pdf') && bytes.subarray(0, 5).toString() === '%PDF-') {
    return 'application/pdf';
  }
  if (filename.endsWith('.docx') && bytes.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (filename.endsWith('.doc') && bytes.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))) {
    return 'application/msword';
  }
  return null;
}

export function createReferralHandler({ getUserId, saveReferral }) {
  return async function POST(request) {
    const userId = await getUserId();
    if (!userId) {
      return error('Sign in to submit a referral.', 401);
    }

    if (!request.headers.get('content-type')?.toLowerCase().startsWith('multipart/form-data;')) {
      return error('Content-Type must be multipart/form-data.', 415);
    }

    const contentLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      return error('Request exceeds the upload size limit.', 413);
    }

    let form;
    try {
      form = await request.formData();
    } catch {
      return error('Malformed multipart form data.');
    }

    const values = {};
    for (const [field, maxLength] of Object.entries(FIELD_LIMITS)) {
      const value = form.get(field);
      if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
        return error(`${field} is required and must be at most ${maxLength} characters.`);
      }
      values[field] = value.trim();
    }

    if (!isValidDate(values.graduationDate)) {
      return error('graduationDate must be a valid date in YYYY-MM-DD format.');
    }
    const opening = getOpeningById(values.jobId);
    if (!opening) {
      return error('jobId must be a listed Engineering job ID.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.referralEmail)) {
      return error('referralEmail must be a valid email address.');
    }
    values.referralEmail = values.referralEmail.toLowerCase();

    const resume = form.get('resume');
    if (!(resume instanceof File) || !resume.name || resume.size === 0) {
      return error('resume must be a non-empty file.');
    }
    if (resume.size > MAX_RESUME_BYTES) {
      return error('resume must be 5 MB or smaller.', 413);
    }

    const bytes = Buffer.from(await resume.arrayBuffer());
    const mimeType = resumeMimeType(resume, bytes);
    if (!mimeType) {
      return error('resume must be a PDF, DOC, or DOCX file.');
    }

    try {
      const saved = await saveReferral({
        ...values,
        graduationDate: formatGraduationDate(values.graduationDate),
        referralRole: opening.title,
        referralRoleType: opening.roleType,
        resumeFilename: resume.name,
        resumeMimeType: mimeType,
        resumeBase64: bytes.toString('base64'),
      });
      return Response.json({
        ...referralStatusPayload(saved),
        jobId: saved.jobId,
        referralRole: saved.referralRole,
        referralRoleType: saved.referralRoleType,
        createdAt: saved.createdAt.toISOString(),
      }, { status: 201 });
    } catch (cause) {
      if (cause?.code === 'P2002') {
        return error('A referral with this email already exists.', 409);
      }
      console.error('Could not save referral:', cause);
      return error('Could not save referral.', 500);
    }
  };
}
