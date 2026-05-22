export const dynamic = 'force-dynamic';

const GOOGLE_SCRIPT_URL =
  process.env.GOOGLE_SCRIPT_URL ||
  process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbycsTuHrFhrC3wt7mcxUMyq0Bw5LyBN6OxCnQ-3MDaNlR8xDe4EO6q3hkNrFlzgnvNWWw/exec';

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
  try {
    const body = await request.json();

    if (!body.name?.trim()) {
      return Response.json({ success: false, message: 'Name is required' }, { status: 400 });
    }
    if (!body.phone?.trim()) {
      return Response.json({ success: false, message: 'Phone is required' }, { status: 400 });
    }

    const scriptRes = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: buildFormBody(body),
      redirect: 'follow',
    });

    const text = await scriptRes.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      if (text.includes('"success":true') || text.includes('RSVP saved')) {
        data = { success: true, message: 'RSVP saved' };
      } else {
        console.error('Google Script response:', text.slice(0, 300));
        data = {
          success: false,
          message:
            'Google Sheets returned an unexpected response. Run testRsvp in Apps Script and redeploy.',
        };
      }
    }

    if (!data.success) {
      return Response.json(
        { success: false, message: data.message || 'Could not save RSVP' },
        { status: 400 }
      );
    }

    return Response.json({ success: true, message: data.message });
  } catch (err) {
    console.error('RSVP API error:', err);
    return Response.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
