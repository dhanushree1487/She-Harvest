/**
 * She Harvest - Machinery Management Script
 * Path: officer/js/machinery.js
 * 
 * Handles machinery filtering, search, Add Machine modal,
 * Edit Machine modal, and live availability toggling.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMachineryFilters();
  initMachinerySearch();
  initAddMachineModal();
  initEditMachineActions();
  initQuickStatusChanges();
});

let currentActiveMachineRow = null;

/**
 * 1. Machinery Filter Buttons
 */
function initMachineryFilters() {
  const filterBtns = document.querySelectorAll('.machine-filter-btn');
  const rows = document.querySelectorAll('#machinery-table-body tr');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterStatus = btn.getAttribute('data-status').toLowerCase();

      rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status').toLowerCase();
        if (filterStatus === 'all' || rowStatus === filterStatus) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 2. Machinery Search Field
 */
function initMachinerySearch() {
  const searchInput = document.getElementById('machinery-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll('#machinery-table-body tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(term) ? '' : 'none';
    });
  });
}

/**
 * 3. Add Machine Modal Handler
 */
function initAddMachineModal() {
  const addBtn = document.getElementById('btn-add-machine');
  if (!addBtn) return;

  addBtn.addEventListener('click', () => {
    const modalHTML = `
      <div class="modal-overlay active" id="add-machine-modal">
        <div class="modal-container">
          <div class="modal-header">
            <h3 class="modal-title" style="display: flex; align-items: center; gap: 0.5rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add New Machinery Unit
            </h3>
            <button type="button" class="modal-close-btn" aria-label="Close">&times;</button>
          </div>
          <form id="add-machine-form">
            <div class="modal-body">
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="add-mch-id">Machine Serial / ID <span class="required-star">*</span></label>
                  <input type="text" id="add-mch-id" class="form-control" placeholder="e.g. MCH-CH-09" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="add-mch-type">Machine Type <span class="required-star">*</span></label>
                  <select id="add-mch-type" class="form-select" required>
                    <option value="Combine Harvester">Combine Harvester (Paddy)</option>
                    <option value="Multi-Crop Thresher">Multi-Crop Thresher</option>
                    <option value="Mini Tractor">Mini Tractor (24-30 HP)</option>
                    <option value="Paddy Transplanter">Paddy Transplanter (Self-Propelled)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="add-mch-name">Machine Model & Make <span class="required-star">*</span></label>
                <input type="text" id="add-mch-name" class="form-control" placeholder="e.g. Kubota Harvester DC-68G (75HP)" required>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="add-mch-centre">Assigned Centre <span class="required-star">*</span></label>
                  <select id="add-mch-centre" class="form-select" required>
                    <option value="Thanjavur West Depot">Thanjavur West Depot</option>
                    <option value="Kumbakonam Sub-Station">Kumbakonam Sub-Station</option>
                    <option value="Pattukkottai Coastal Hub">Pattukkottai Coastal Hub</option>
                    <option value="Mayiladuthurai Service Point">Mayiladuthurai Service Point</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="add-mch-hours">Meter Hours <span class="required-star">*</span></label>
                  <input type="number" id="add-mch-hours" class="form-control" placeholder="e.g. 120" value="0" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="add-mch-status">Initial Status</label>
                  <select id="add-mch-status" class="form-select">
                    <option value="available">Available in Depot</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="add-mch-maint">Maintenance Health</label>
                  <select id="add-mch-maint" class="form-select">
                    <option value="healthy">Healthy & Field-Ready</option>
                    <option value="service-due">Service Due Soon</option>
                  </select>
                </div>
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline btn-sm modal-close-btn">Cancel</button>
              <button type="submit" class="btn btn-sm btn-primary">Save to Depot Fleet</button>
            </div>
          </form>
        </div>
      </div>
    `;

    removeExistingModal('add-machine-modal');
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  });

  // Handle Add Machine Submit
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'add-machine-form') {
      e.preventDefault();
      handleAddMachineSubmit();
    }
  });
}

