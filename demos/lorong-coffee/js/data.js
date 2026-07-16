/* ================================================================
   LORONG COFFEE — Data Layer (Supabase Version)
   ----------------------------------------------------------------
   All data operations go through this file.
   Now uses Supabase asynchronously.
   ================================================================ */

// ── INIT ───────────────────────────────────────────────────────
async function initData() {
  // No-op for Supabase since tables should be seeded via SQL
}

async function resetData() {
  alert("Reset data not supported in Supabase mode.");
}

function _genId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── MENU ───────────────────────────────────────────────────────
async function getMenu(filters = {}) {
  let query = window.supabaseClient.from('lc_menu').select('*');
  
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }
  if (filters.available !== undefined) {
    query = query.eq('available', filters.available);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching menu:', error);
    return [];
  }
  // Sort by createdAt ascending to preserve order
  return data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

async function getMenuById(id) {
  const { data, error } = await window.supabaseClient.from('lc_menu').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

async function addMenuItem(data) {
  const item = {
    id: _genId('menu'),
    available: true,
    featured: false,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data
  };
  const { data: result, error } = await window.supabaseClient.from('lc_menu').insert(item).select().single();
  if (error) throw error;
  return result;
}

async function updateMenuItem(id, data) {
  const { data: result, error } = await window.supabaseClient.from('lc_menu')
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) return null;
  return result;
}

async function deleteMenuItem(id) {
  const { error } = await window.supabaseClient.from('lc_menu').delete().eq('id', id);
  return !error;
}

// ── STORES ─────────────────────────────────────────────────────
async function getStores(filters = {}) {
  let query = window.supabaseClient.from('lc_stores').select('*');
  if (filters.comingSoon !== undefined) {
    query = query.eq('comingSoon', filters.comingSoon);
  }
  const { data, error } = await query;
  if (error) return [];
  return data.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
}

async function getStoreById(id) {
  const { data, error } = await window.supabaseClient.from('lc_stores').select('*').eq('id', id).single();
  return error ? null : data;
}

async function addStore(data) {
  const store = {
    id: _genId('store'),
    isOpen: true,
    comingSoon: false,
    updatedAt: new Date().toISOString(),
    ...data
  };
  const { data: result, error } = await window.supabaseClient.from('lc_stores').insert(store).select().single();
  if (error) throw error;
  return result;
}

async function updateStore(id, data) {
  const { data: result, error } = await window.supabaseClient.from('lc_stores')
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return error ? null : result;
}

async function deleteStore(id) {
  const { error } = await window.supabaseClient.from('lc_stores').delete().eq('id', id);
  return !error;
}

// ── PROMOTIONS ─────────────────────────────────────────────────
async function getPromotions(filters = {}) {
  let query = window.supabaseClient.from('lc_promotions').select('*');
  if (filters.active !== undefined) {
    query = query.eq('active', filters.active);
  }
  const { data, error } = await query;
  return error ? [] : data;
}

async function updatePromotion(id, data) {
  const { data: result, error } = await window.supabaseClient.from('lc_promotions')
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return error ? null : result;
}

// ── SETTINGS ───────────────────────────────────────────────────
async function getSettings() {
  const { data, error } = await window.supabaseClient.from('lc_settings').select('*').eq('id', 'global').single();
  return error ? {
    heroTitle: 'Coffee Worth Every Sip',
    heroBadge: '☕ Now Open in Bintulu, Sarawak',
    heroSubtitle: "Handcrafted specialty coffee that doesn't break the bank."
  } : data;
}

async function updateSettings(data) {
  const { data: result, error } = await window.supabaseClient.from('lc_settings')
    .update({ ...data, lastUpdated: new Date().toISOString() })
    .eq('id', 'global')
    .select()
    .single();
  return error ? null : result;
}

// ── ANALYTICS ──────────────────────────────────────────────────
async function trackView(itemId) {
  const { data: current } = await window.supabaseClient.from('lc_analytics').select('*').eq('id', 'global').single();
  if (current) {
    const views = current.menuViews || {};
    views[itemId] = (views[itemId] || 0) + 1;
    await window.supabaseClient.from('lc_analytics').update({ menuViews: views }).eq('id', 'global');
  }
  
  const { data: menuData } = await window.supabaseClient.from('lc_menu').select('views').eq('id', itemId).single();
  if (menuData) {
    await window.supabaseClient.from('lc_menu').update({ views: menuData.views + 1 }).eq('id', itemId);
  }
}

async function getAnalytics() {
  const { data, error } = await window.supabaseClient.from('lc_analytics').select('*').eq('id', 'global').single();
  return error ? { menuViews: {}, lastUpdated: null } : data;
}

