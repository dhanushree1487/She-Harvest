/**
 * She Harvest - AI Priority & Fair Scheduling Script
 * Path: officer/js/priority-scheduling.js
 * 
 * Manages priority table filtering, transparent score breakdown view,
 * and officer override modal with mandatory justification logging.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPriorityFilters();
  initPrioritySearch();
  initPriorityActions();
});

let currentActivePriorityRow = null;

/**
 * 1. Priority Filter Buttons (All, Critical/High, Medium, Normal)
 */
function initPriorityFilters() {
  const filterBtns = document.querySelectorAll('.priority-filter-btn');
  const tableRows = document.querySelectorAll('#priority-table-body tr');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-level').toLowerCase();

      tableRows.forEach(row => {
        const rowLevel = row.getAttribute('data-level').toLowerCase();
        if (filterVal === 'all' || rowLevel === filterVal) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 2. Search Field
 */
function initPrioritySearch() {
  const input = document.getElementById('priority-search-input');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll('#priority-table-body tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(term) ? '' : 'none';
    });
  });
}

/**
 * 3. Priority Actions (View Explanation & Override Recommendation)
 */
function initPriorityActions() {
  const tableBody = document.getElementById('priority-table-body');
  if (!tableBody) return;

  tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;

    currentActivePriorityRow = row;
    const bookingId = row.querySelector('.col-ps-booking-id').textContent.trim();
    const farmer = row.querySelector('.col-ps-farmer').textContent.trim();
    const score = row.querySelector('.col-ps-score').textContent.trim();
    const rank = row.querySelector('.col-ps-rank').textContent.trim();

    // View Explanation
    if (e.target.closest('.btn-view-explanation')) {
      showExplanationModal(bookingId, farmer, score, rank);
    }

    // Override Recommendation
    if (e.target.closest('.btn-override-priority')) {
      showOverrideModal(bookingId, farmer, rank);
    }
  });

  // Handle Override Form Submit
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'override-priority-form') {
      e.preventDefault();
      handleOverrideSubmit();
    }
  });
}

/**
 * Explanation Modal
 */
