/**
 * She Harvest - Audit Log Management Script
 * Path: officer/js/audit-log.js
 * 
 * Handles multi-criteria filtering (officer, action type, date, search)
 * and native client-side CSV export of simulated immutable audit records.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuditFilters();
  initAuditCsvExport();
});

function initAuditFilters() {
  const officerSelect = document.getElementById('audit-officer-filter');
  const actionSelect = document.getElementById('audit-action-filter');
  const searchInput = document.getElementById('audit-search-input');
  const rows = document.querySelectorAll('#audit-table-body tr');

  function applyFilters() {
    const selOfficer = officerSelect ? officerSelect.value.toLowerCase() : 'all';
    const selAction = actionSelect ? actionSelect.value.toLowerCase() : 'all';
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    rows.forEach(row => {
      const rowOfficer = row.getAttribute('data-officer').toLowerCase();
      const rowAction = row.getAttribute('data-action').toLowerCase();
      const rowText = row.textContent.toLowerCase();

      const matchOfficer = (selOfficer === 'all' || rowOfficer.includes(selOfficer));
      const matchAction = (selAction === 'all' || rowAction === selAction);
      const matchSearch = (!searchTerm || rowText.includes(searchTerm));

      row.style.display = (matchOfficer && matchAction && matchSearch) ? '' : 'none';
    });
  }

  if (officerSelect) officerSelect.addEventListener('change', applyFilters);
  if (actionSelect) actionSelect.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', applyFilters);
}

function initAuditCsvExport() {
  const exportBtn = document.getElementById('btn-export-audit');
  if (!exportBtn) return;

  exportBtn.addEventListener('click', (e) => {
    e.preventDefault();
    exportAuditLogToCsv();
  });
}

function exportAuditLogToCsv() {
  const currentDate = new Date().toISOString().split('T')[0];

  const csvRows = [
    ['She Harvest - Administrative Operations Audit Log'],
    ['Generated On', new Date().toLocaleString()],
    ['Integrity Protocol', 'Chronologically Indexed Append-Only Demonstration Log'],
    [],
    ['Timestamp', 'Officer ID & Name', 'Action Performed', 'Entity ID', 'Previous Value', 'New Value', 'Justification / Reason'],
    ['2026-10-14 18:32:10', 'OFF-TN-204 (Lakshmi Ramanathan)', 'Priority Override', 'BK-2026-074', 'Rank #4', 'Rank #1', 'Impending monsoon storm threat to mature paddy crop'],
    ['2026-10-14 17:15:44', 'OFF-TN-204 (Lakshmi Ramanathan)', 'Booking Approval', 'BK-2026-079', 'Pending Verification', 'Approved & Scheduled', 'Completed automated land title and cooperative quota verification'],
    ['2026-10-14 15:40:22', 'OFF-TN-512 (K. Arulmozhi)', 'Booking Reschedule', 'BK-2026-074', 'Date: 2026-10-14', 'Date: 2026-10-16', 'Pre-monsoon soil excessively waterlogged; delayed by mutual agreement'],
    ['2026-10-14 14:05:12', 'System Automation (Fairness Engine)', 'Fairness Boost', 'BK-2026-081', 'Priority Score: 78', 'Priority Score: 94', 'Compensatory priority boost applied due to previous postponement'],
    ['2026-10-14 11:20:05', 'OFF-TN-204 (Lakshmi Ramanathan)', 'Maintenance Flag', 'MCH-CH-03', 'Status: Available', 'Status: Under Maintenance', 'Hydraulic line pressure drop flagged in Kumbakonam Depot telemetry'],
    ['2026-10-14 09:45:30', 'OFF-TN-512 (K. Arulmozhi)', 'Complaint Resolved', 'ALT-895', 'Status: Under Review', 'Status: Resolved', 'Driver reprimanded for punctuality breach; fuel surcharge reimbursed'],
    ['2026-10-13 16:30:18', 'OFF-TN-204 (Lakshmi Ramanathan)', 'Booking Rejection', 'BK-2026-070', 'Status: Pending', 'Status: Rejected', 'Inspection found crop premature; grain moisture exceeding 28%']
  ];

  const csvContent = csvRows
    .map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `she_harvest_audit_log_${currentDate}.csv`;

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (window.showToast) {
    window.showToast(`Audit log exported: "${filename}".`, 'success');
  }
}
