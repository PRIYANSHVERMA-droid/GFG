# Connecting DOOMSDAY Cadet Registrations to Google Sheets

Follow these quick steps to send every recruitment submission directly to your Google Sheet in real-time.

---

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Name it **"DOOMSDAY 2026 — GFG Bennett Cadet Registrations"**.

---

### Step 2: Open the Apps Script Editor
1. In the Google Sheet top menu, click **Extensions** $\rightarrow$ **Apps Script**.
2. Delete whatever code is inside the editor (`myFunction()`).
3. Paste the following complete script:

```javascript
/**
 * GOOGLE APPS SCRIPT — DOOMSDAY CADET RECRUITMENT WEBHOOK
 * GeeksForGeeks Student Chapter × Bennett University
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Automatically create styled headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Transmission ID",
        "Timestamp",
        "Realm / Vanguard",
        "Sector",
        "Full Name",
        "Bennett Email",
        "Enrollment No",
        "Phone / WhatsApp",
        "Academic Year",
        "Branch",
        "Primary Domain",
        "Secondary Domain",
        "Proficiency Level",
        "GitHub URL",
        "Portfolio URL",
        "Resume / Drive Link",
        "Directive Statement",
        "Proudest Project / Feat"
      ]);

      // Style header row with Marvel/GFG emerald theme
      var headerRange = sheet.getRange(1, 1, 1, 18);
      headerRange.setBackground("#0F3D2E");
      headerRange.setFontColor("#3AFFA0");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // Parse submitted cadet payload
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.transmissionId || "",
      data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.realm || "",
      data.sector || "",
      data.fullName || "",
      data.bennettEmail || "",
      data.enrollmentNumber || "",
      data.phoneNumber || "",
      data.studyYear || "",
      data.branch || "",
      data.primaryDomain || "",
      data.secondaryDomain || "",
      data.proficiencyLevel || "",
      data.githubUrl || "",
      data.portfolioUrl || "",
      data.resumeUrl || "",
      data.directiveStatement || "",
      data.greatestProject || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", id: data.transmissionId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

---

### Step 3: Deploy as a Web App
1. In the top-right corner of the Apps Script editor, click **Deploy** $\rightarrow$ **New deployment**.
2. Click the gear icon (**Select type**) and pick **Web app**.
3. Fill in:
   - **Description**: `DOOMSDAY Registration Webhook`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Important: This allows the webpage to submit data without asking students to sign into Google)*
4. Click **Deploy**.
5. Grant permissions if prompted by Google (click *Advanced* $\rightarrow$ *Go to Untitled project (unsafe)* $\rightarrow$ *Allow*).
6. Copy the generated **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

### Step 4: Paste into `register.js`
Open `register.js` in your project and paste your URL at line 8:

```javascript
const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

That's it! Every submitted cadet dossier will now instantly create a new formatted row in your Google Sheet in real time.
