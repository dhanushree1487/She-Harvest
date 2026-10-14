/**
 * She Harvest - Alerts & Complaints Management Script
 * Path: officer/js/alerts-complaints.js
 * 
 * Handles alert filtering by severity & review status, view complaint
 * details modal, marking under review, and marking resolved with resolution note.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAlertFilters();
  initAlertSearch();
  initAlertActions();
});

let currentActiveAlertRow = null;

/**
 * 1. Severity & Status Filtering
 */
function initAlertFilters() {
  const statusFilterBtns = document.querySelectorAll('.alert-status-filter-btn');
  const severityFilter = document.getElementById('alert-severity-select');
  const rows = document.querySelectorAll('#alerts-table-body tr');

  function applyFilters() {
    const activeStatusBtn = document.querySelector('.alert-status-filter-btn.active');
    const selectedStatus = activeStatusBtn ? activeStatusBtn.getAttribute('data-status').toLowerCase() : 'all';
    const selectedSeverity = severityFilter ? severityFilter.value.toLowerCase() : 'all';

    rows.forEach(row => {
      const rowStatus = row.getAttribute('data-status').toLowerCase();
      const rowSeverity = row.getAttribute('data-severity').toLowerCase();

      const matchStatus = (selectedStatus === 'all' || rowStatus === selectedStatus);
      const matchSeverity = (selectedSeverity === 'all' || rowSeverity === selectedSeverity);

      row.style.display = (matchStatus && matchSeverity) ? '' : 'none';
    });
  }

  statusFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      statusFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  if (severityFilter) {
    severityFilter.addEventListener('change', applyFilters);
  }
}

/**
 * 2. Search Field
 */
function initAlertSearch() {
  const searchInput = document.getElementById('alerts-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll('#alerts-table-body tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(term) ? '' : 'none';
    });
  });
}

/**
 * 3. Alert Row Actions (View Details, Under Review, Resolve)
 */
function initAlertActions() {
  const tableBody = document.getElementById('alerts-table-body');
  if (!tableBody) return;

  tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;

    currentActiveAlertRow = row;
    const alertId = row.querySelector('.col-alert-id').textContent.trim();
    const category = row.querySelector('.col-alert-category').textContent.trim();
    const farmer = row.querySelector('.col-alert-farmer').textContent.trim();
    const desc = row.querySelector('.col-alert-desc').textContent.trim();

    // View Details Modal
    if (e.target.closest('.btn-view-alert-details')) {
      showAlertDetailsModal(row);
    }

    // Mark Under Review
    if (e.target.closest('.btn-mark-under-review')) {
      markAlertUnderReview(row, alertId);
    }

    // Mark Resolved
    if (e.target.closest('.btn-mark-resolved')) {
      showResolveAlertModal(alertId, category);
    }
  });

  // Handle Resolution Form
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'resolve-alert-form') {
      e.preventDefault();
      handleResolveSubmit();
    }
  });
}

function markAlertUnderReview(row, alertId) {
  const statusCell = row.querySelector('.col-alert-status');
  statusCell.innerHTML = `<span class="status-pill status-pending">Under Review</span>`;
  row.setAttribute('data-status', 'under-review');

  const reviewBtn = row.querySelector('.btn-mark-under-review');
  if (reviewBtn) reviewBtn.remove();

  if (window.showToast) {
    window.showToast(`Alert ${alertId} marked as Under Investigation.`, 'info');
  }
}

