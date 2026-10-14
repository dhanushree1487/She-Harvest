/**
 * She Harvest - Officer Portal Shared Navigation & Shell Script
 * Path: officer/js/navigation.js
 * 
 * Manages responsive sidebar toggle, active link detection, topbar notifications,
 * search shortcut, modal dialog helpers, and global toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initNotificationDropdown();
  initSearchShortcut();
  initModalDismiss();
  highlightActiveNavLink();
});

/**
 * 1. Mobile & Tablet Responsive Sidebar Toggle
 */
function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.querySelector('.officer-sidebar');

  if (!toggleBtn || !sidebar) return;

  // Create mobile overlay backdrop if not exists
  let overlay = document.getElementById('sidebar-backdrop');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sidebar-backdrop';
    overlay.className = 'sidebar-backdrop-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(19, 58, 39, 0.45);
      backdrop-filter: blur(2px);
      z-index: 999;
      display: none;
      opacity: 0;
      transition: opacity 0.25s ease;
    `;
    document.body.appendChild(overlay);
  }

  function openSidebar() {
    sidebar.classList.add('mobile-open');
    overlay.style.display = 'block';
    setTimeout(() => { overlay.style.opacity = '1'; }, 10);
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar.classList.remove('mobile-open');
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.style.display = 'none'; }, 250);
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = sidebar.classList.contains('mobile-open');
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener('click', closeSidebar);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
      closeSidebar();
    }
  });
}

/**
 * 2. Active Sidebar Navigation Link Highlight
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
  const navLinks = document.querySelectorAll('.sidebar-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const targetFile = href.split('/').pop();

    if (targetFile === currentPath || (currentPath === '' && targetFile === 'dashboard.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * 3. Topbar Notification Dropdown
 */
function initNotificationDropdown() {
  const notifBtn = document.getElementById('topbar-notification-btn');
  const dropdown = document.getElementById('notification-dropdown');

  if (!notifBtn || !dropdown) return;

  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== notifBtn) {
      dropdown.classList.remove('show');
    }
  });

  // "Mark all as read" button
  const markReadBtn = document.getElementById('mark-all-read-btn');
  const badgeCount = document.querySelector('.notification-badge-count');
  if (markReadBtn && badgeCount) {
    markReadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      badgeCount.style.display = 'none';
      document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
      });
      showToast('All notifications marked as reviewed.', 'info');
    });
  }
}

/**
 * 4. Global Search Shortcut (Ctrl+K or Cmd+K)
 */
function initSearchShortcut() {
  const searchInput = document.getElementById('topbar-search-input');
  if (!searchInput) return;

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Dynamic quick-filter or feedback
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const dataTable = document.querySelector('.data-table tbody');
    if (!dataTable) return;

    const rows = dataTable.querySelectorAll('tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

/**
 * 5. Universal Modal Dismiss Logic
 */
function initModalDismiss() {
  document.addEventListener('click', (e) => {
    // If clicking a close button or backdrop
    if (e.target.matches('.modal-close-btn') || e.target.closest('.modal-close-btn')) {
      const modal = e.target.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    }

    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
      });
    }
  });
}

/**
 * 6. Global Toast Notification Helper
 * Usage: window.showToast("Message here", "success" | "warning" | "error" | "info")
 */
window.showToast = function(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-message">${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
};

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