async function getTopViewedItems(n = 5) {
  const { data, error } = await window.supabaseClient.from('lc_menu')
    .select('*')
    .order('views', { ascending: false })
    .limit(n);
  return error ? [] : data;
}

// ── EXPORT / IMPORT (Migration helpers) ────────────────────────
function exportData() {
  alert("Export via Supabase dashboard.");
  return "";
}

function importData(jsonString) {
  alert("Import via Supabase dashboard.");
}

// ── ADMIN ACCOUNTS ─────────────────────────────────────────────
async function getAdminAccounts() {
  const { data, error } = await window.supabaseClient
    .from('lc_admin_accounts')
    .select('id, email, role, display_name, branch_id, is_active, created_at, last_login')
    .order('created_at');
  return error ? [] : data;
}

async function createAdminAccount(email, password, role, displayName, branchId) {
  const hash = await hashPassword(password);
  const { data, error } = await window.supabaseClient
    .from('lc_admin_accounts')
    .insert({ email: email.toLowerCase().trim(), password_hash: hash, role, display_name: displayName, branch_id: branchId || null, is_active: true })
    .select('id, email, role, display_name')
    .single();
  if (error) throw error;
  return data;
}

async function toggleAdminActive(id, isActive) {
  const { error } = await window.supabaseClient.from('lc_admin_accounts').update({ is_active: isActive }).eq('id', id);
  return !error;
}

async function deleteAdminAccount(id) {
  const { error } = await window.supabaseClient.from('lc_admin_accounts').delete().eq('id', id);
  return !error;
}

async function resetAdminPassword(id, newPassword) {
  const hash = await hashPassword(newPassword);
  const { error } = await window.supabaseClient.from('lc_admin_accounts').update({ password_hash: hash }).eq('id', id);
  return !error;
}

// ── BRANCH MENU STATUS ─────────────────────────────────────────
async function getBranchMenuItems(branchId) {
  const [{ data: menuItems }, { data: overrides }] = await Promise.all([
    window.supabaseClient.from('lc_menu').select('*').eq('available', true).order('createdAt'),
    window.supabaseClient.from('lc_branch_menu').select('*').eq('branch_id', branchId)
  ]);
  const overrideMap = {};
  (overrides || []).forEach(o => { overrideMap[o.menu_item_id] = o.status; });
  return (menuItems || []).map(item => ({ ...item, branchStatus: overrideMap[item.id] || 'available' }));
}

async function setBranchMenuStatus(branchId, menuItemId, status) {
  const { error } = await window.supabaseClient
    .from('lc_branch_menu')
    .upsert({ branch_id: branchId, menu_item_id: menuItemId, status, updated_at: new Date().toISOString() }, { onConflict: 'branch_id,menu_item_id' });
  return !error;
}

// ── CUSTOMERS ──────────────────────────────────────────────────
async function lookupCustomerByPhone(phone) {
  const { data: profile, error } = await window.supabaseClient
    .from('lc_customer_profiles')
    .select('*')
    .eq('phone', phone.trim())
    .maybeSingle();
  if (error || !profile) return null;
  const { data: reward } = await window.supabaseClient.from('lc_rewards').select('*').eq('customer_id', profile.id).maybeSingle();
  return { ...profile, reward: reward || { purchase_count: 0, is_redeemable: false, total_redeemed: 0 } };
}

async function getCustomerData(customerId) {
  const [{ data: profile }, { data: reward }] = await Promise.all([
    window.supabaseClient.from('lc_customer_profiles').select('*').eq('id', customerId).single(),
    window.supabaseClient.from('lc_rewards').select('*').eq('customer_id', customerId).single()
  ]);
  return { profile, reward };
}

