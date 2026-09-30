import { timingSafeEqual } from 'node:crypto';
import { referralStatusPayload } from './referral-status.js';

const ALLOWED_STATUSES = new Set(['pending', 'success', 'failure']);

function authorized(candidate, expected) {
  if (!candidate || !expected) return false;
  const supplied = Buffer.from(candidate);
  const configured = Buffer.from(expected);
  return supplied.length === configured.length && timingSafeEqual(supplied, configured);
}

export function createStatusHandler({ getSecret, updateStatus }) {
  return async function PATCH(request) {
    const secret = getSecret();
    if (!secret) {
      return Response.json({ error: 'Status update API is not configured.' }, { status: 503 });
    }
    if (!authorized(request.headers.get('x-referral-status-secret'), secret)) {
      return Response.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
      return Response.json({ error: 'Content-Type must be application/json.' }, { status: 415 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Malformed JSON body.' }, { status: 400 });
    }

    const referralEmail = typeof body?.referralEmail === 'string' ? body.referralEmail.trim().toLowerCase() : '';
    const status = body?.status;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(referralEmail) || referralEmail.length > 320) {
      return Response.json({ error: 'referralEmail must be a valid email address.' }, { status: 400 });
    }
    if (!ALLOWED_STATUSES.has(status)) {
      return Response.json({ error: 'status must be pending, success, or failure.' }, { status: 400 });
    }

    try {
      const updated = await updateStatus(referralEmail, status);
      return Response.json(referralStatusPayload(updated));
    } catch (cause) {
      if (cause?.code === 'P2025') {
        return Response.json({ error: 'Referral not found.' }, { status: 404 });
      }
      console.error('Could not update referral status:', cause);
      return Response.json({ error: 'Could not update referral status.' }, { status: 500 });
    }
  };
}