function handleAddMachineSubmit() {
  const id = document.getElementById('add-mch-id').value.trim();
  const type = document.getElementById('add-mch-type').value;
  const name = document.getElementById('add-mch-name').value.trim();
  const centre = document.getElementById('add-mch-centre').value;
  const hours = document.getElementById('add-mch-hours').value || 0;
  const status = document.getElementById('add-mch-status').value;
  const maint = document.getElementById('add-mch-maint').value;

  const tableBody = document.getElementById('machinery-table-body');
  if (!tableBody) return;

  const statusLabel = status === 'available' ? 'Available' : 'Under Maint';
  const statusPillClass = status === 'available' ? 'status-approved' : 'status-maintenance';
  const maintLabel = maint === 'healthy' ? 'Healthy' : 'Service Due';
  const maintPillClass = maint === 'healthy' ? 'healthy' : 'service-due';

  const newRowHTML = `
    <tr data-status="${escapeHtml(status)}">
      <td class="col-mch-id"><strong>${escapeHtml(id)}</strong></td>
      <td class="col-mch-info">
        <div class="machine-info-cell">
          <div class="machine-type-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          </div>
          <div>
            <div class="col-mch-name" style="font-weight: 700;">${escapeHtml(name)}</div>
            <div class="col-mch-type" style="font-size: 0.75rem; color: #5e7367;">${escapeHtml(type)}</div>
          </div>
        </div>
      </td>
      <td class="col-mch-centre">${escapeHtml(centre)}</td>
      <td class="col-mch-status">
        <span class="status-pill ${statusPillClass}">${statusLabel}</span>
      </td>
      <td class="col-mch-booking"><span style="color: #5e7367; font-style: italic;">Standby</span></td>
      <td class="col-mch-hours">${escapeHtml(hours)} hrs</td>
      <td class="col-mch-maint">
        <span class="maintenance-pill ${maintPillClass}">${maintLabel}</span>
      </td>
      <td>
        <div class="action-btn-group">
          <button type="button" class="btn-icon-action btn-edit-machine" title="Edit Machinery Details">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
        </div>
      </td>
    </tr>
  `;

  tableBody.insertAdjacentHTML('afterbegin', newRowHTML);
  removeExistingModal('add-machine-modal');

  if (window.showToast) {
    window.showToast(`Machine ${id} added to ${centre} inventory.`, 'success');
  }
}

/**
 * 4. Edit Machine Modal Handler
 */
