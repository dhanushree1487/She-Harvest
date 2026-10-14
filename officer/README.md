# She Harvest — Officer Portal Frontend Architecture

Welcome to the **She Harvest Officer Portal** frontend template. This portal is the administrative backbone of the **She Harvest** platform, an equitable agricultural mechanization initiative designed to guarantee fair access to harvesting machinery (combine harvesters, paddy threshers, and power equipment) for women smallholder farmers.

This documentation is written specifically for our two-person development team to allow us to divide the modules cleanly, develop independently, and integrate smoothly without conflicts.

---

## 1. Directory & File Structure

All Officer Portal files are located strictly inside the `officer/` folder, preserving the home page and Farmer Portal without modification:

```text
she-harvest/
│
├── index.html                       # Main She Harvest homepage
├── css/
│   └── style.css                    # Global root design system & tokens
├── home/
│   └── home.css                     # Homepage styles
├── farmer/
│   ├── farmer-login.html
│   └── farmer.css
│
├── officer/
│   │
│   ├── login.html                   # Officer sign-in (Demo auth + validation)
│   ├── signup.html                  # Officer registration (Validation + Demo)
│   ├── dashboard.html               # Main operational overview & analytics
│   ├── officer-login.html           # Bridge redirect for backwards compatibility
│   │
│   ├── modules/
│   │   ├── bookings.html            # 1. Booking management & queue filters
│   │   ├── priority-scheduling.html # 2. AI priority scoring & override audit
│   │   ├── machinery.html           # 3. Fleet inventory & depot telemetry
│   │   ├── alerts-complaints.html   # 4. Grievance & fairness monitoring
│   │   ├── fairness-reports.html    # 5. Equity audits & CSV report export
│   │   └── audit-log.html           # 6. Immutable append-only audit trail
│   │
│   ├── css/
│   │   ├── components.css           # Master shared components (Shell, sidebar, modals)
│   │   ├── auth.css                 # Login and signup styles
│   │   ├── dashboard.css            # Dashboard specific layout & donut chart
│   │   ├── bookings.css             # Booking table, urgency pills, reason modal
│   │   ├── priority-scheduling.css  # Formula banner, risk chips, breakdown modal
│   │   ├── machinery.css            # Fleet table, maintenance pills
│   │   ├── alerts-complaints.css    # Grievance severity pills & timeline
│   │   ├── fairness-reports.css     # Pure CSS bar charts & compliance ring
│   │   └── audit-log.css            # Audit chips, value diff display
│   │
│   ├── js/
│   │   ├── auth.js                  # Login/signup validation & password toggles
│   │   ├── navigation.js            # Shared shell: mobile sidebar, notifications, search
│   │   ├── dashboard.js             # Quick approvals, booking snapshots
│   │   ├── bookings.js              # Booking filters, reject/reschedule modals
│   │   ├── priority-scheduling.js   # Score explanation & override modals
│   │   ├── machinery.js             # Add/Edit machine modals, fleet filters
│   │   ├── alerts-complaints.js     # Severity filters, review/resolve actions
│   │   ├── fairness-reports.js      # Date range filter, native CSV export
│   │   └── audit-log.js             # Audit filters, CSV history export
│   │
│   └── README.md                    # Team developer guide (this file)
│
└── assets/
    └── images/
```

---

## 2. Technology Guidelines & Constraints

- **Strict Vanilla Stack**: Built with pure **HTML5**, modern **CSS3**, and **Vanilla JavaScript (ES6+)**.
- **Zero Frameworks**: No React, Vue, Bootstrap, Tailwind, jQuery, or external libraries.
- **Local Portability**: All asset references, stylesheets, and scripts use **relative paths**. You can move the entire `she-harvest/` folder anywhere or double-click any HTML file in a web browser, and it will render perfectly without broken styles.
- **Frontend Demonstration**: No real backend, database, or live AI model is required at this phase. All statistics, priority scores, and telemetry use realistic sample data representing smallholders in Tamil Nadu's Cauvery Delta (Thanjavur, Kumbakonam, Pattukkottai, Mayiladuthurai).

---

## 3. Team Work Division (2-Developer Split)

To develop and test modules independently without merge conflicts, work is divided across two tracks:

### 👤 Developer A — Operations & Fleet Track
Focuses on operational booking workflows, equipment telemetry, and user authentication:
1. **Authentication**: `login.html`, `signup.html`, `css/auth.css`, `js/auth.js`
2. **Dashboard Overview**: `dashboard.html`, `css/dashboard.css`, `js/dashboard.js`
3. **Booking Management**: `modules/bookings.html`, `css/bookings.css`, `js/bookings.js`
4. **Machinery Management**: `modules/machinery.html`, `css/machinery.css`, `js/machinery.js`

