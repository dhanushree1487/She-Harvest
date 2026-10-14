/**
 * She Harvest - Officer Dashboard Interactions Script
 * Path: officer/js/dashboard.js
 * 
 * Handles dashboard sample actions: quick approval, reschedule trigger,
 * and quick modal previews for recent bookings.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardQuickActions();
});

function initDashboardQuickActions() {
  // Quick Approve Button Handlers
  document.querySelectorAll('.btn-quick-approve').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      const bookingId = row.querySelector('.booking-id-text').textContent.trim();
      const statusCell = row.querySelector('.status-cell');

      statusCell.innerHTML = `<span class="status-pill status-approved">Approved</span>`;
      btn.remove();

      if (window.showToast) {
        window.showToast(`Booking ${bookingId} approved and slot confirmed.`, 'success');
      }
    });
  });

  // Quick View Details Handler
  document.querySelectorAll('.btn-view-booking-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const bookingId = btn.getAttribute('data-id') || 'BK-2026-081';
      showBookingDetailsModal(bookingId);
    });
  });
}

function showBookingDetailsModal(bookingId) {
  const modalHTML = `
    <div class="modal-overlay active" id="booking-details-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Booking Snapshot: ${escapeHtml(bookingId)}</h3>
          <button type="button" class="modal-close-btn" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <span class="stat-label">Farmer</span>
              <p style="font-weight: 700; color: #133a27;">Smt. K. Ananya Devi</p>
              <p style="font-size: 0.8rem; color: #5e7367;">Smallholder (2.2 Acres)</p>
            </div>
            <div>
              <span class="stat-label">Location</span>
              <p style="font-weight: 700; color: #133a27;">Kumbakonam East</p>
              <p style="font-size: 0.8rem; color: #5e7367;">Thanjavur Delta Zone</p>
            </div>
            <div>
              <span class="stat-label">Machine Requested</span>
              <p style="font-weight: 700; color: #133a27;">Combine Harvester (75 HP)</p>
              <p style="font-size: 0.8rem; color: #5e7367;">Standard Paddy Cutter-Thresher</p>
            </div>
            <div>
              <span class="stat-label">Harvest Deadline</span>
              <p style="font-weight: 700; color: #dc2626;">In 2 Days (Pre-Rain Alert)</p>
              <p style="font-size: 0.8rem; color: #5e7367;">Paddy maturity: 95%</p>
            </div>
          </div>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 0.85rem; font-size: 0.85rem; color: #166534; line-height: 1.5; margin-bottom: 1rem;">
            <strong>Fair Queue Score: 94/100 (Critical Priority)</strong><br>
            Protected under Smallholder Fairness Rules. Higher priority given due to previous rain postponement and crop over-ripening risk.
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline btn-sm modal-close-btn">Close</button>
          <a href="modules/bookings.html" class="btn btn-primary btn-sm">Open Booking Management</a>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('booking-details-modal');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
