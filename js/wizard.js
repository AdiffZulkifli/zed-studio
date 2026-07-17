// ============================================================
// ZED STUDIO — Project Wizard (start.html)
// Data-driven lead capture: options below, copy in translations.js.
// Leads are stored in Supabase (zs_leads, insert-only) AND handed
// to WhatsApp so nothing gets lost.
// ============================================================

const ZS_SUPABASE_URL = 'https://dlzvfbdolcnxxeavuuan.supabase.co';
const ZS_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsenZmYmRvbGNueHhlYXZ1dWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTIzODksImV4cCI6MjA5MjU2ODM4OX0.OYLIsUxoyADwO13JUh2SSynUmZzfm9rjQFTrXdofpPA';
const ZS_WHATSAPP = '601163293004';

// ── Option definitions (value + emoji; labels live in translations.js) ──
const WIZ_INDUSTRIES = [
  { v: 'coffee', e: '☕' }, { v: 'restaurant', e: '🍔' }, { v: 'clinic', e: '🏥' },
  { v: 'barber', e: '💈' }, { v: 'gym', e: '🏋️' }, { v: 'homestay', e: '🏨' },
  { v: 'education', e: '🎓' }, { v: 'retail', e: '🛍️' }, { v: 'beauty', e: '💅' },
  { v: 'services', e: '🔧' }, { v: 'corporate', e: '🏢' }, { v: 'other', e: '✨' },
];
const WIZ_STAGES = [
  { v: 'starting', e: '🌱' }, { v: 'shop', e: '🏪' }, { v: 'chain', e: '📈' },
];
const WIZ_WEB = [
  { v: 'none', e: '🆕' }, { v: 'redesign', e: '♻️' },
];
const WIZ_FEATURES = [
  { v: 'booking', e: '📅' }, { v: 'rewards', e: '🎁' }, { v: 'menu', e: '📖' },
  { v: 'gallery', e: '🖼️' }, { v: 'ordering', e: '🛵' }, { v: 'accounts', e: '👤' },
  { v: 'admin', e: '🛠️' }, { v: 'bilingual', e: '🌐' },
];

// ── State ──
const state = {
  step: 0,
  industry: null, stage: null, web: null,
  features: [],
  packageHint: new URLSearchParams(location.search).get('package') || '',
};
const preIndustry = new URLSearchParams(location.search).get('industry');
if (preIndustry && WIZ_INDUSTRIES.some(i => i.v === preIndustry)) state.industry = preIndustry;

const STEPS = 6;
const $ = id => document.getElementById(id);
const dict = () => window.ZED_I18N[localStorage.getItem('zed_lang') || 'en'];

// ── Rendering ──
function renderOptions(containerId, options, keyPrefix, selectedTest, multi) {
  const box = $(containerId);
  box.innerHTML = '';
  options.forEach(o => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wiz-opt' + (selectedTest(o.v) ? ' selected' : '');
    btn.setAttribute('aria-pressed', selectedTest(o.v));
    const desc = dict()[`${keyPrefix}.${o.v}D`];
    btn.innerHTML = `<span class="wiz-opt__emoji">${o.e}</span><span class="wiz-opt__label">${dict()[`${keyPrefix}.${o.v}`] || o.v}</span>` +
      (desc ? `<span class="wiz-opt__desc">${desc}</span>` : '');
    btn.addEventListener('click', () => {
      if (multi) {
        const i = state.features.indexOf(o.v);
        i === -1 ? state.features.push(o.v) : state.features.splice(i, 1);
        renderAll();
      } else {
        if (containerId === 'optIndustry') state.industry = o.v;
        if (containerId === 'optStage') state.stage = o.v;
        if (containerId === 'optWeb') state.web = o.v;
        renderAll();
        // single-choice steps advance automatically — less clicking
        setTimeout(() => goto(state.step + 1), 180);
      }
    });
    box.appendChild(btn);
  });
}

function renderAll() {
  renderOptions('optIndustry', WIZ_INDUSTRIES, 'w.ind', v => state.industry === v, false);
  renderOptions('optStage', WIZ_STAGES, 'w.st', v => state.stage === v, false);
  renderOptions('optWeb', WIZ_WEB, 'w.web', v => state.web === v, false);
  renderOptions('optFeatures', WIZ_FEATURES, 'w.f', v => state.features.includes(v), true);
  renderProgress();
}

function renderProgress() {
  const p = $('wizProgress');
  p.innerHTML = '';
  for (let i = 0; i < STEPS - 1; i++) {
    const dot = document.createElement('span');
    dot.className = 'wiz__dot' + (i < state.step ? ' done' : i === state.step ? ' now' : '');
    p.appendChild(dot);
  }
}

// ── Navigation ──
function stepValid() {
  switch (state.step) {
    case 0: return !!state.industry;
    case 1: return !!state.stage;
    case 2: return !!state.web;
    case 3: return true; // features optional
    case 4: {
      const ok = $('fldName').value.trim().length > 1 &&
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($('fldEmail').value.trim()) &&
        $('fldPhone').value.replace(/\D/g, '').length >= 9;
      $('wizError').hidden = ok;
      return ok;
    }
    default: return true;
  }
}

