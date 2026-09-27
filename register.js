/* ==========================================================================
   DOOMSDAY — GFG STUDENT CHAPTER × BENNETT UNIVERSITY
   Cadet Registration Portal Script Controller
   ========================================================================== */

// --- GOOGLE SHEETS INTEGRATION ENDPOINT ---
// Paste your deployed Google Apps Script Web App URL below:
const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyaYaOJwX2crDTppHa-jzHKDRQCSmi33a_htgE1bT45jz5Q8Cudtg0oapR6ddnyETLy2g/exec";

document.addEventListener('DOMContentLoaded', () => {
  initRealmSelector();
  initFormValidationAndDraft();
  initCharacterCounters();
  initLiveClock();
});

/* ==========================================================================
   1. REALM SELECTION & DYNAMIC ACCENT THEMING
   ========================================================================== */
const REALM_THEMES = {
  doom: {
    color: '#3AFFA0',
    glow: 'rgba(58, 255, 160, 0.28)',
    bg: 'rgba(15, 61, 46, 0.22)',
    sector: 'LATVERIA (DOOM)',
    lead: 'TRANSMISSION ESTABLISHED: DR. DOOM // TECHNICAL ARCHITECTURE',
    body: 'Cadets in this realm will construct high-throughput full stack apps, AI models, and resilient systems.',
    defaultDomain: 'Frontend Development'
  },
  spiderman: {
    color: '#FF5A6E',
    glow: 'rgba(217, 30, 54, 0.35)',
    bg: 'rgba(217, 30, 54, 0.12)',
    sector: 'QUEENS (SPIDER-MAN)',
    lead: 'TRANSMISSION ESTABLISHED: SPIDER-MAN // THE CREATIVE WEB',
    body: 'Designers, motion artists, and 3D visionaries will weave cutting-edge interfaces and brand campaigns.',
    defaultDomain: 'UI/UX Design'
  },
  thor: {
    color: '#A68FFF',
    glow: 'rgba(123, 92, 255, 0.35)',
    bg: 'rgba(123, 92, 255, 0.14)',
    sector: 'ASGARD (THOR)',
    lead: 'TRANSMISSION ESTABLISHED: THOR ODINSON // LIGHTNING ALGORITHMS',
    body: 'Competitive programmers and algorists will conquer LeetCode, CodeForces, and intense hackathon sprints.',
    defaultDomain: 'Data Structures & Algorithms'
  },
  cap: {
    color: '#88C0D0',
    glow: 'rgba(94, 129, 172, 0.35)',
    bg: 'rgba(27, 42, 74, 0.35)',
    sector: 'BROOKLYN (CAPTAIN AMERICA)',
    lead: 'TRANSMISSION ESTABLISHED: CAPTAIN AMERICA // STRATEGIC COMMAND',
    body: 'Command operations, corporate sponsorship, major event orchestration, PR, and community growth.',
    defaultDomain: 'Event Operations'
  }
};

let currentRealm = 'doom';

function initRealmSelector() {
  const realmCards = document.querySelectorAll('.realm-card');
  const transmissionLead = document.getElementById('transmission-lead');
  const transmissionBody = document.getElementById('transmission-body');
  const primaryDomainSelect = document.getElementById('primaryDomain');

  realmCards.forEach((card) => {
    card.addEventListener('click', () => {
      const realmKey = card.getAttribute('data-realm');
      if (!realmKey || !REALM_THEMES[realmKey]) return;

      currentRealm = realmKey;

      // Update UI classes
      realmCards.forEach((c) => c.classList.remove('is-selected'));
      card.classList.add('is-selected');

      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      // Apply dynamic CSS custom properties
      const theme = REALM_THEMES[realmKey];
      document.documentElement.style.setProperty('--active-realm-color', theme.color);
      document.documentElement.style.setProperty('--active-realm-glow', theme.glow);
      document.documentElement.style.setProperty('--active-realm-bg', theme.bg);

      // Update transmission text
      if (transmissionLead) transmissionLead.textContent = theme.lead;
      if (transmissionBody) transmissionBody.textContent = theme.body;

      // Auto-suggest default track if user hasn't explicitly chosen yet
      if (primaryDomainSelect && (!primaryDomainSelect.value || primaryDomainSelect.value === '')) {
        primaryDomainSelect.value = theme.defaultDomain;
      }
    });
  });
}

/* ==========================================================================
   2. LIVE PROTOCOL CLOCK
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-protocol-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const formatted = `SEC-TIME: ${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} // ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} IST`;
    clockEl.textContent = formatted;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   3. CHARACTER COUNTERS
   ========================================================================== */
function initCharacterCounters() {
  setupCounter('directiveStatement', 'char-counter-directive', 600);
  setupCounter('greatestProject', 'char-counter-project', 500);
}

function setupCounter(inputId, counterId, maxLen) {
  const input = document.getElementById(inputId);
  const counter = document.getElementById(counterId);
  if (!input || !counter) return;

  function update() {
    const len = input.value.length;
    counter.textContent = `${len} / ${maxLen}`;
    if (len >= maxLen) {
      counter.style.color = '#FF5A6E';
    } else {
      counter.style.color = '';
    }
  }

  input.addEventListener('input', update);
  update();
}

