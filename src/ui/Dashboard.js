export function renderDashboard() {
  return `
    <style>
      .dashboard-header {
        margin-bottom: 3rem;
        text-align: center;
        padding-top: 2rem;
      }
      .dashboard-title {
        font-size: 3rem;
        letter-spacing: 4px;
        margin-bottom: 0.5rem;
        font-weight: 700;
        text-transform: uppercase;
      }
      .dashboard-subtitle {
        color: var(--text-secondary);
        font-size: 1.1rem;
        font-style: italic;
      }

      .case-brief {
        margin: 0 auto 3rem auto;
        max-width: 600px;
        text-align: center;
        background-color: var(--bg-paper);
        color: var(--text-inverse);
        border: 1px solid #d1cbb8;
      }
      .case-brief .badge-warning {
        background-color: rgba(214, 164, 88, 0.2);
        color: #8c641c;
        border-color: rgba(214, 164, 88, 0.5);
      }

      .case-brief-header {
        margin-bottom: 2rem;
      }
      .case-name {
        font-size: 2.2rem;
        margin-top: 0.5rem;
        margin-bottom: 0.75rem;
        color: #1a1a1a;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        max-width: 900px;
        margin: 0 auto;
      }
    </style>

    <div class="dashboard-header">
      <h1 class="dashboard-title font-serif">THE LAST SUSPECT</h1>
      <p class="dashboard-subtitle font-serif">"A college mystery where nobody remembers the same story."</p>
    </div>

    <div class="card case-brief">
      <div class="case-brief-header">
        <div class="font-mono" style="font-size: 0.85rem; color: #555;">ACTIVE CASE</div>
        <h2 class="case-name font-serif">THE LAST SAMOSA</h2>
        <div>
          <span class="badge badge-warning">INVESTIGATION NOT STARTED</span>
        </div>
      </div>
      <button class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem; width: 100%;">START INVESTIGATION</button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-value">5</span>
        <span class="stat-label">SUSPECTS</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">9</span>
        <span class="stat-label">LOCATIONS</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">1</span>
        <span class="stat-label">MISSING SAMOSA</span>
      </div>
      <div class="stat-card">
        <span class="stat-value text-accent">?</span>
        <span class="stat-label">UNKNOWN CULPRIT</span>
      </div>
    </div>
  `;
}
