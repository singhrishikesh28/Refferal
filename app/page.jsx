'use client';

import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { useState } from 'react';
import { OPENINGS } from '../lib/openings.js';

export default function Home() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  async function submitReferral(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        body: new FormData(form),
        credentials: 'same-origin',
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error || `Request failed (${response.status}).`);
      }
      setResult({ success: true, message: `Referral submitted. Status: ${body.status}.` });
      form.reset();
    } catch (error) {
      setResult({ success: false, message: error.message || 'Could not submit referral.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Juspay referrals</p>
          <h1>Test the referral API</h1>
          <p>Sign in, complete the form, and submit one test referral to Supabase.</p>
        </div>
        <Show when="signed-in"><UserButton /></Show>
      </header>

      <Show when="signed-out">
        <section className="card">
          <h2>Step 1: Sign in</h2>
          <p>Use a test account in your Clerk application. Create one if needed.</p>
          <div className="actions">
            <SignInButton mode="modal"><button type="button">Sign in</button></SignInButton>
            <SignUpButton mode="modal"><button type="button" className="secondary">Create account</button></SignUpButton>
          </div>
        </section>
      </Show>

      <Show when="signed-in">
        <section className="card">
          <h2>Step 2: Submit a referral</h2>
          <p>Choose a PDF, DOC, or DOCX up to 5 MB. You can <a href="/sample-resume.pdf" download>download a sample PDF</a> for this test.</p>
          <form className="referral-form" onSubmit={submitReferral} encType="multipart/form-data">
            <label>Referral name<input name="referralName" required maxLength={200} /></label>
            <label>Date of graduation<input name="graduationDate" type="date" required /></label>
            <label>Referral email<input name="referralEmail" type="email" required maxLength={320} /></label>
            <label>Opening
              <select name="jobId" required defaultValue="">
                <option value="" disabled>Select an opening</option>
                {OPENINGS.map(({ id, title, roleType, location }) => (
                  <option key={id} value={id}>{title} — {roleType} — {location} ({id})</option>
                ))}
              </select>
            </label>
            <label>Resume<input name="resume" type="file" accept=".pdf,.doc,.docx" required /></label>
            <label>How do you know them?<textarea name="relationship" required maxLength={2000} rows={3} /></label>
            <label>Why do you recommend them for Juspay?<textarea name="recommendation" required maxLength={4000} rows={4} /></label>
            <button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit test referral'}</button>
          </form>
          {result && <p className={result.success ? 'result success' : 'result error'} role="status">{result.message}</p>}
        </section>
      </Show>
    </main>
  );
}
