export const dynamic = 'force-dynamic';

const GOOGLE_SCRIPT_URL =
  process.env.GOOGLE_SCRIPT_URL ||
  process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbycsTuHrFhrC3wt7mcxUMyq0Bw5LyBN6OxCnQ-3MDaNlR8xDe4EO6q3hkNrFlzgnvNWWw/exec';

function getUrlSource() {
  if (process.env.GOOGLE_SCRIPT_URL) return 'GOOGLE_SCRIPT_URL';
  if (process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL) return 'NEXT_PUBLIC_GOOGLE_SCRIPT_URL';
  return 'hardcoded fallback';
}

function buildFormBody(body) {
  const params = new URLSearchParams();
  params.append('name', body.name || '');
  params.append('phone', body.phone || '');
  params.append('guests', body.guests || '1');
  params.append('attend', body.attend || 'yes');
  params.append('attendingLabel', body.attendingLabel || '');
  params.append('note', body.note || '');
  return params.toString();
}

export async function POST(request) {
  const logPrefix = '[RSVP /api/rsvp]';

  try {
    const body = await request.json();

    console.log(`${logPrefix} 1. Request body:`, {
      name: body.name,
      phone: body.phone,
      guests: body.guests,
      attend: body.attend,
      attendingLabel: body.attendingLabel,
      note: body.note ? `${String(body.note).slice(0, 50)}...` : '',
    });

    if (!body.name?.trim()) {
      return Response.json({ success: false, message: 'Name is required' }, { status: 400 });
    }
    if (!body.phone?.trim()) {
      return Response.json({ success: false, message: 'Phone is required' }, { status: 400 });
    }

    const formBody = buildFormBody(body);
    console.log(`${logPrefix} 2. Forwarding to Google Apps Script:`, {
      urlSource: getUrlSource(),
      url: GOOGLE_SCRIPT_URL,
      formBody,
    });

    let scriptRes;
    try {
      scriptRes = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody,
        redirect: 'follow',
      });
    } catch (fetchErr) {
      console.error(`${logPrefix} 4. Fetch error:`, {
        name: fetchErr.name,
        message: fetchErr.message,
        cause: fetchErr.cause,
      });
      throw fetchErr;
    }

    const text = await scriptRes.text();

    console.log(`${logPrefix} 3. Google response:`, {
      status: scriptRes.status,
      statusText: scriptRes.statusText,
      ok: scriptRes.ok,
      bodyPreview: text.slice(0, 500),
    });

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      if (text.includes('"success":true') || text.includes('RSVP saved')) {
        data = { success: true, message: 'RSVP saved' };
      } else {
        console.error(`${logPrefix} Unexpected Google body:`, text.slice(0, 500));
        data = {
          success: false,
          message:
            'Google Sheets returned an unexpected response. Run testRsvp in Apps Script and redeploy.',
        };
      }
    }

    if (!data.success) {
      console.error(`${logPrefix} Google reported failure:`, data);
      return Response.json(
        { success: false, message: data.message || 'Could not save RSVP' },
        { status: 400 }
      );
    }

    console.log(`${logPrefix} Success:`, data.message);
    return Response.json({ success: true, message: data.message });
  } catch (err) {
    console.error(`${logPrefix} 4. Handler error:`, {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
    return Response.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
