# parking-pass-tracker
QR code parking pass check-out system with automated email reminders and overdue alerts. Replaced paper tracking that was losing ~$500/month at a leasing office. Built with HTML, JavaScript, Google Apps Script &amp; Sheets

The problem. Each custom pass cost $50 to replace and the office had about 10, roughly $500 in passes. Front desk staff worked different days and tracked passes from memory. Entrata had no automatic reminders in your setup, and the paper sign-out forms got lost between workers. The property was losing close to $500 almost every month.

The solution. It walks through the process step by step: scan, request, agree, log, confirm, remind, escalate.

What it does. A feature table that includes the color-coded status (green for returned, orange for due soon, red for overdue).

Tech stack, a flow diagram, the file list, setup steps, impact, and future improvements. Future improvements include SQL/Azure and a Power Automate version, which ties back to your other resume bullets.

How it works
QR code. It opens the form, which you host free on GitHub Pages, the same way you host your drone site.

Page 1. The resident enters name, room number, phone, email, and the date they're borrowing the pass. Today's date is filled in automatically.

Page 2. It shows the due date, two weeks out, and the agreement: "If not returned by the due date, you may be charged fees including, but not limited to, a $200 parking fee and possible towing of your vehicle." They sign by typing their name, which has to match page 1, and checking a box.

Sheet. Each request becomes a new row with a Pass ID, all their info, the due date, the signature, and a Pass Returned? Yes/No dropdown.

Instant emails. The resident gets a confirmation and management gets a "new pass issued" notice.

Hourly check:

24 hours before the due date: the resident gets a reminder that says "if already returned, please disregard," and management is CC'd.

Pass returned: management sets the dropdown to Yes. The row turns green and the emails stop.

Still No after the due date: management gets an email titled "ACTION NEEDED: Overdue Parking Pass" that says to take action and review the resident's CRM profile.