function initEditMachineActions() {
  const tableBody = document.getElementById('machinery-table-body');
  if (!tableBody) return;

  tableBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit-machine');
    if (!editBtn) return;

    const row = editBtn.closest('tr');
    currentActiveMachineRow = row;

    const id = row.querySelector('.col-mch-id').textContent.trim();
    const name = row.querySelector('.col-mch-name').textContent.trim();
    const centre = row.querySelector('.col-mch-centre').textContent.trim();
    const hours = parseInt(row.querySelector('.col-mch-hours').textContent) || 0;
    const currentStatus = row.getAttribute('data-status') || 'available';

    const modalHTML = `
      <div class="modal-overlay active" id="edit-machine-modal">
        <div class="modal-container">
          <div class="modal-header">
            <h3 class="modal-title">Edit Machine: ${escapeHtml(id)}</h3>
            <button type="button" class="modal-close-btn" aria-label="Close">&times;</button>
          </div>
          <form id="edit-machine-form">
            <div class="modal-body">
              
              <div class="form-group">
                <label class="form-label" for="edit-mch-name">Machine Make & Model</label>
                <input type="text" id="edit-mch-name" class="form-control" value="${escapeHtml(name)}" required>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="edit-mch-centre">Operational Depot</label>
                  <select id="edit-mch-centre" class="form-select">
                    <option value="Thanjavur West Depot" ${centre.includes('Thanjavur') ? 'selected' : ''}>Thanjavur West Depot</option>
                    <option value="Kumbakonam Sub-Station" ${centre.includes('Kumbakonam') ? 'selected' : ''}>Kumbakonam Sub-Station</option>
                    <option value="Pattukkottai Coastal Hub" ${centre.includes('Pattukkottai') ? 'selected' : ''}>Pattukkottai Coastal Hub</option>
                    <option value="Mayiladuthurai Service Point" ${centre.includes('Mayiladuthurai') ? 'selected' : ''}>Mayiladuthurai Service Point</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="edit-mch-hours">Meter Hours</label>
                  <input type="number" id="edit-mch-hours" class="form-control" value="${hours}" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="edit-mch-status">Availability Status</label>
                  <select id="edit-mch-status" class="form-select">
                    <option value="available" ${currentStatus === 'available' ? 'selected' : ''}>Available in Depot</option>
                    <option value="dispatched" ${currentStatus === 'dispatched' ? 'selected' : ''}>Dispatched to Farm</option>
                    <option value="in-operation" ${currentStatus === 'in-operation' ? 'selected' : ''}>In Field Operation</option>
                    <option value="maintenance" ${currentStatus === 'maintenance' ? 'selected' : ''}>Under Maintenance</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="edit-mch-maint">Maintenance Status</label>
                  <select id="edit-mch-maint" class="form-select">
                    <option value="healthy">Healthy</option>
                    <option value="service-due">Service Due in 3 Days</option>
                    <option value="urgent">Urgent Hydraulic/Engine Repair</option>
                  </select>
                </div>
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline btn-sm modal-close-btn">Cancel</button>
              <button type="submit" class="btn btn-sm btn-primary">Update Machine</button>
            </div>
          </form>
        </div>
      </div>
    `;

    removeExistingModal('edit-machine-modal');
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  });

  // Handle Edit Submit
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'edit-machine-form') {
      e.preventDefault();
      handleEditMachineSubmit();
    }
  });
}

function handleEditMachineSubmit() {
  if (!currentActiveMachineRow) return;

  const id = currentActiveMachineRow.querySelector('.col-mch-id').textContent.trim();
  const name = document.getElementById('edit-mch-name').value;
  const centre = document.getElementById('edit-mch-centre').value;
  const hours = document.getElementById('edit-mch-hours').value;
  const status = document.getElementById('edit-mch-status').value;
  const maint = document.getElementById('edit-mch-maint').value;

  // Update DOM row
  currentActiveMachineRow.querySelector('.col-mch-name').textContent = name;
  currentActiveMachineRow.querySelector('.col-mch-centre').textContent = centre;
  currentActiveMachineRow.querySelector('.col-mch-hours').textContent = `${hours} hrs`;
  currentActiveMachineRow.setAttribute('data-status', status);

  const statusMap = {
    'available': { text: 'Available', class: 'status-approved' },
    'dispatched': { text: 'Dispatched', class: 'status-pending' },
    'in-operation': { text: 'In Ops', class: 'status-in-progress' },
    'maintenance': { text: 'Maintenance', class: 'status-maintenance' }
  };

  const maintMap = {
    'healthy': { text: 'Healthy', class: 'healthy' },
    'service-due': { text: 'Service Due', class: 'service-due' },
    'urgent': { text: 'Urgent Repair', class: 'urgent' }
  };

  const s = statusMap[status] || statusMap['available'];
  const m = maintMap[maint] || maintMap['healthy'];

  currentActiveMachineRow.querySelector('.col-mch-status').innerHTML = `<span class="status-pill ${s.class}">${s.text}</span>`;
  currentActiveMachineRow.querySelector('.col-mch-maint').innerHTML = `<span class="maintenance-pill ${m.class}">${m.text}</span>`;

  removeExistingModal('edit-machine-modal');

  if (window.showToast) {
    window.showToast(`Machine ${id} updated successfully.`, 'success');
  }
}

/**
 * Quick status changes helper
 */
function initQuickStatusChanges() {
  // Can be extended for quick row buttons
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
