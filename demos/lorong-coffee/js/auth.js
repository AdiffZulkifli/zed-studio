/* ================================================================
   LORONG COFFEE — Auth Layer v2
   Handles admin auth (custom DB table) + customer auth (Supabase Auth)
   Load this AFTER supabase-client.js and data.js
   ================================================================ */

const LC_ADMIN_SESSION_KEY = 'lorong_admin_session';
const LC_CUSTOMER_SESSION_KEY = 'lorong_customer_session';
const LC_SALT = 'lorong_salt_2024';

// ── PASSWORD HASHING (SHA-256 via Web Crypto API) ───────────────
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + LC_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── ADMIN AUTH ──────────────────────────────────────────────────
async function adminSignIn(email, password) {
  const hash = await hashPassword(password);
  const { data, error } = await window.supabaseClient
    .from('lc_admin_accounts')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .eq('password_hash', hash)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return { success: false, error: 'Invalid email or password.' };

  const session = {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    role: data.role,
    branchId: data.branch_id,
    loggedInAt: new Date().toISOString()
  };
  sessionStorage.setItem(LC_ADMIN_SESSION_KEY, JSON.stringify(session));

  await window.supabaseClient
    .from('lc_admin_accounts')
    .update({ last_login: new Date().toISOString() })
    .eq('id', data.id);

  return { success: true, session };
}

function adminSignOut() {
  sessionStorage.removeItem(LC_ADMIN_SESSION_KEY);
}

// These override the legacy functions defined in data.js
function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(LC_ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function requireAdminAuth(redirectTo = 'login.html') {
  const session = getAdminSession();
  if (!session) { window.location.href = redirectTo; return null; }
  return session;
}

function requireMainAdmin(redirectTo = 'login.html') {
  const session = getAdminSession();
  if (!session) { window.location.href = redirectTo; return null; }
  if (session.role !== 'main_admin') {
    window.location.href = 'branch/dashboard.html';
    return null;
  }
  return session;
}

function requireBranchAdmin(redirectTo = '../login.html') {
  const session = getAdminSession();
  if (!session) { window.location.href = redirectTo; return null; }
  return session;
}

// Legacy alias
function adminLogout() { adminSignOut(); }

// ── CUSTOMER AUTH (Supabase Auth) ───────────────────────────────
async function customerSignUp(name, phone, email, password) {
  // Check for duplicate phone
  const { data: existingPhone } = await window.supabaseClient
    .from('lc_customer_profiles')
    .select('id')
    .eq('phone', phone.trim())
    .maybeSingle();

  if (existingPhone) return { success: false, error: 'This phone number is already registered.' };

  // Check for duplicate email in profiles (Supabase auth won't tell us clearly)
  const { data: existingEmail } = await window.supabaseClient
    .from('lc_customer_profiles')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (existingEmail) return { success: false, error: 'This email address is already registered. Try signing in instead.' };

  const { data, error } = await window.supabaseClient.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: { data: { name, phone } }
  });

  if (error) {
    // Friendly error messages
    if (error.message?.toLowerCase().includes('already registered') ||
        error.message?.toLowerCase().includes('already in use') ||
        error.message?.toLowerCase().includes('user already')) {
      return { success: false, error: 'This email is already registered. Try signing in instead.' };
    }
    return { success: false, error: error.message };
  }
  if (!data.user) {
    return { success: false, error: 'Confirmation email sent — but profile setup requires email confirmations to be disabled in Supabase. Please ask the admin to turn off "Confirm email" in Authentication settings, then try again.' };
  }

  const { error: profileError } = await window.supabaseClient
    .from('lc_customer_profiles')
    .insert({ id: data.user.id, phone: phone.trim(), name: name.trim(), email: email.toLowerCase().trim() });

  if (profileError) {
    await window.supabaseClient.auth.signOut();
    const msg = profileError.message?.includes('does not exist')
      ? 'Database tables not set up yet. Please ask the admin to run the schema setup.'
      : profileError.message || 'Failed to save profile.';
    return { success: false, error: msg };
  }

  await window.supabaseClient
    .from('lc_rewards')
    .insert({ customer_id: data.user.id, purchase_count: 0, is_redeemable: false, total_redeemed: 0 });

  return { success: true, userId: data.user.id, needsConfirmation: !data.user.email_confirmed_at };
}

async function customerSignIn(email, password) {
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password
  });
  if (error) {
    if (error.message?.toLowerCase().includes('email not confirmed')) {
      return { success: false, error: 'Please confirm your email address first. Check your inbox for a verification link.' };
    }
    return { success: false, error: 'Invalid email or password.' };
  }

  const { data: profile } = await window.supabaseClient
    .from('lc_customer_profiles')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!profile) {
    await window.supabaseClient.auth.signOut();
    return { success: false, error: 'No customer account found for this email.' };
  }

  const session = { userId: data.user.id, email: data.user.email, name: profile.name, phone: profile.phone };
  sessionStorage.setItem(LC_CUSTOMER_SESSION_KEY, JSON.stringify(session));
  return { success: true, session };
}

async function customerSignOut() {
  sessionStorage.removeItem(LC_CUSTOMER_SESSION_KEY);
  await window.supabaseClient.auth.signOut();
}

function getCustomerSession() {
  try {
    const raw = sessionStorage.getItem(LC_CUSTOMER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function requireCustomerAuth(redirectTo = 'login.html') {
  const session = getCustomerSession();
  if (!session) { window.location.href = redirectTo; return null; }
  return session;
}