### 👤 Developer B — Algorithmic Fairness & Accountability Track
Focuses on equitable scheduling, grievance resolution, transparency audits, and CSV reports:
1. **AI Priority & Fair Scheduling**: `modules/priority-scheduling.html`, `css/priority-scheduling.css`, `js/priority-scheduling.js`
2. **Alerts & Complaints**: `modules/alerts-complaints.html`, `css/alerts-complaints.css`, `js/alerts-complaints.js`
3. **Fairness & Reports**: `modules/fairness-reports.html`, `css/fairness-reports.css`, `js/fairness-reports.js`
4. **Audit Log**: `modules/audit-log.html`, `css/audit-log.css`, `js/audit-log.js`

---

## 4. Shared Design System & CSS Conventions

All shared components are defined in `officer/css/components.css`. When adding new UI elements, always reuse these classes:

### Color Palette (Design Tokens)
- **Primary Dark**: `#133a27` (Deep Forest Green for headers, sidebars)
- **Primary Medium**: `#2a724b` (Brand green for buttons, primary badges)
- **Accent Green**: `#48bb78` (Highlight green)
- **Warm Earth / Sand**: `#c9933b` / `#fcf6eb` (Agricultural accents)
- **Background Body**: `#f8faf6` (Soft neutral canvas)
- **Cards**: `#ffffff` with subtle borders (`#dce6de`) and smooth shadows

### Standard Component Classes
| Component | Class Name(s) | Description |
|---|---|---|
| **App Shell** | `.officer-app-layout` | Master flex container |
| **Sidebar** | `.officer-sidebar`, `.sidebar-link.active` | Responsive navigation drawer |
| **Topbar** | `.officer-topbar`, `.topbar-title` | Sticky administrative header |
| **Cards** | `.admin-card`, `.admin-card-header` | Universal white elevation cards |
| **Stats Grid** | `.stats-grid`, `.stat-card`, `.stat-value` | Responsive KPI tiles |
| **Tables** | `.table-responsive`, `.data-table` | Data grid with hover and borders |
| **Status Pills** | `.status-pill.status-pending`, `.status-approved` | Colored circular-indicator tags |
| **Priority Chips** | `.priority-chip.priority-critical`, `.priority-high` | Urgency tags |
| **Modals** | `.modal-overlay`, `.modal-container`, `.modal-close-btn` | Backdrop dialogs |
| **Toasts** | `.toast-container`, `.toast` | Notification snackbars via `window.showToast()` |

---

## 5. JavaScript Helper Utilities

### 1. Global Toast Notifications
Available on every page via `js/navigation.js`:
```javascript
window.showToast("Booking BK-2026-081 approved successfully.", "success");
// Types supported: 'success', 'warning', 'error', 'info'
```

### 2. Search Shortcut
Pressing `Ctrl + K` (or `Cmd + K`) on any page instantly focuses the topbar search input.

### 3. Native CSV Download Helper
Used in `fairness-reports.js` and `audit-log.js`:
```javascript
const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// Handled cleanly with HTML5 download link
```

---

## 6. How to Open & Test Locally

1. **Direct Browser Launch**: Double-click `index.html` or `officer/login.html` in any browser (Chrome, Edge, Firefox, Safari).
2. **Local Static Server (Optional)**:
   ```bash
   # Using Python:
   python -m http.server 8000
   # Using Node:
   npx serve .
   ```
3. Navigate between pages using the sidebar links. Notice:
   - Clicking **Approve** changes status immediately.
   - Clicking **Reject** or **Reschedule** opens a reason-entry modal (no silent changes).
   - Clicking **Override** in Priority Scheduling displays the advisory override modal with mandatory justification.
   - Clicking **Download Report** or **Export Log** downloads a clean CSV file locally.

---

## 7. Backend Integration Assumptions (Future Phase)

When we are ready to connect a backend (Node.js/Express, Python/FastAPI, or Firebase):
1. **Authentication**: Replace `initLoginForm` in `auth.js` with `fetch('/api/auth/login')`.
2. **Live Data**: Replace static `<tbody>` HTML in each module with dynamic API endpoints (`GET /api/bookings`, `GET /api/priority-queue`, `GET /api/machinery`, etc.).
3. **Audit Trail**: Every POST/PATCH for rejection, rescheduling, or priority overrides will emit an append-only event to the audit service (`POST /api/audit-logs`).
