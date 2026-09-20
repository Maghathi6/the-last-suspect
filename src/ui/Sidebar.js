import { state } from '../game/state.js';

export function renderSidebar() {
  const items = [
    { name: 'Timeline Board', screen: 'TIMELINE' },
    { name: 'Campus Map', screen: 'CAMPUS' },
    { name: 'Suspect Profiles', screen: 'SUSPECTS' },
    { name: 'Detective Journal', screen: 'JOURNAL' }
  ];

  const navItems = items.map(item => {
    const active = state.screen === item.screen || 
                   (item.screen === 'CAMPUS' && state.screen === 'LOCATION') ||
                   (item.screen === 'SUSPECTS' && state.screen === 'INTERROGATE');
    return `
      <a href="#" class="sidebar-nav-item ${active ? 'active' : ''}" onclick="window.GameApp.navigate('${item.screen}')">
        ${item.name}
      </a>
    `;
  }).join('');

  return `
    <style>
      .sidebar-nav-item {
        display: block;
        padding: 0.85rem 1.25rem;
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.9rem;
        transition: all 0.2s ease;
        border-left: 3px solid transparent;
      }
      .sidebar-nav-item:hover {
        color: var(--text-primary);
        background-color: var(--bg-surface-hover);
      }
      .sidebar-nav-item.active {
        color: var(--accent);
        border-left-color: var(--accent);
        background-color: rgba(205, 123, 70, 0.08);
        font-weight: 600;
      }
    </style>
    <nav>
      ${navItems}
    </nav>
  `;
}
