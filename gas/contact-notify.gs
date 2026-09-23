/**
 * Elevate Media: website contact form.
 *
 * Runs as a Google Apps Script web app under kawika@elevatemediahi.com. The
 * contact form on elevatemediahi.com posts here. Each enquiry is logged to a
 * Google Sheet first, then emailed to the inbox with Reply-To set to the
 * sender, so answering it is just hitting Reply.
 *
 * Logged before emailed on purpose: if the email ever fails, the enquiry is
 * still in the sheet, and the failure itself is emailed.
 *
 * DEPLOY (one time)
 *   1. script.google.com, signed in as kawika@elevatemediahi.com, New project.
 *   2. Replace the sample code with this file. Save.
 *   3. Deploy > New deployment > type Web app
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      "Anyone with a Google account" will not work. If "Anyone" is missing,
 *      the Workspace admin setting for sharing outside the organisation needs
 *      turning on, the same change Hawaii Rental Tax needed.
 *   4. Authorise when asked. Copy the Web app URL ending in /exec.
 *
 * CHANGING IT LATER
 *   Deploy > Manage deployments > pencil > Version: New version.
 *   "New deployment" mints a new URL and the site keeps posting to the old one.
 */

var INBOX = 'kawika@elevatemediahi.com';
var SHEET_NAME = 'Elevate Media website enquiries';

function doPost(e) {
  var p = (e && e.parameter) || {};
  try {
    // Honeypot: a field people never see. Anything that fills it is a bot.
    // Answer "ok" so the bot learns nothing.
    if (p.website) return ContentService.createTextOutput('ok');

    var name = clean(p.name, 120);
    var email = clean(p.email, 200);
    var subject = clean(p.subject, 200);
    var message = clean(p.message, 5000);
    if (!name || !email || !message || email.indexOf('@') < 1) {
      return ContentService.createTextOutput('no');
    }

    log([new Date(), name, email, subject, message, clean(p.page, 200)]);

    MailApp.sendEmail({
      to: INBOX,
      replyTo: email,
      name: 'Elevate Media website',
      subject: 'Website enquiry: ' + (subject || 'from ' + name),
      body: 'Name:     ' + name + '\n'
          + 'Email:    ' + email + '\n'
          + 'Subject:  ' + (subject || '(none)') + '\n'
          + 'Page:     ' + (clean(p.page, 200) || '(unknown)') + '\n\n'
          + message + '\n\n'
          + '--\nReply to this email to answer ' + name + ' directly.'
    });
    return ContentService.createTextOutput('ok');

  } catch (err) {
    try {
      MailApp.sendEmail({
        to: INBOX,
        subject: 'Elevate Media: contact form FAILED',
        body: 'A website enquiry hit an error. What arrived:\n\n'
            + JSON.stringify(p, null, 2) + '\n\n'
            + (err && err.stack ? err.stack : String(err))
      });
    } catch (ignored) {}
    return ContentService.createTextOutput('error');
  }
}

// Opening the /exec URL in a browser should show this, which confirms the
// deployment is live and reachable.
function doGet() {
  return ContentService.createTextOutput('Elevate Media contact form endpoint is live.');
}

function clean(v, max) {
  return String(v || '').replace(/\s+$/g, '').slice(0, max).trim();
}

// The sheet is created on the first enquiry and its ID remembered, so there is
// nothing to set up by hand.
function log(row) {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  var ss;
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create(SHEET_NAME);
    ss.getSheets()[0].appendRow(['Received', 'Name', 'Email', 'Subject', 'Message', 'Page']);
    ss.getSheets()[0].setFrozenRows(1);
    props.setProperty('SHEET_ID', ss.getId());
  }
  ss.getSheets()[0].appendRow(row);
}