function goto(n) {
  if (n > state.step && !stepValid()) return;
  state.step = Math.max(0, Math.min(STEPS - 1, n));
  document.querySelectorAll('.wiz__step').forEach(s => {
    s.hidden = Number(s.dataset.step) !== state.step;
  });
  $('wizBack').hidden = state.step === 0 || state.step === STEPS - 1;
  $('wizNext').hidden = state.step === STEPS - 1;
  $('wizNext').textContent = dict()[state.step === 4 ? 'w.submit' : 'w.next'];
  renderProgress();
  if (state.step === STEPS - 1) finish();
  window.scrollTo({ top: 0 });
}

$('wizNext').addEventListener('click', () => goto(state.step + 1));
$('wizBack').addEventListener('click', () => goto(state.step - 1));

// ── Recommendation ──
function recommendPackage() {
  const d = dict();
  const heavy = state.features.some(f => ['booking', 'rewards', 'accounts'].includes(f));
  if (heavy || state.stage === 'chain') return d['pricing.p3.name'] + ' — RM 3,990+';
  if (state.web === 'redesign') return d['w.pkg.redesign'] + ' — RM 1,490+';
  if (state.stage === 'starting') return d['pricing.p1.name'] + ' — RM 990';
  return d['pricing.p2.name'] + ' — RM 2,190';
}

// ── Finish: summary + store + WhatsApp handoff ──
function label(prefix, v) { return dict()[`${prefix}.${v}`] || v; }

function summaryLines() {
  return [
    [dict()['w.sumIndustry'], `${label('w.ind', state.industry)}`],
    [dict()['w.sumStage'], `${label('w.st', state.stage)}`],
    [dict()['w.sumWeb'], `${label('w.web', state.web)}`],
    [dict()['w.sumFeatures'], state.features.length ? state.features.map(f => label('w.f', f)).join(', ') : '—'],
  ];
}

function briefPrompt() {
  // Internal build brief for the founder (always English, Claude-Code-ready)
  const en = window.ZED_I18N.en;
  const L = v => en[v] || v;
  return [
    'New Zed Studio client brief:',
    `- Client: ${$('fldName').value.trim()} | ${$('fldEmail').value.trim()} | ${$('fldPhone').value.trim()}`,
    `- Industry: ${L('w.ind.' + state.industry)}`,
    `- Business stage: ${L('w.st.' + state.stage)}`,
    `- Current website: ${L('w.web.' + state.web)}`,
    `- Requested features: ${state.features.map(f => L('w.f.' + f)).join(', ') || 'none selected'}`,
    `- Package interest (from pricing page): ${state.packageHint || 'n/a'}`,
    `- Notes from client: ${$('fldDetails').value.trim() || 'none'}`,
    '',
    'Task: following the Zed Studio DEMO-PLAYBOOK and CLAUDE.md rules (bespoke identity,',
    'EN/BM i18n, mobile-first, WhatsApp CTAs, Supabase-backed admin if features need it),',
    'propose sitemap + design direction for this client, then build it.',
  ].join('\n');
}

function finish() {
  // Summary
  $('wizSummary').innerHTML = summaryLines()
    .map(([k, v]) => `<div class="wiz__sumrow"><span>${k}</span><strong>${v}</strong></div>`)
    .join('');
  $('wizPackage').textContent = recommendPackage();

  // WhatsApp handoff (what the founder receives)
  const msg = [
    `Hi Zed Studio! I'm ${$('fldName').value.trim()} — new project enquiry:`,
    ...summaryLines().map(([k, v]) => `${k}: ${v}`),
    `Recommended: ${recommendPackage()}`,
    $('fldDetails').value.trim() ? `About my business: ${$('fldDetails').value.trim()}` : '',
    `Email: ${$('fldEmail').value.trim()} | Phone: ${$('fldPhone').value.trim()}`,
  ].filter(Boolean).join('\n');
  $('wizWhatsApp').href = `https://wa.me/${ZS_WHATSAPP}?text=${encodeURIComponent(msg)}`;

  // Store the lead (fire once)
  if (finish.sent) return;
  finish.sent = true;
  fetch(`${ZS_SUPABASE_URL}/rest/v1/zs_leads`, {
    method: 'POST',
    headers: {
      'apikey': ZS_SUPABASE_KEY,
      'Authorization': 'Bearer ' + ZS_SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      name: $('fldName').value.trim(),
      email: $('fldEmail').value.trim(),
      phone: $('fldPhone').value.trim(),
      industry: state.industry,
      business_stage: state.stage,
      current_web: state.web,
      features: state.features,
      details: $('fldDetails').value.trim(),
      package_hint: state.packageHint,
      recommended_package: recommendPackage(),
      lang: localStorage.getItem('zed_lang') || 'en',
      brief_prompt: briefPrompt(),
    }),
  }).then(r => { if (r.ok) $('wizSaved').hidden = false; })
    .catch(() => { /* WhatsApp handoff still works */ });
}

// ── Language switch re-renders options and summary ──
document.addEventListener('zed:lang', () => {
  renderAll();
  $('wizNext').textContent = dict()[state.step === 4 ? 'w.submit' : 'w.next'];
  if (state.step === STEPS - 1) finish(); // re-renders summary; the fetch is guarded by finish.sent
});

renderAll();
goto(state.industry ? 1 : 0); // skip step 1 when arriving from a demo ribbon
