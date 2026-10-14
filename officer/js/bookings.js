/**
 * She Harvest - Booking Management Script
 * Path: officer/js/bookings.js
 * 
 * Handles booking filtering, search, view details modal, approval,
 * and mandatory reason modals for rejection & rescheduling.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingFilters();
  initBookingSearch();
  initBookingActions();
});

let currentActiveBookingRow = null;

/**
 * 1. Status Filter Buttons (All, Pending, Approved, In Progress, etc.)
 */
function initBookingFilters() {
  const filterBtns = document.querySelectorAll('.booking-filter-btn');
  const tableRows = document.querySelectorAll('#bookings-table-body tr');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-status').toLowerCase();

      tableRows.forEach(row => {
        const rowStatus = row.getAttribute('data-status').toLowerCase();
        if (filterValue === 'all' || rowStatus === filterValue) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 2. Search Field Filtering
 */
function initBookingSearch() {
  const searchInput = document.getElementById('booking-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll('#bookings-table-body tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(term) ? '' : 'none';
    });
  });
}

/**
 * 3. Booking Table Actions (View, Approve, Reject, Reschedule)
 */
function initBookingActions() {
  const tableBody = document.getElementById('bookings-table-body');
  if (!tableBody) return;

  // Delegate clicks on table body
  tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;

    currentActiveBookingRow = row;
    const bookingId = row.querySelector('.col-booking-id').textContent.trim();
    const farmer = row.querySelector('.col-farmer').textContent.trim();
    const machine = row.querySelector('.col-machine').textContent.trim();
    const date = row.querySelector('.col-date').textContent.trim();

    // View Details
    if (e.target.closest('.btn-view-booking')) {
      showViewDetailsModal(row);
    }

    // Approve
    if (e.target.closest('.btn-approve-booking')) {
      approveBooking(row, bookingId);
    }

    // Reject (Requires Reason)
    if (e.target.closest('.btn-reject-booking')) {
      showRejectReasonModal(bookingId, farmer);
    }

    // Reschedule (Requires Reason)
    if (e.target.closest('.btn-reschedule-booking')) {
      showRescheduleReasonModal(bookingId, farmer, date);
    }
  });

  // Handle Reason Form Submissions
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'reject-reason-form') {
      e.preventDefault();
      handleRejectSubmit();
    }

    if (e.target.id === 'reschedule-reason-form') {
      e.preventDefault();
      handleRescheduleSubmit();
    }
  });
}

function approveBooking(row, bookingId) {
  const statusCell = row.querySelector('.col-status');
  statusCell.innerHTML = `<span class="status-pill status-approved">Approved</span>`;
  row.setAttribute('data-status', 'approved');

  // Remove approve button once approved
  const approveBtn = row.querySelector('.btn-approve-booking');
  if (approveBtn) approveBtn.remove();

  if (window.showToast) {
    window.showToast(`Booking ${bookingId} approved. Harvester allocation confirmed.`, 'success');
  }
}

/**
 * View Details Modal
 */