/* ==========================================================================
   4. FORM VALIDATION, DRAFT SYSTEM, AND SUBMISSION
   ========================================================================== */
const DRAFT_STORAGE_KEY = 'gfg_doomsday_cadet_draft_v1';

function initFormValidationAndDraft() {
  const form = document.getElementById('dossier-form');
  const saveDraftBtn = document.getElementById('btn-save-draft');
  const clearDraftBtn = document.getElementById('btn-clear-draft');
  const submitBtn = document.getElementById('btn-submit-dossier');
  const printBtn = document.getElementById('btn-print-pass');

  if (!form) return;

  // Restore draft if saved
  restoreDraft(form);

  // Clear error styles on input
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });

    field.addEventListener('change', () => {
      const group = field.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  });

  // Save Draft Click
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
      saveDraft(form);
      showToast('✓ Draft saved to local sector storage.');
    });
  }

  // Clear Draft Click
  if (clearDraftBtn) {
    clearDraftBtn.addEventListener('click', () => {
      if (confirm('Clear saved draft and reset all fields?')) {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        form.reset();
        showToast('Draft wiped from memory.');
      }
    });
  }

  // Form Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isValid = validateForm(form);
    if (!isValid) {
      showToast('⚠️ Please correct flagged fields before transmitting.');
      const firstError = form.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Submit Loading State
    if (submitBtn) {
      submitBtn.classList.add('is-transmitting');
      const submitText = submitBtn.querySelector('.btn-submit-text');
      if (submitText) submitText.textContent = 'TRANSMITTING TO MULTIVERSE VAULT...';
    }

    // Collect all cadet data
    const payload = collectFormData(form);

    // Asynchronously transmit to Google Sheets
    await transmitToGoogleSheet(payload);

    // Render official clearance pass
    completeSubmission(form, payload);
  });

  // Print Pass Handler
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function validateForm(form) {
  let valid = true;

  // Full Name
  const fullName = form.querySelector('#fullName');
  if (!fullName || fullName.value.trim().length < 3) {
    markError(fullName);
    valid = false;
  }

  // Bennett Email
  const email = form.querySelector('#bennettEmail');
  const bennettRegex = /^[a-zA-Z0-9._%+-]+@bennett\.edu\.in$/i;
  if (!email || !bennettRegex.test(email.value.trim())) {
    markError(email);
    valid = false;
  }

  // Enrollment Number
  const enrollment = form.querySelector('#enrollmentNumber');
  if (!enrollment || enrollment.value.trim().length < 6) {
    markError(enrollment);
    valid = false;
  }

  // Phone
  const phone = form.querySelector('#phoneNumber');
  const cleanPhone = phone ? phone.value.replace(/[^0-9]/g, '') : '';
  if (!phone || cleanPhone.length < 10) {
    markError(phone);
    valid = false;
  }

  // Academic Year
  const year = form.querySelector('#studyYear');
  if (!year || !year.value) {
    markError(year);
    valid = false;
  }

  // Branch
  const branch = form.querySelector('#branch');
  if (!branch || !branch.value) {
    markError(branch);
    valid = false;
  }

  // Primary Domain
  const domain = form.querySelector('#primaryDomain');
  if (!domain || !domain.value) {
    markError(domain);
    valid = false;
  }

  // Directive Statement (min 50 chars)
  const statement = form.querySelector('#directiveStatement');
  if (!statement || statement.value.trim().length < 50) {
    markError(statement);
    valid = false;
  }

  // Attendance Agreement
  const agreeAttendance = form.querySelector('#agreeAttendance');
  if (!agreeAttendance || !agreeAttendance.checked) {
    const parent = agreeAttendance.closest('.agreement-checkbox-label');
    if (parent) {
      const err = document.getElementById('error-agreeAttendance');
      if (err) err.style.display = 'block';
    }
    valid = false;
  } else {
    const err = document.getElementById('error-agreeAttendance');
    if (err) err.style.display = 'none';
  }

  // Code of Conduct Agreement
  const agreeIntegrity = form.querySelector('#agreeIntegrity');
  if (!agreeIntegrity || !agreeIntegrity.checked) {
    const err = document.getElementById('error-agreeIntegrity');
    if (err) err.style.display = 'block';
    valid = false;
  } else {
    const err = document.getElementById('error-agreeIntegrity');
    if (err) err.style.display = 'none';
  }

  return valid;
}

function markError(el) {
  if (!el) return;
  const group = el.closest('.form-group');
  if (group) group.classList.add('has-error');
}

/* ==========================================================================
   5. DATA COLLECTION, GOOGLE SHEETS TRANSMISSION & CLEARANCE PASS
   ========================================================================== */