async function getCustomerHistory(customerId, limit = 20) {
  const { data, error } = await window.supabaseClient
    .from('lc_purchase_records')
    .select('*, lc_menu(name, emoji, category), lc_stores(name)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return error ? [] : data;
}

// ── PURCHASES & REWARDS ────────────────────────────────────────
async function recordPurchase(customerId, branchId, menuItemId, adminId) {
  const { data: reward } = await window.supabaseClient.from('lc_rewards').select('*').eq('customer_id', customerId).maybeSingle();
  if (reward?.is_redeemable) {
    return { success: false, error: 'Customer has a reward to redeem first before adding more purchases.' };
  }
  const { error: purchaseError } = await window.supabaseClient
    .from('lc_purchase_records')
    .insert({ customer_id: customerId, branch_id: branchId, menu_item_id: menuItemId, is_redemption: false, recorded_by: adminId });
  if (purchaseError) return { success: false, error: purchaseError.message };

  const currentCount = reward?.purchase_count || 0;
  const newCount = currentCount + 1;
  const isRedeemable = newCount >= 10;
  await window.supabaseClient.from('lc_rewards')
    .upsert({ customer_id: customerId, purchase_count: newCount, is_redeemable: isRedeemable, updated_at: new Date().toISOString() }, { onConflict: 'customer_id' });
  return { success: true, newCount, isRedeemable };
}

async function redeemReward(customerId, branchId, menuItemId, adminId) {
  const { data: reward } = await window.supabaseClient.from('lc_rewards').select('*').eq('customer_id', customerId).maybeSingle();
  if (!reward?.is_redeemable) return { success: false, error: 'No reward available for this customer.' };

  const { error: purchaseError } = await window.supabaseClient
    .from('lc_purchase_records')
    .insert({ customer_id: customerId, branch_id: branchId, menu_item_id: menuItemId, is_redemption: true, recorded_by: adminId });
  if (purchaseError) return { success: false, error: purchaseError.message };

  const { error } = await window.supabaseClient.from('lc_rewards')
    .update({ purchase_count: 0, is_redeemable: false, total_redeemed: (reward.total_redeemed || 0) + 1, last_redeemed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('customer_id', customerId);
  return error ? { success: false, error: error.message } : { success: true };
}

// ── ANALYTICS ─────────────────────────────────────────────────
async function getBranchPurchaseStats(branchId) {
  const { data, error } = await window.supabaseClient
    .from('lc_purchase_records')
    .select('menu_item_id, is_redemption, lc_menu(name, emoji, category)')
    .eq('branch_id', branchId)
    .eq('is_redemption', false);
  if (error) return [];
  const counts = {};
  (data || []).forEach(r => {
    const id = r.menu_item_id;
    if (!counts[id]) counts[id] = { count: 0, name: r.lc_menu?.name, emoji: r.lc_menu?.emoji, category: r.lc_menu?.category };
    counts[id].count++;
  });
  return Object.entries(counts).map(([id, v]) => ({ id, ...v })).sort((a, b) => b.count - a.count);
}

async function getGlobalPurchaseStats() {
  const { data, error } = await window.supabaseClient
    .from('lc_purchase_records')
    .select('menu_item_id, branch_id, is_redemption, lc_menu(name, emoji, category), lc_stores(name)')
    .eq('is_redemption', false);
  if (error) return { topItems: [], branchBreakdown: {}, totalPurchases: 0, totalCustomers: 0 };

  const globalCounts = {};
  const branchBreakdown = {};
  (data || []).forEach(r => {
    const itemId = r.menu_item_id;
    const bId = r.branch_id;
    if (!globalCounts[itemId]) globalCounts[itemId] = { count: 0, name: r.lc_menu?.name, emoji: r.lc_menu?.emoji, category: r.lc_menu?.category };
    globalCounts[itemId].count++;
    if (!branchBreakdown[bId]) branchBreakdown[bId] = { branchName: r.lc_stores?.name, items: {}, total: 0 };
    if (!branchBreakdown[bId].items[itemId]) branchBreakdown[bId].items[itemId] = { count: 0, name: r.lc_menu?.name, emoji: r.lc_menu?.emoji };
    branchBreakdown[bId].items[itemId].count++;
    branchBreakdown[bId].total++;
  });

  const topItems = Object.entries(globalCounts).map(([id, v]) => ({ id, ...v })).sort((a, b) => b.count - a.count).slice(0, 10);
  return { topItems, branchBreakdown, totalPurchases: data.length };
}

async function getBranchCustomerCount(branchId) {
  const { data } = await window.supabaseClient.from('lc_purchase_records').select('customer_id').eq('branch_id', branchId);
  const unique = new Set((data || []).map(r => r.customer_id));
  return unique.size;
}

async function getTotalRedemptions(branchId) {
  let query = window.supabaseClient.from('lc_purchase_records').select('id', { count: 'exact' }).eq('is_redemption', true);
  if (branchId) query = query.eq('branch_id', branchId);
  const { count } = await query;
  return count || 0;
}

async function getTotalCustomers() {
  const { count } = await window.supabaseClient.from('lc_customer_profiles').select('id', { count: 'exact' });
  return count || 0;
}

// ── FORMAT HELPERS ─────────────────────────────────────────────
function formatPrice(price) {
  return `RM ${price}`;
}

function formatDate(isoString) {
  if (!isoString) return 'Never';
  return new Date(isoString).toLocaleString('en-MY', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function formatRelativeTime(isoString) {
  if (!isoString) return 'Never';
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