function showViewDetailsModal(row) {
  const id = row.querySelector('.col-booking-id').textContent.trim();
  const farmer = row.querySelector('.col-farmer-name').textContent.trim();
  const farmerId = row.querySelector('.col-farmer-id').textContent.trim();
  const location = row.querySelector('.col-location').textContent.trim();
  const machine = row.querySelector('.col-machine').textContent.trim();
  const reqDate = row.querySelector('.col-date').textContent.trim();
  const deadline = row.querySelector('.col-deadline').textContent.trim();
  const score = row.querySelector('.col-score').textContent.trim();
  const status = row.querySelector('.col-status').textContent.trim();

  const modalHTML = `
    <div class="modal-overlay active" id="view-booking-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Booking Details: ${escapeHtml(id)}</h3>
          <button type="button" class="modal-close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          
          <div class="booking-detail-grid">
            <div class="booking-detail-item">
              <span class="booking-detail-label">Farmer Name & ID</span>
              <span class="booking-detail-val">${escapeHtml(farmer)} (${escapeHtml(farmerId)})</span>
            </div>
            <div class="booking-detail-item">
              <span class="booking-detail-label">Farm Location & Acreage</span>
              <span class="booking-detail-val">${escapeHtml(location)}</span>
            </div>
            <div class="booking-detail-item">
              <span class="booking-detail-label">Requested Machine</span>
              <span class="booking-detail-val">${escapeHtml(machine)}</span>
            </div>
            <div class="booking-detail-item">
              <span class="booking-detail-label">Current Status</span>
              <span class="booking-detail-val">${escapeHtml(status)}</span>
            </div>
            <div class="booking-detail-item">
              <span class="booking-detail-label">Requested Harvest Date</span>
              <span class="booking-detail-val">${escapeHtml(reqDate)}</span>
            </div>
            <div class="booking-detail-item">
              <span class="booking-detail-label">Crop Harvest Deadline</span>
              <span class="booking-detail-val" style="color: #dc2626;">${escapeHtml(deadline)}</span>
            </div>
          </div>

          <div class="fairness-protection-callout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <div>
              <strong>Fair Priority Index: ${escapeHtml(score)}/100</strong><br>
              Calculated dynamically based on crop maturity risk, waiting days, and protection against prior postponements. Land size is intentionally neutral.
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline btn-sm modal-close-btn">Close</button>
        </div>
      </div>
    </div>
  `;

  removeExistingModal('view-booking-modal');
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Rejection Reason Modal (Requirement: Do not silently reject)
 */
function showRejectReasonModal(bookingId, farmer) {
  const modalHTML = `
    <div class="modal-overlay active" id="reject-booking-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title" style="color: #dc2626; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            Reject Booking ${escapeHtml(bookingId)}
          </h3>
          <button type="button" class="modal-close-btn" aria-label="Close">&times;</button>
        </div>
        <form id="reject-reason-form">
          <div class="modal-body">
            <div class="action-reason-box reject">
              <strong>Mandatory Justification:</strong> To maintain fairness and protect women smallholders from arbitrary cancellations, every rejection requires an official reason logged to the Audit History.
            </div>

            <div class="form-group">
              <label class="form-label" for="reject-reason-category">Reason Category <span class="required-star">*</span></label>
              <select id="reject-reason-category" class="form-select" required>
                <option value="">Select official reason category...</option>
                <option value="Severe Machine Fleet Breakdown">Severe Machinery Breakdown - No Alternative Unit Available</option>
                <option value="Inaccessible Terrain / Road Blockage">Inaccessible Terrain / Flooded Access Road</option>
                <option value="Duplicate Farmer Request">Duplicate or Erroneous Booking by Farmer</option>
                <option value="Crop Unripe / Premature Window">Agronomist Inspection: Crop Not Ready for Harvest</option>
                <option value="Severe Weather Invalidation">Declared Severe Cyclone / Red Weather Alert</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="reject-reason-text">Officer Explanation Notes <span class="required-star">*</span></label>
              <textarea 
                id="reject-reason-text" 
                class="form-control" 
                placeholder="Provide specific notes and alternative recommendations for the farmer..." 
                required></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline btn-sm modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-sm" style="background: #dc2626; color: #ffffff;">Confirm Rejection & Log</button>
          </div>
        </form>
      </div>
    </div>
  `;

  removeExistingModal('reject-booking-modal');
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function handleRejectSubmit() {
  const category = document.getElementById('reject-reason-category').value;
  const notes = document.getElementById('reject-reason-text').value;

  if (!category || !notes.trim()) {
    alert('Please provide a mandatory rejection reason and detailed notes.');
    return;
  }

  if (currentActiveBookingRow) {
    const bookingId = currentActiveBookingRow.querySelector('.col-booking-id').textContent.trim();
    const statusCell = currentActiveBookingRow.querySelector('.col-status');
    statusCell.innerHTML = `<span class="status-pill status-rejected">Rejected</span>`;
    currentActiveBookingRow.setAttribute('data-status', 'rejected');

    removeExistingModal('reject-booking-modal');

    if (window.showToast) {
      window.showToast(`Booking ${bookingId} rejected. Reason logged to Audit Log: "${category}".`, 'error');
    }
  }
}

/**
 * Reschedule Reason Modal (Requirement: Do not silently reschedule)
 */
function showRescheduleReasonModal(bookingId, farmer, currentDate) {
  const modalHTML = `
    <div class="modal-overlay active" id="reschedule-booking-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title" style="color: #d97706; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Reschedule Booking ${escapeHtml(bookingId)}
          </h3>
          <button type="button" class="modal-close-btn" aria-label="Close">&times;</button>
        </div>
        <form id="reschedule-reason-form">
          <div class="modal-body">
            <div class="action-reason-box">
              <strong>Fairness Protocol:</strong> Rescheduling will automatically prioritize this farmer in subsequent runs so she is not repeatedly postponed.
            </div>

            <div class="booking-detail-grid" style="margin-bottom: 0.75rem;">
              <div>
                <span class="booking-detail-label">Farmer</span>
                <span class="booking-detail-val">${escapeHtml(farmer)}</span>
              </div>
              <div>
                <span class="booking-detail-label">Current Date</span>
                <span class="booking-detail-val">${escapeHtml(currentDate)}</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="new-reschedule-date">New Proposed Harvest Date <span class="required-star">*</span></label>
              <input type="date" id="new-reschedule-date" class="form-control" required value="2026-10-18">
            </div>

            <div class="form-group">
              <label class="form-label" for="reschedule-reason-category">Rescheduling Reason <span class="required-star">*</span></label>
              <select id="reschedule-reason-category" class="form-select" required>
                <option value="">Select official reason...</option>
                <option value="Temporary Rain Delay">Temporary Rain / Wet Soil Condition</option>
                <option value="Harvester Maintenance in Progress">Harvester Maintenance / Hydraulic Service in Progress</option>
                <option value="Farmer Requested Date Shift">Farmer Requested Mutual Date Shift</option>
                <option value="Route Optimization Coordination">Route Optimization with Adjoining Plots</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="reschedule-notes">Explanation Notes <span class="required-star">*</span></label>
              <textarea 
                id="reschedule-notes" 
                class="form-control" 
                placeholder="Explain the new schedule plan and agreement with farmer..." 
                required></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline btn-sm modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-sm btn-primary">Confirm Reschedule & Log</button>
          </div>
        </form>
      </div>
    </div>
  `;

  removeExistingModal('reschedule-booking-modal');
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function handleRescheduleSubmit() {
  const newDate = document.getElementById('new-reschedule-date').value;
  const reason = document.getElementById('reschedule-reason-category').value;

  if (!newDate || !reason) {
    alert('Please enter a new date and select a reason.');
    return;
  }

  if (currentActiveBookingRow) {
    const bookingId = currentActiveBookingRow.querySelector('.col-booking-id').textContent.trim();
    const dateCell = currentActiveBookingRow.querySelector('.col-date');
    const statusCell = currentActiveBookingRow.querySelector('.col-status');

    dateCell.textContent = newDate;
    statusCell.innerHTML = `<span class="status-pill status-pending" style="background:#fffbeb; color:#b45309; border-color:#fde68a;">Rescheduled</span>`;
    currentActiveBookingRow.setAttribute('data-status', 'rescheduled');

    removeExistingModal('reschedule-booking-modal');

    if (window.showToast) {
      window.showToast(`Booking ${bookingId} rescheduled to ${newDate}. Postponement tracked.`, 'warning');
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
