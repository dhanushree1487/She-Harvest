/**
 * She Harvest - Fairness & Reports Script
 * Path: officer/js/fairness-reports.js
 * 
 * Handles date range filtering and native client-side CSV export
 * for regional fairness audits and smallholder equity statistics.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDateFilter();
  initCsvExport();
});

/**
 * 1. Date Range Filter
 */
function initDateFilter() {
  const dateSelect = document.getElementById('report-date-range');
  if (!dateSelect) return;

  dateSelect.addEventListener('change', () => {
    const period = dateSelect.value;
    
    // Animate visual bar chart adjustments for demonstration
    const bars = document.querySelectorAll('.bar-fill');
    bars.forEach(bar => {
      bar.style.opacity = '0.5';
      setTimeout(() => {
        bar.style.opacity = '1';
      }, 300);
    });

    if (window.showToast) {
      window.showToast(`Report updated for period: ${dateSelect.options[dateSelect.selectedIndex].text}`, 'info');
    }
  });
}

/**
 * 2. Native Vanilla JavaScript CSV Export
 * Requirement: Download Report button that exports sample report data as CSV
 */
function initCsvExport() {
  const exportBtn = document.getElementById('btn-download-report');
  if (!exportBtn) return;

  exportBtn.addEventListener('click', (e) => {
    e.preventDefault();
    generateAndDownloadCsv();
  });
}

function generateAndDownloadCsv() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Structured Sample Fairness Metrics CSV Content
  const csvRows = [
    ['She Harvest - Agricultural Machinery Fairness & Equity Audit Report'],
    ['Generated On', new Date().toLocaleString()],
    ['Reporting Officer', 'Lakshmi Ramanathan (District Agronomy Lead)'],
    ['Regional Depot', 'Thanjavur West Hub & Delta Agrarian Centers'],
    ['Advisory Note', 'Demonstration prototype sample statistics designed to detect scheduling disparities.'],
    [],
    ['KEY FAIRNESS PERFORMANCE INDICATORS'],
    ['Metric', 'Current Value', 'Target Standard', 'Variance'],
    ['Average Smallholder Wait Time', '2.1 Days', '<= 2.5 Days', 'Within Target (Optimal)'],
    ['Total Bookings Processed', '142', '150', '94.6% Capacity'],
    ['Postponed Bookings Count', '8', '<= 10', '5.6% Postponement Rate'],
    ['Rejected Requests Count', '5', '<= 8', '3.5% Rejection Rate'],
    ['Booking Completion Rate', '96.4%', '>= 95.0%', '+1.4% Above Benchmark'],
    ['Scheduling Override Count', '4', '<= 6', 'Advisory Compliance 94.2%'],
    ['Open Grievance / Fairness Flags', '2', '0', '2 Under Officer Investigation'],
    [],
    ['EQUITY AUDIT BY FARMER LANDHOLDING BRACKET'],
    ['Farmer Group', 'Total Bookings', 'Avg Wait Time (Days)', 'Postponement Rate', 'Smallholder Equity Status'],
    ['Marginal Women Smallholders (<= 1.0 Acre)', '52', '2.0 Days', '3.8%', 'Protected Priority (Zero Unjustified Bumps)'],
    ['Smallholder Women (1.1 - 2.5 Acres)', '64', '2.2 Days', '4.7%', 'Protected Priority (Optimal Rotation)'],
    ['Medium Farm Holdings (2.6 - 5.0 Acres)', '26', '2.4 Days', '7.6%', 'Standard Turn (No Priority Advantage)'],
    [],
    ['POSTPONEMENT ROOT CAUSE BREAKDOWN'],
    ['Reason Category', 'Incident Count', 'Percentage Share', 'Corrective Action Taken'],
    ['Severe Monsoon Rain Delay', '4', '50.0%', 'Rescheduled to first dry-soil window'],
    ['Machinery Hydraulic Line Maintenance', '2', '25.0%', 'Reassigned backup unit from Kumbakonam'],
    ['Inaccessible Farm Road / Culvert Repair', '1', '12.5%', 'Rerouted via northern field bund track'],
    ['Farmer Mutual Date Adjustment', '1', '12.5%', 'Rescheduled upon farmer telephone confirmation'],
    [],
    ['ALGORITHM ADVISORY COMPLIANCE AUDIT'],
    ['Total Automated Recommendations', '142'],
    ['Accepted Directly Without Officer Change', '134 (94.4%)'],
    ['Overridden with Documented Agronomic Justification', '8 (5.6%)'],
    ['Unjustified / Flagged Overrides', '0 (Zero Tolerance Violation)']
  ];

  // Convert array to CSV string
  const csvContent = csvRows
    .map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  // Create Blob & trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `she_harvest_fairness_report_${currentDate}.csv`;

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
    window.showToast(`Fairness report exported: "${filename}".`, 'success');
  }
}
