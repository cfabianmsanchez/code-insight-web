import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header-container">
      <div class="container header-content">
        <div class="logo-group">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <div>
            <h1 class="logo-title">Code Insight <span class="badge-tech">API & Web</span></h1>
            <p class="logo-subtitle">Hexagonal Architecture & Strategy Pattern Inspector</p>
          </div>
        </div>
        <div class="header-status">
          <span class="status-indicator"></span>
          <span class="status-text">Backend REST Connected</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      background: rgba(11, 15, 25, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      padding: 16px 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(129, 140, 248, 0.2));
      border: 1px solid var(--border-accent);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-glow);
    }

    .logo-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .badge-tech {
      font-size: 0.75rem;
      background: rgba(56, 189, 248, 0.15);
      color: var(--primary);
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 600;
    }

    .logo-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .header-status {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(52, 211, 153, 0.1);
      border: 1px solid rgba(52, 211, 153, 0.3);
      padding: 6px 14px;
      border-radius: 20px;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--success);
      box-shadow: 0 0 10px var(--success);
      animation: pulse 2s infinite;
    }

    .status-text {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--success);
    }

    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
      100% { opacity: 1; transform: scale(1); }
    }
  `]
})
export class HeaderComponent {}
