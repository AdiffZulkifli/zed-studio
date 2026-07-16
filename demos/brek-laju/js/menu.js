// Menu filter
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.menu-full-card').forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Add to cart toast
document.querySelectorAll('.mfc-add').forEach(btn => {
  btn.addEventListener('click', function() {
    const name = this.closest('.mfc-body').querySelector('h3').textContent;
    showToast(`✅ ${name} ditambah!`);
  });
});

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
    background: #1A0A00; color: #fff; padding: 14px 28px; border-radius: 50px;
    font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 0.95rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2); z-index: 9999;
    animation: toastIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  const style = document.createElement('style');
  style.textContent = `@keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`;
  document.head.appendChild(style);
  setTimeout(() => toast.remove(), 3000);
}
