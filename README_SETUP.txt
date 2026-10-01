PARKING PASS TRACKER - SETUP GUIDE (about 20 minutes)
=====================================================

FILES
- index.html  : the 2-page form residents open from the QR code
- Code.gs     : backend (saves to the spreadsheet, sends emails, reminders, overdue alerts)
- qr_code.png : QR code that points to your GitHub Pages form link

STEP 1 - Make the spreadsheet + backend
1. Go to sheets.google.com and create a blank sheet named "Parking Pass Tracker".
2. Click Extensions > Apps Script. Delete the starter code and paste in everything from Code.gs.
3. Change MANAGEMENT_EMAIL and PROPERTY_NAME at the top. Click Save.
4. In the function dropdown pick "setup" and click Run. Allow the permissions it asks for.
   (Click "Advanced" > "Go to project" if Google warns you; it is your own script.)
   This creates the "Passes" tab, headers, Yes/No dropdown, colors, and an hourly check.

STEP 2 - Publish the backend
1. In Apps Script click Deploy > New deployment > type: Web app.
2. Execute as: Me.  Who has access: Anyone.  Click Deploy.
3. Copy the Web app URL (ends in /exec).

STEP 3 - Publish the form
1. Open index.html and replace PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE with the /exec URL.
2. Create a GitHub repo called "parking-pass", upload index.html, then Settings > Pages >
   Deploy from branch "main" > root. Your link will be:
   https://jsims47034.github.io/parking-pass/
3. The included qr_code.png already points to that link. If you use a different repo name,
   make a new QR code for your link.

STEP 4 - Test it
1. Scan the QR code, fill out the form with your own email.
2. Check: a new row in the sheet, a confirmation email to you, and a "new pass" email to management.
3. To test the reminder/overdue emails, change a row's Due Date to tomorrow or yesterday,
   then run "checkPasses" manually in Apps Script.

HOW MANAGEMENT USES IT
- When a pass comes back, set "Pass Returned?" to Yes. The row turns green and all emails stop.
- Orange row = due within 24 hours (resident gets a reminder, management CC'd).
- Red row = overdue. Management gets an "ACTION NEEDED - review CRM profile" email.
- Want it in Excel? File > Download > Microsoft Excel (.xlsx) anytime.

RESUME BULLET
Parking Pass Registration & Expiration Tracker | HTML/CSS, JavaScript, Google Apps Script, Google Sheets, GitHub Pages
- Built a QR code-accessed web form with a digital liability agreement that logs resident pass requests into a structured spreadsheet database.
- Automated confirmation emails, 24-hour due-date reminders, and overdue escalation alerts to management using time-driven triggers.
- Configured status tracking with data validation and conditional formatting so staff could audit active, due-soon, and overdue passes at a glance.