function collectFormData(form) {
  const realmInfo = REALM_THEMES[currentRealm] || REALM_THEMES.doom;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const txid = `GFG-BU-DOOMS-${randomSuffix}`;

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateFormatted = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} IST`;

  return {
    transmissionId: txid,
    timestamp: dateFormatted,
    realm: currentRealm.toUpperCase(),
    sector: realmInfo.sector,
    fullName: form.querySelector('#fullName')?.value.trim() || '',
    bennettEmail: form.querySelector('#bennettEmail')?.value.trim() || '',
    enrollmentNumber: form.querySelector('#enrollmentNumber')?.value.trim().toUpperCase() || '',
    phoneNumber: form.querySelector('#phoneNumber')?.value.trim() || '',
    studyYear: form.querySelector('#studyYear')?.value || '',
    branch: form.querySelector('#branch')?.value || '',
    primaryDomain: form.querySelector('#primaryDomain')?.value || '',
    secondaryDomain: form.querySelector('#secondaryDomain')?.value || '',
    proficiencyLevel: form.querySelector('input[name="proficiencyLevel"]:checked')?.value || 'Intermediate',
    githubUrl: form.querySelector('#githubUrl')?.value.trim() || '',
    portfolioUrl: form.querySelector('#portfolioUrl')?.value.trim() || '',
    resumeUrl: form.querySelector('#resumeUrl')?.value.trim() || '',
    directiveStatement: form.querySelector('#directiveStatement')?.value.trim() || '',
    greatestProject: form.querySelector('#greatestProject')?.value.trim() || '',
  };
}

async function transmitToGoogleSheet(payload) {
  if (!GOOGLE_SHEET_WEBHOOK_URL || GOOGLE_SHEET_WEBHOOK_URL.trim() === '') {
    console.info('Google Sheet Webhook URL not configured. Preview simulation active.');
    return { success: true, simulated: true };
  }

  try {
    // Send as JSON text/plain payload to bypass CORS preflight redirects from Google Apps Script
    await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    return { success: true };
  } catch (err) {
    console.error('Google Sheet transmission notice:', err);
    return { success: false, error: err };
  }
}

function completeSubmission(form, payload) {
  const formContainer = document.getElementById('form-container');
  const passContainer = document.getElementById('clearance-pass-view');

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const barcodeStr = `${randomSuffix} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;

  // Populate Pass UI
  document.getElementById('pass-val-name').textContent = payload.fullName;
  document.getElementById('pass-val-enrollment').textContent = payload.enrollmentNumber;
  document.getElementById('pass-val-sector').textContent = payload.sector;
  document.getElementById('pass-val-domain').textContent = payload.primaryDomain.toUpperCase();
  document.getElementById('pass-val-academic').textContent = `${payload.studyYear} • ${payload.branch}`;
  document.getElementById('pass-val-txid').textContent = payload.transmissionId;
  document.getElementById('pass-barcode-text').textContent = barcodeStr;
  document.getElementById('pass-stamp-time').textContent = `TIMESTAMP: ${payload.timestamp} // VERIFIED`;

  // Wipe draft from localStorage
  localStorage.removeItem(DRAFT_STORAGE_KEY);

  // Transition UI
  if (formContainer && passContainer) {
    formContainer.classList.add('is-hidden');
    passContainer.classList.remove('is-hidden');
    passContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showToast('✓ Transmission verified! Your clearance pass has been generated.');
}

/* ==========================================================================
   6. DRAFT SAVE & RESTORE
   ========================================================================== */
function saveDraft(form) {
  const data = {
    realm: currentRealm,
    fullName: form.querySelector('#fullName')?.value || '',
    bennettEmail: form.querySelector('#bennettEmail')?.value || '',
    enrollmentNumber: form.querySelector('#enrollmentNumber')?.value || '',
    phoneNumber: form.querySelector('#phoneNumber')?.value || '',
    studyYear: form.querySelector('#studyYear')?.value || '',
    branch: form.querySelector('#branch')?.value || '',
    primaryDomain: form.querySelector('#primaryDomain')?.value || '',
    secondaryDomain: form.querySelector('#secondaryDomain')?.value || '',
    githubUrl: form.querySelector('#githubUrl')?.value || '',
    portfolioUrl: form.querySelector('#portfolioUrl')?.value || '',
    resumeUrl: form.querySelector('#resumeUrl')?.value || '',
    directiveStatement: form.querySelector('#directiveStatement')?.value || '',
    greatestProject: form.querySelector('#greatestProject')?.value || '',
  };

  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
}

function restoreDraft(form) {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return;

    const data = JSON.parse(raw);
    if (!data) return;

    // Restore text inputs
    for (const [key, val] of Object.entries(data)) {
      if (key === 'realm') {
        const realmCard = document.querySelector(`.realm-card[data-realm="${val}"]`);
        if (realmCard) realmCard.click();
      } else {
        const field = form.querySelector(`#${key}`);
        if (field && val) {
          field.value = val;
        }
      }
    }

    const draftMsg = document.getElementById('draft-status-msg');
    if (draftMsg) {
      draftMsg.textContent = '● Draft restored';
      setTimeout(() => { draftMsg.textContent = ''; }, 4000);
    }
  } catch (err) {
    console.warn('Could not parse saved draft:', err);
  }
}

/* ==========================================================================
   7. TOAST NOTIFICATIONS
   ========================================================================== */
let toastTimer = null;
function showToast(msg, duration = 3500) {
  const toast = document.getElementById('reg-toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('is-visible');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, duration);
}
