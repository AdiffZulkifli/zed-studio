/* ============================================================
   MEDICMESIR — Admin Auth Guard
   Include this script in the <head> of every admin page
   (except login.html) to protect routes.
============================================================ */

(function() {
  const isLoginPage = window.location.pathname.endsWith('login.html');
  const token = sessionStorage.getItem('mm_admin_auth');

  if (!isLoginPage && !token) {
    // Not logged in, redirect to login page
    window.location.replace('login.html');
  } else if (isLoginPage && token) {
    // Already logged in, redirect to dashboard
    window.location.replace('dashboard.html');
  }

  // If we are on an admin page and logged in, make sure standard admin scripts are loaded
  if (!isLoginPage && token) {
    document.addEventListener('DOMContentLoaded', () => {
      // Setup logout button
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          sessionStorage.removeItem('mm_admin_auth');
          window.location.replace('login.html');
        });
      }

      // Mark active sidebar link
      const currentPath = window.location.pathname.split('/').pop();
      document.querySelectorAll('.admin-nav-link').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
          link.classList.add('active');
        }
      });
      
      // Setup toast container if not exists
      if (!document.getElementById('toast-container')) {
          const tc = document.createElement('div');
          tc.id = 'toast-container';
          tc.style.position = 'fixed';
          tc.style.bottom = '2rem';
          tc.style.right = '2rem';
          tc.style.zIndex = '9999';
          tc.style.display = 'flex';
          tc.style.flexDirection = 'column';
          tc.style.gap = '0.5rem';
          document.body.appendChild(tc);
      }
    });

    // Global toast function for admin
    window.showAdminToast = function(msg, type = 'success') {
      const tc = document.getElementById('toast-container');
      if (!tc) return;

      const t = document.createElement('div');
      t.className = `admin-toast admin-toast--${type}`;
      
      let icon = '✓';
      if (type === 'error') icon = '✕';
      if (type === 'info') icon = 'ℹ';

      t.innerHTML = `
        <div class="admin-toast-icon">${icon}</div>
        <div class="admin-toast-msg">${msg}</div>
      `;

      tc.appendChild(t);

      // trigger reflow
      void t.offsetWidth;
      t.classList.add('show');

      setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 300);
      }, 3000);
    };
  }
})();