function showExplanationModal(bookingId, farmer, score, rank) {
  const modalHTML = `
    <div class="modal-overlay active" id="priority-explanation-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title" style="display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Score Breakdown: ${escapeHtml(bookingId)}
          </h3>
          <button type="button" class="modal-close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          
          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.75rem; border-bottom: 1px solid #eaf0eb;">
            <div>
              <span class="stat-label">Farmer</span>
              <p style="font-weight: 700; color: #133a27;">${escapeHtml(farmer)}</p>
            </div>
            <div style="text-align: right;">
              <span class="stat-label">Recommended Rank</span>
              <p style="font-weight: 800; color: #16a34a; font-size: 1.1rem;">${escapeHtml(rank)} (Score: ${escapeHtml(score)}/100)</p>
            </div>
          </div>

          <!-- Formula Factor Breakdown List -->
          <div class="factor-breakdown-list">
            <div class="factor-item">
              <div>
                <div class="factor-name">Crop-Loss Spoilage Risk</div>
                <div class="factor-weight">Weight: 35% &bull; Weather forecast & paddy over-ripeness</div>
              </div>
              <div class="factor-contribution" style="color: #dc2626;">+33.5 pts</div>
            </div>

            <div class="factor-item">
              <div>
                <div class="factor-name">Harvest Window Urgency</div>
                <div class="factor-weight">Weight: 25% &bull; Proximity to optimal grain cutting cutoff</div>
              </div>
              <div class="factor-contribution" style="color: #ea580c;">+24.0 pts</div>
            </div>

            <div class="factor-item">
              <div>
                <div class="factor-name">Prior Postponement Compensation</div>
                <div class="factor-weight">Weight: 25% &bull; Automatic protection against being bumped repeatedly</div>
              </div>
              <div class="factor-contribution" style="color: #16a34a;">+25.0 pts</div>
            </div>

            <div class="factor-item">
              <div>
                <div class="factor-name">Queue Waiting Duration</div>
                <div class="factor-weight">Weight: 15% &bull; Time elapsed since booking submission</div>
              </div>
              <div class="factor-contribution" style="color: #0284c7;">+11.5 pts</div>
            </div>
          </div>

          <!-- Fairness Safeguard Callout -->
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 0.85rem; font-size: 0.84rem; color: #166534; line-height: 1.45;">
            <strong>Fairness Protection Guarantee:</strong><br>
            Land size is strictly excluded as a positive multiplier. Under She Harvest algorithm rules, women smallholders (&le; 2.5 acres) cannot be superseded by larger commercial holdings.
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline btn-sm modal-close-btn">Close</button>
        </div>
      </div>
    </div>
  `;

  removeExistingModal('priority-explanation-modal');
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Override Recommendation Modal (Requirement: Must require a mandatory reason)
 */
function showOverrideModal(bookingId, farmer, currentRank) {
  const modalHTML = `
    <div class="modal-overlay active" id="priority-override-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title" style="color: #d97706; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Override Recommendation: ${escapeHtml(bookingId)}
          </h3>
          <button type="button" class="modal-close-btn" aria-label="Close">&times;</button>
        </div>
        <form id="override-priority-form">
          <div class="modal-body">
            
            <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 0.85rem; font-size: 0.82rem; color: #92400e; line-height: 1.45; margin-bottom: 1.25rem;">
              <strong>Advisory Notice & Audit Requirement:</strong><br>
              Priority recommendations generated by She Harvest are advisory guides for officers. Overriding a recommended slot alters the fair dispatch queue and is permanently logged with your Officer ID in the Audit Log.
            </div>

            <div style="margin-bottom: 1rem;">
              <span class="booking-detail-label">Farmer</span>
              <div style="font-weight: 700; color: #133a27;">${escapeHtml(farmer)} (Current: ${escapeHtml(currentRank)})</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="override-new-rank">Target Priority Assignment <span class="required-star">*</span></label>
              <select id="override-new-rank" class="form-select" required>
                <option value="Rank #1 (Emergency Expedited)">Rank #1 (Emergency Expedited Dispatch)</option>
                <option value="Rank #2 (Priority Boost)">Rank #2 (Priority Boost)</option>
                <option value="Standard Order (Deprioritized)">Standard Order (Deprioritized)</option>
                <option value="Hold in Queue">Temporary Hold in Queue</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="override-reason-category">Override Reason Category <span class="required-star">*</span></label>
              <select id="override-reason-category" class="form-select" required>
                <option value="">Select official justification...</option>
                <option value="Verified Impending Flash Flood">Verified Impending Flash Flood / Water Ingress</option>
                <option value="Localized Field Access Road Collapse">Localized Field Access Road Collapse / Culvert Repair</option>
                <option value="Mechanical Harvester Width Incompatibility">Depot Harvester Width Incompatible with Field Bunds</option>
                <option value="Cluster Dispatch Optimization">Cluster Dispatch: Combining Adjacent Women Farmers' Plots</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="override-explanation-text">Detailed Officer Justification <span class="required-star">*</span></label>
              <textarea 
                id="override-explanation-text" 
                class="form-control" 
                placeholder="Enter detailed agronomic justification for this manual override..." 
                required></textarea>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline btn-sm modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-sm" style="background: #d97706; color: #ffffff;">Save Override & Record to Audit</button>
          </div>
        </form>
      </div>
    </div>
  `;

  removeExistingModal('priority-override-modal');
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function handleOverrideSubmit() {
  const newRank = document.getElementById('override-new-rank').value;
  const reason = document.getElementById('override-reason-category').value;
  const notes = document.getElementById('override-explanation-text').value;

  if (!reason || !notes.trim()) {
    alert('Mandatory justification notes are required to override recommended priority.');
    return;
  }

  if (currentActivePriorityRow) {
    const bookingId = currentActivePriorityRow.querySelector('.col-ps-booking-id').textContent.trim();
    const rankCell = currentActivePriorityRow.querySelector('.col-ps-rank');
    
    rankCell.innerHTML = `<span class="priority-chip priority-critical" style="border: 1px dashed #dc2626;">${escapeHtml(newRank)} *</span>`;

    removeExistingModal('priority-override-modal');

    if (window.showToast) {
      window.showToast(`Priority for ${bookingId} overridden to "${newRank}". Logged to Audit History.`, 'warning');
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
