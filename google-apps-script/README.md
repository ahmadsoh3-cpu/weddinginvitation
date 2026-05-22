# Google Sheets RSVP setup

## 1. Google Sheet + Apps Script

1. Go to [Google Sheets](https://sheets.google.com) → create a new spreadsheet.
2. **Extensions** → **Apps Script**.
3. Delete any default code and paste everything from `Code.gs`.
4. **Save** the project (e.g. name it `Nikkah RSVP`).
5. In the function dropdown, choose **`setupSheet`** → **Run** → allow permissions.
6. **Deploy** → **New deployment** → type **Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
7. **Deploy** → copy the **Web app URL** (ends with `/exec`).

## 2. Connect the website (optional)

In your project root, create `.env.local`:

```
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Then update `RsvpForm` in `app/page.js` to `POST` to that URL before or instead of opening WhatsApp.

## Sheet columns

| Timestamp | Name | Phone / WhatsApp | Guests | Attending | Note |
