import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createStatusHandler } from '../lib/status-handler.js';
import { createStatusRepository } from '../lib/status-repository.js';

function request(body, secret = 'test-secret') {
  return new Request('http://localhost:3000/api/referrals/status', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json', 'x-referral-status-secret': secret },
    body: JSON.stringify(body),
  });
}

test('rejects status updates without the shared secret', async () => {
  let called = false;
  const patch = createStatusHandler({
    getSecret: () => 'test-secret',
    updateStatus: async () => { called = true; },
  });
  const response = await patch(request({ referralEmail: 'alex@example.com', status: 'failure' }, 'wrong'));
  assert.equal(response.status, 401);
  assert.equal(called, false);
});

test('returns the LinkedIn message when the external system marks failure', async () => {
  let updatedEmail;
  let updatedStatus;
  const patch = createStatusHandler({
    getSecret: () => 'test-secret',
    updateStatus: async (email, status) => {
      updatedEmail = email;
      updatedStatus = status;
      return { referralEmail: email, status };
    },
  });
  const response = await patch(request({ referralEmail: 'Alex@Example.com', status: 'failure' }));
  assert.equal(response.status, 200);
  assert.equal(updatedEmail, 'alex@example.com');
  assert.equal(updatedStatus, 'failure');
  assert.deepEqual(await response.json(), {
    referralEmail: 'alex@example.com',
    status: 'failure',
    message: 'Applied through LinkedIn',
  });
});

test('rejects unsupported status and reports unknown email', async () => {
  const patch = createStatusHandler({
    getSecret: () => 'test-secret',
    updateStatus: async () => { throw { code: 'P2025' }; },
  });
  assert.equal((await patch(request({ referralEmail: 'alex@example.com', status: 'reviewing' }))).status, 400);
  assert.equal((await patch(request({ referralEmail: 'alex@example.com', status: 'success' }))).status, 404);
});

test('Prisma update writes and clears the fixed failure message', async () => {
  const calls = [];
  const db = { referral: { update: async (args) => { calls.push(args); return args.data; } } };
  const updateStatus = createStatusRepository(() => db);
  await updateStatus('alex@example.com', 'failure');
  await updateStatus('alex@example.com', 'success');
  assert.equal(calls[0].where.referralEmail, 'alex@example.com');
  assert.deepEqual(calls[0].data, { status: 'failure', statusMessage: 'Applied through LinkedIn' });
  assert.deepEqual(calls[1].data, { status: 'success', statusMessage: null });
});
