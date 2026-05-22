export const GOOGLE_SCRIPT_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbycsTuHrFhrC3wt7mcxUMyq0Bw5LyBN6OxCnQ-3MDaNlR8xDe4EO6q3hkNrFlzgnvNWWw/exec';

function submitViaHiddenForm(payload) {
  let iframe = document.getElementById('rsvp-hidden-frame');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'rsvp-hidden-frame';
    iframe.name = 'rsvp-hidden-frame';
    iframe.style.cssText = 'display:none;width:0;height:0;border:0';
    iframe.title = 'RSVP submit';
    document.body.appendChild(iframe);
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = GOOGLE_SCRIPT_URL;
  form.target = 'rsvp-hidden-frame';
  form.style.display = 'none';

  Object.entries(payload).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = String(value ?? '');
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  setTimeout(() => form.remove(), 3000);
}

/**
 * Submit RSVP — tries /api/rsvp first, then direct POST to Google Sheets.
 */
export async function submitRsvp(payload) {
  try {
    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (res.ok && data.success) {
      return { ok: true, method: 'api' };
    }

    // API missing or server error on Vercel — use direct Google form POST
    if (res.status === 404 || res.status === 500 || res.status === 502) {
      submitViaHiddenForm(payload);
      return { ok: true, method: 'direct' };
    }

    throw new Error(data.message || 'Could not save RSVP');
  } catch (err) {
    // Network error or API unreachable — direct form still works
    if (
      err.name === 'TypeError' ||
      err.message?.includes('fetch') ||
      err.message?.includes('Network')
    ) {
      submitViaHiddenForm(payload);
      return { ok: true, method: 'direct' };
    }
    throw err;
  }
}
