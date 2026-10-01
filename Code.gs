/********** PARKING PASS TRACKER - Google Apps Script **********/
const MANAGEMENT_EMAIL = "management@yourproperty.com";   // <-- change this
const PROPERTY_NAME    = "Your Property Name";             // <-- change this
const SHEET_NAME       = "Passes";
const LOAN_DAYS        = 14;

const HEADERS = ["Pass ID","Submitted","Name","Room","Phone","Email","Borrow Date","Due Date",
                 "Signature","Pass Returned?","Reminder Sent","Overdue Alert Sent","Notes"];
const COL = {}; HEADERS.forEach((h,i)=>COL[h]=i+1);

/* Run ONCE manually: builds the sheet, dropdowns, colors, and hourly trigger */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sh.getRange(1,1,1,HEADERS.length).setValues([HEADERS]).setFontWeight("bold")
    .setBackground("#1f3a5f").setFontColor("#ffffff");
  sh.setFrozenRows(1);
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(["No","Yes"],true).build();
  sh.getRange(2,COL["Pass Returned?"],1000,1).setDataValidation(rule);
  const r = sh.getRange(2,1,1000,HEADERS.length);
  const letter = String.fromCharCode(64+COL["Pass Returned?"]);
  const dueL = String.fromCharCode(64+COL["Due Date"]);
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(`=$${letter}2="Yes"`).setBackground("#d5f5e3").setRanges([r]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(`=AND($${letter}2="No",$${dueL}2<TODAY())`).setBackground("#f5b7b1").setRanges([r]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(`=AND($${letter}2="No",$${dueL}2-TODAY()<=1)`).setBackground("#fdebd0").setRanges([r]).build()
  ]);
  ScriptApp.getProjectTriggers().forEach(t=>ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("checkPasses").timeBased().everyHours(1).create();
}

/* Receives form submissions from the HTML page */
function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const p = e.parameter;
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const borrow = new Date(p.borrowDate + "T12:00:00");
    const due = new Date(borrow); due.setDate(due.getDate() + LOAN_DAYS);
    const id = "PP-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyMMdd") + "-" + (sh.getLastRow());
    sh.appendRow([id, new Date(), p.name, p.room, "'" + p.phone, p.email, borrow, due,
                  p.signature, "No", "", "", ""]);
    sh.getRange(sh.getLastRow(), COL["Borrow Date"], 1, 2).setNumberFormat("mm/dd/yyyy");

    const dueStr = fmt(due);
    MailApp.sendEmail({to:p.email, subject:`Parking Pass Confirmation - Due ${dueStr}`,
      htmlBody:`Hi ${p.name},<br><br>Your temporary parking pass request at <b>${PROPERTY_NAME}</b> is confirmed.<br><br>
        <b>Pass ID:</b> ${id}<br><b>Room:</b> ${p.room}<br><b>Borrowed:</b> ${fmt(borrow)}<br><b>Due back:</b> ${dueStr}<br><br>
        Reminder: if the pass is not returned by the due date, you may be charged fees including, but not limited to,
        a $200 parking fee and possible towing of your vehicle.<br><br>Thank you,<br>${PROPERTY_NAME} Management`});
    MailApp.sendEmail({to:MANAGEMENT_EMAIL, subject:`New Parking Pass Issued - ${p.name} (Room ${p.room})`,
      htmlBody:`A new temporary parking pass was requested.<br><br><b>Pass ID:</b> ${id}<br><b>Name:</b> ${p.name}<br>
        <b>Room:</b> ${p.room}<br><b>Phone:</b> ${p.phone}<br><b>Email:</b> ${p.email}<br><b>Due:</b> ${dueStr}<br><br>
        <a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}">Open the tracker</a>`});
    return ContentService.createTextOutput("OK");
  } finally { lock.releaseLock(); }
}

/* Runs every hour: 24-hour reminders + overdue alerts */
function checkPasses() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const last = sh.getLastRow(); if (last < 2) return;
  const rows = sh.getRange(2,1,last-1,HEADERS.length).getValues();
  const now = new Date(), url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  rows.forEach((r,i) => {
    const row = i + 2, returned = r[COL["Pass Returned?"]-1] === "Yes";
    if (returned || !r[COL["Due Date"]-1]) return;
    const due = new Date(r[COL["Due Date"]-1]); due.setHours(23,59,0,0);
    const hrsLeft = (due - now) / 36e5;
    const [id,,name,room,phone,email] = r;

    if (hrsLeft <= 24 && hrsLeft > 0 && !r[COL["Reminder Sent"]-1]) {
      const body = `Hi ${name},<br><br>This is a reminder that parking pass <b>${id}</b> (Room ${room}) is due back
        <b>${fmt(due)}</b> (within 24 hours).<br><br>If you have already returned your pass, please disregard this message.<br><br>
        Passes not returned by the due date may result in fees including, but not limited to, a $200 parking fee and possible towing.<br><br>
        ${PROPERTY_NAME} Management`;
      MailApp.sendEmail({to:email, cc:MANAGEMENT_EMAIL, subject:`Reminder: Parking Pass Due in 24 Hours`, htmlBody:body});
      sh.getRange(row, COL["Reminder Sent"]).setValue(new Date());
    }
    if (hrsLeft <= 0 && !r[COL["Overdue Alert Sent"]-1]) {
      MailApp.sendEmail({to:MANAGEMENT_EMAIL, subject:`ACTION NEEDED: Overdue Parking Pass - ${name} (Room ${room})`,
        htmlBody:`Parking pass <b>${id}</b> has <b>not been returned</b> and was due ${fmt(due)}.<br><br>
          <b>Name:</b> ${name}<br><b>Room:</b> ${room}<br><b>Phone:</b> ${phone}<br><b>Email:</b> ${email}<br><br>
          It is time to take action. Please review the resident's CRM profile for more details and follow the
          property's policy (parking fee / towing).<br><br><a href="${url}">Open the tracker (row ${row})</a>`});
      sh.getRange(row, COL["Overdue Alert Sent"]).setValue(new Date());
    }
  });
}

function fmt(d){ return Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), "EEEE, MMMM d, yyyy"); }
