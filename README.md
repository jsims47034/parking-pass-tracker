# 🅿️ Parking Pass Tracker

**A QR code–based check-out system for temporary parking passes: automated tracking, reminders, and overdue alerts for a leasing office.**

`HTML/CSS` · `JavaScript` · `Google Apps Script` · `Google Sheets` · `GitHub Pages` · `Process Automation`

---

## 📌 The Problem

During my internship at a leasing office, one of the most frustrating recurring problems was the **temporary parking passes**.

- Each pass is custom-made to work with the property's parking system and costs **$50** to replace.
- The office kept about **10 passes** in rotation, about **$500** in equipment.
- When the front desk handed out a pass, staff mostly had to **remember** who had it.
- Front desk employees work **different days**, so the knowledge didn't carry over from shift to shift.
- We tried logging passes in the resident CRM (**Entrata**), but our setup had **no automatic reminders or follow-ups**, so it still depended on someone remembering to check.
- Residents signed a **paper form**, but those forms were often **lost between workers**.

**The result:** passes went missing regularly, and the property was losing close to **$500 almost every month** in replacement costs, along with staff time spent tracking passes down.

## 💡 The Solution

I built a simple, free, automated system that takes memory and paper out of the process:

1. **Scan.** A resident scans a QR code at the front desk.
2. **Request.** A 2-page web form collects their name, room number, phone, email, and borrow date.
3. **Agree.** Page 2 shows the **due date (14 days later)** and a liability agreement. The resident signs by typing their name, acknowledging that an unreturned pass may lead to fees including, but not limited to, a **$200 parking fee and possible towing**.
4. **Log.** The request is saved automatically as a row in a shared spreadsheet that every staff member can see.
5. **Confirm.** The resident gets a confirmation email and management gets a "new pass issued" alert.
6. **Remind.** **24 hours before** the due date, the resident gets a reminder (management CC'd), which says to disregard it if the pass is already returned.
7. **Escalate.** If the pass still isn't marked returned after the due date, management gets an **"ACTION NEEDED"** email to take action and review the resident's CRM profile.

When the pass comes back, staff set **Pass Returned? → Yes**, and all reminders stop.

## ⚙️ What It Does

| Feature | Description |
|---|---|
| QR code access | Residents open the form from their phone. No app needed |
| Digital agreement | Typed signature must match the name entered, so there's a clear record |
| Auto due date | Calculated as borrow date + 14 days |
| Central log | Every pass is in one shared sheet, so nothing depends on one person's memory |
| Unique Pass IDs | Each checkout gets an ID (e.g., `PP-261001-5`) |
| Color-coded status | 🟢 Returned · 🟠 Due within 24 hrs · 🔴 Overdue |
| Automated emails | Confirmation, 24-hour reminder, and overdue escalation |
| Hourly check | Time-based trigger checks every pass automatically |
| Excel export | File → Download → .xlsx anytime |

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (hosted free on GitHub Pages)
- **Backend:** Google Apps Script web app
- **Database:** Google Sheets (data validation, conditional formatting)
- **Automation:** Apps Script time-driven triggers + MailApp email service
- **Cost to run:** $0

## 🏗️ How It Works

```
QR Code → HTML Form (GitHub Pages) → Apps Script Web App → Google Sheet
                                              │
                         ┌────────────────────┼──────────────────────┐
                  Confirmation email   24-hr reminder (hourly)   Overdue alert to mgmt
```

## 📂 Files

| File | Purpose |
|---|---|
| `index.html` | 2-page resident form + agreement |
| `Code.gs` | Backend: saves data, sends emails, runs reminders |
| `README_SETUP.txt` | Step-by-step deployment guide |

## 🚀 Setup

See [`README_SETUP.txt`](README_SETUP.txt). Setup takes about 20 minutes:
1. Create a Google Sheet → Extensions → Apps Script → paste `Code.gs` → run `setup()`.
2. Deploy as a Web App and copy the URL.
3. Paste the URL into `index.html` and publish it on GitHub Pages.
4. Generate a QR code for the Pages link and post it at the front desk.

## 📈 Impact

- Replaces lost paper forms and memory-based tracking with **one shared source of record**.
- Works across **every shift**, since any staff member can see who has each pass.
- Automatic reminders mean residents return passes **before** they become a problem.
- Built to prevent losses of up to **~$500/month** in replacement passes.

## 🔮 Future Improvements

- Migrate the data to a SQL database or Microsoft Azure for reporting.
- Rebuild with Microsoft Forms + Power Automate for Microsoft 365 offices.
- Add an SMS reminder option.
- Add a dashboard for pass usage trends and return rates.

---

👤 **Josiah Sims**, Information Systems student, University of Texas at Arlington
🔗 [Portfolio / JS Drone Co.](https://jsims47034.github.io/JS-Drone-Co/index.html)
