import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeAnalysisResponseDto } from '../../models/analysis-response.model';

@Component({
  selector: 'app-metrics-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metrics-grid" *ngIf="report">
      <!-- Lines of Code -->
      <div class="glass-card metric-card">
        <div class="metric-icon icon-cyan">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </div>
        <div>
          <p class="metric-label">Líneas de Código (LOC)</p>
          <p class="metric-value">{{ report.linesOfCode }}</p>
        </div>
      </div>

      <!-- Cyclomatic Complexity -->
      <div class="glass-card metric-card">
        <div class="metric-icon icon-indigo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <div>
          <p class="metric-label">Complejidad Ciclomática</p>
          <p class="metric-value">{{ report.cyclomaticComplexity }}</p>
        </div>
      </div>

      <!-- Estimated Bugs -->
      <div class="glass-card metric-card">
        <div class="metric-icon icon-warning">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          </svg>
        </div>
        <div>
          <p class="metric-label">Bugs Estimados</p>
          <p class="metric-value">{{ report.estimatedBugs }}</p>
        </div>
      </div>

      <!-- Vulnerabilities -->
      <div class="glass-card metric-card">
        <div class="metric-icon icon-danger">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <div>
          <p class="metric-label">Vulnerabilidades</p>
          <p class="metric-value" [class.text-danger]="report.securityVulnerabilities > 0">
            {{ report.securityVulnerabilities }}
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .metric-card {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon-cyan {
      background: rgba(56, 189, 248, 0.15);
      color: var(--primary);
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    .icon-indigo {
      background: rgba(129, 140, 248, 0.15);
      color: var(--secondary);
      border: 1px solid rgba(129, 140, 248, 0.3);
    }

    .icon-warning {
      background: rgba(251, 191, 36, 0.15);
      color: var(--warning);
      border: 1px solid rgba(251, 191, 36, 0.3);
    }

    .icon-danger {
      background: rgba(248, 113, 113, 0.15);
      color: var(--danger);
      border: 1px solid rgba(248, 113, 113, 0.3);
    }

    .metric-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: 700;
      font-family: var(--font-heading);
      color: var(--text-main);
    }

    .text-danger {
      color: var(--danger);
    }
  `]
})
export class MetricsSummaryComponent {
  @Input() report: CodeAnalysisResponseDto | null = null;
}
