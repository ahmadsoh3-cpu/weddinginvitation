const GOOGLE_SCRIPT_URL =
  process.env.GOOGLE_SCRIPT_URL ||
  process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbwyYBtLYqC5EyqDx0FtLZxL8z2lbbwQamowqN9RdaliAm9_LRcVq2UOfRIOLYRfayO76w/exec';

export async function POST(request) {
  try {
    const body = await request.json();

    const scriptRes = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: body.name,
        phone: body.phone,
        guests: body.guests,
        attend: body.attend,
        attendingLabel: body.attendingLabel,
        note: body.note || '',
      }),
      redirect: 'follow',
    });

    const text = await scriptRes.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      if (text.includes('"success":true')) {
        data = { success: true, message: 'RSVP saved' };
      } else {
        data = {
          success: false,
          message: 'Unexpected response from Google Sheets. Redeploy your web app.',
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
    return Response.json(
      { success: false, message: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