function showAlertDetailsModal(row) {
  const id = row.querySelector('.col-alert-id').textContent.trim();
  const category = row.querySelector('.col-alert-category').textContent.trim();
  const booking = row.querySelector('.col-alert-booking').textContent.trim();
  const farmer = row.querySelector('.col-alert-farmer').textContent.trim();
  const desc = row.querySelector('.col-alert-desc').textContent.trim();
  const date = row.querySelector('.col-alert-date').textContent.trim();
  const severity = row.querySelector('.col-alert-severity').textContent.trim();
  const status = row.querySelector('.col-alert-status').textContent.trim();

  const modalHTML = `
    <div class="modal-overlay active" id="alert-details-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Incident Report: ${escapeHtml(id)}</h3>
          <button type="button" class="modal-close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          
          <div class="booking-detail-grid" style="margin-bottom: 1rem;">
            <div>
              <span class="booking-detail-label">Category</span>
              <span class="booking-detail-val">${escapeHtml(category)}</span>
            </div>
            <div>
              <span class="booking-detail-label">Severity Level</span>
              <span class="booking-detail-val" style="color: #dc2626;">${escapeHtml(severity)}</span>
            </div>
            <div>
              <span class="booking-detail-label">Related Booking</span>
              <span class="booking-detail-val">${escapeHtml(booking)}</span>
            </div>
            <div>
              <span class="booking-detail-label">Farmer Identity</span>
              <span class="booking-detail-val">${escapeHtml(farmer)}</span>
            </div>
          </div>

          <div style="background-color: #f8faf6; border: 1px solid #dce6de; border-radius: 8px; padding: 0.9rem; margin-bottom: 1.25rem;">
            <span class="booking-detail-label">Incident Description</span>
            <p style="font-size: 0.9rem; color: #18281f; margin-top: 0.25rem; line-height: 1.5;">
              ${escapeHtml(desc)}
            </p>
          </div>

          <h4 style="font-size: 0.95rem; font-weight: 700; color: #133a27; margin-bottom: 0.75rem;">Investigation Timeline</h4>
          <div class="timeline-step">
            <div class="timeline-icon">1</div>
            <div class="timeline-body">
              <div class="timeline-title">Incident Flag Logged</div>
              <div class="timeline-time">${escapeHtml(date)}</div>
              <div class="timeline-desc">Automatic monitoring rule flagged potential scheduling bottleneck.</div>
            </div>
          </div>
          <div class="timeline-step">
            <div class="timeline-icon">2</div>
            <div class="timeline-body">
              <div class="timeline-title">Current Status: ${escapeHtml(status)}</div>
              <div class="timeline-time">Assigned to: Lakshmi Ramanathan (Agronomy Lead)</div>
              <div class="timeline-desc">Resolution pending machine reallocation or farmer compensation.</div>
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline btn-sm modal-close-btn">Close</button>
        </div>
      </div>
    </div>
  `;

  removeExistingModal('alert-details-modal');
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showResolveAlertModal(alertId, category) {
  const modalHTML = `
    <div class="modal-overlay active" id="resolve-alert-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title" style="color: #16a34a; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Resolve Complaint: ${escapeHtml(alertId)}
          </h3>
          <button type="button" class="modal-close-btn" aria-label="Close">&times;</button>
        </div>
        <form id="resolve-alert-form">
          <div class="modal-body">
            
            <p style="font-size: 0.88rem; color: #5e7367; margin-bottom: 1rem;">
              Marking <strong>${escapeHtml(alertId)}</strong> (${escapeHtml(category)}) as resolved will close this complaint and update the regional fairness monitoring indicators.
            </p>

            <div class="form-group">
              <label class="form-label" for="resolution-action-type">Resolution Action Taken <span class="required-star">*</span></label>
              <select id="resolution-action-type" class="form-select" required>
                <option value="">Select resolution type...</option>
                <option value="Machine Reassigned & Expedited">Reassigned Alternative Harvester with Priority Dispatch</option>
                <option value="Operator Replaced / Rebuked">Replaced Machine Operator & Enforced Punctuality Protocol</option>
                <option value="Fuel Surcharge Waived">Waived Fuel Surcharge Under Smallholder Assistance Scheme</option>
                <option value="Dispute Amicably Mediated">Farmer Complaint Amicably Mediated with Center Head</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="resolution-notes">Resolution Summary Notes <span class="required-star">*</span></label>
              <textarea 
                id="resolution-notes" 
                class="form-control" 
                placeholder="Detail the outcome agreed upon with the woman farmer..." 
                required></textarea>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline btn-sm modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-sm btn-primary">Mark as Resolved & Close</button>
          </div>
        </form>
      </div>
    </div>
  `;

  removeExistingModal('resolve-alert-modal');
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function handleResolveSubmit() {
  const type = document.getElementById('resolution-action-type').value;
  const notes = document.getElementById('resolution-notes').value;

  if (!type || !notes.trim()) {
    alert('Please enter resolution action details.');
    return;
  }

  if (currentActiveAlertRow) {
    const alertId = currentActiveAlertRow.querySelector('.col-alert-id').textContent.trim();
    const statusCell = currentActiveAlertRow.querySelector('.col-alert-status');
    statusCell.innerHTML = `<span class="status-pill status-completed">Resolved</span>`;
    currentActiveAlertRow.setAttribute('data-status', 'resolved');

    removeExistingModal('resolve-alert-modal');

    if (window.showToast) {
      window.showToast(`Alert ${alertId} resolved: "${type}". Recorded in Audit History.`, 'success');
    }
  }
}

function removeExistingModal(id) {
  const m = document.getElementById(id);
  if (m) m.remove();
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
