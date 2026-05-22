# Google Sheets RSVP — troubleshooting

## Why rows might not appear

1. **Script not linked to your Sheet**  
   Open the Sheet → **Extensions** → **Apps Script** → paste `Code.gs` there.  
   Or set `SPREADSHEET_ID` at the top of `Code.gs` (from the sheet URL).

2. **Old deployment**  
   After changing code: **Deploy** → **Manage deployments** → pencil icon → **New version** → **Deploy**.

3. **Browser blocked the old form**  
   The site now sends RSVPs via `/api/rsvp` (server → Google), which is reliable.

## Setup checklist

1. Paste `Code.gs` into Apps Script (from your Sheet).
2. Run **`setupSheet`** once.
3. Run **`testRsvp`** once — a test row should appear in **RSVP Responses**.
4. Deploy web app: **Execute as: Me**, **Anyone** can access.
5. Redeploy your Vercel site after pushing the latest GitHub code.

## Test the endpoint

Open in browser (GET test):

https://script.google.com/macros/s/AKfycbwyYBtLYqC5EyqDx0FtLZxL8z2lbbwQamowqN9RdaliAm9_LRcVq2UOfRIOLYRfayO76w/exec

Should show: `{"success":true,"message":"RSVP endpoint is running"}`
