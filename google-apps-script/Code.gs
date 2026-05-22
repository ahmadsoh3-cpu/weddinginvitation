/**
 * Hannan & Jiya — Nikkah RSVP → Google Sheets
 *
 * SETUP:
 * 1. Create a new Google Sheet (or open an existing one).
 * 2. Extensions → Apps Script → paste this entire file → Save.
 * 3. Run "setupSheet" once (authorize when prompted).
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and use it in your site (see README below).
 */

const SHEET_NAME = 'RSVP Responses';

/**
 * Run once from the Apps Script editor to create headers.
 */
function setupSheet() {
  const sheet = getOrCreateSheet_();
  const headers = [
    'Timestamp',
    'Name',
    'Phone / WhatsApp',
    'Guests',
    'Attending',
    'Note',
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#1B3A2D')
      .setFontColor('#FAF3E8');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
}

/**
 * Web App POST — receives RSVP from your Next.js form.
 * Accepts JSON body or form-urlencoded fields.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const payload = parsePayload_(e);
    const row = buildRow_(payload);
    const sheet = getOrCreateSheet_();
    sheet.appendRow(row);

    return jsonResponse_({ success: true, message: 'RSVP saved' });
  } catch (err) {
    return jsonResponse_({ success: false, message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Optional health check: open the Web App URL in a browser.
 */
function doGet() {
  return jsonResponse_({ success: true, message: 'RSVP endpoint is running' });
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    setupSheet();
  }
  return sheet;
}

function parsePayload_(e) {
  if (!e || !e.postData) {
    return normalizeFields_(e ? e.parameter : {});
  }

  const type = (e.postData.type || '').toLowerCase();
  const body = e.postData.contents || '';

  if (type.indexOf('application/json') !== -1) {
    return normalizeFields_(JSON.parse(body));
  }

  // application/x-www-form-urlencoded or multipart
  try {
    return normalizeFields_(JSON.parse(body));
  } catch (ignore) {
    return normalizeFields_(e.parameter || {});
  }
}

function normalizeFields_(data) {
  const attend = String(data.attend || data.attending || '').toLowerCase();
  let attendingLabel = String(data.attendingLabel || data.attending || '').trim();

  if (!attendingLabel) {
    attendingLabel = attend === 'yes' ? 'Joyfully Accept' : attend === 'no' ? 'Regretfully Decline' : '';
  }

  return {
    name: String(data.name || '').trim(),
    phone: String(data.phone || '').trim(),
    guests: String(data.guests || '1').trim(),
    attend: attend,
    attendingLabel: attendingLabel,
    note: String(data.note || '').trim(),
  };
}

function buildRow_(data) {
  if (!data.name) throw new Error('Name is required');
  if (!data.phone) throw new Error('Phone is required');

  const guests = Math.min(6, Math.max(1, parseInt(data.guests, 10) || 1));
  const tz = Session.getScriptTimeZone() || 'Asia/Karachi';
  const timestamp = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');

  return [
    timestamp,
    data.name,
    data.phone,
    guests,
    data.attendingLabel || (data.attend === 'yes' ? 'Joyfully Accept' : 'Regretfully Decline'),
    data.note,
  ];
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
