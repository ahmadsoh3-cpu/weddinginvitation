/**
 * Hannan & Jiya — Nikkah RSVP → Google Sheets
 *
 * SETUP:
 * 1. Open YOUR Google Sheet (the one where you want RSVPs).
 * 2. Extensions → Apps Script → paste this entire file → Save.
 *    (Script MUST be opened from the Sheet, OR set SPREADSHEET_ID below.)
 * 3. Run "setupSheet" once → allow permissions.
 * 4. Run "testRsvp" once → check "RSVP Responses" tab for a test row.
 * 5. Deploy → Manage deployments → New version → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. After ANY code change: Deploy → New version (same URL still works).
 */

// Optional: only if script is standalone (not opened from a Sheet).
// Copy from URL: https://docs.google.com/spreadsheets/d/PASTE_ID_HERE/edit
const SPREADSHEET_ID = '';

const SHEET_NAME = 'RSVP Responses';

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
 * Run from Apps Script editor to verify rows are written.
 */
function testRsvp() {
  const e = {
    postData: {
      type: 'application/json',
      contents: JSON.stringify({
        name: 'Test Guest',
        phone: '+923001234567',
        guests: '2',
        attend: 'yes',
        attendingLabel: 'Joyfully Accept',
        note: 'Test from Apps Script editor',
      }),
    },
  };
  const result = doPost(e);
  Logger.log(result.getContent());
}

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
    Logger.log('doPost error: ' + err);
    return jsonResponse_({ success: false, message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse_({ success: true, message: 'RSVP endpoint is running' });
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      'No spreadsheet linked. Open your Sheet → Extensions → Apps Script and paste this code there, OR set SPREADSHEET_ID at the top of Code.gs.'
    );
  }
  return ss;
}

function getOrCreateSheet_() {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    setupSheet();
  }
  return sheet;
}

function parsePayload_(e) {
  if (!e) {
    return normalizeFields_({});
  }

  // Form fields (application/x-www-form-urlencoded)
  if (e.parameter && Object.keys(e.parameter).length > 0) {
    return normalizeFields_(e.parameter);
  }

  if (!e.postData || !e.postData.contents) {
    return normalizeFields_(e.parameter || {});
  }

  const type = (e.postData.type || '').toLowerCase();
  const body = e.postData.contents;

  if (
    type.indexOf('application/json') !== -1 ||
    type.indexOf('text/plain') !== -1
  ) {
    return normalizeFields_(JSON.parse(body));
  }

  try {
    return normalizeFields_(JSON.parse(body));
  } catch (ignore) {
    return normalizeFields_(e.parameter || {});
  }
}

function normalizeFields_(data) {
  const attend = String(data.attend || data.attending || '').toLowerCase();
  let attendingLabel = String(data.attendingLabel || '').trim();

  if (!attendingLabel) {
    attendingLabel =
      attend === 'yes'
        ? 'Joyfully Accept'
        : attend === 'no'
          ? 'Regretfully Decline'
          : '';
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
    data.attendingLabel ||
      (data.attend === 'yes' ? 'Joyfully Accept' : 'Regretfully Decline'),
    data.note,
  ];
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
