import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeAnalysisResponseDto } from '../../models/analysis-response.model';

@Component({
  selector: 'app-analysis-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card results-card" *ngIf="report">
      <div class="results-header">
        <div>
          <div class="header-badges">
            <span [class]="getBadgeClass(report.analysisType)">
              Estrategia: {{ report.analysisType }}
            </span>
            <span class="report-id">ID: {{ report.id }}</span>
          </div>
          <h2 class="results-title">{{ report.summary }}</h2>
          <p class="results-meta">Proyecto: <strong>{{ report.projectKey }}</strong> | Fecha: {{ report.timestamp | date:'medium' }}</p>
        </div>
      </div>

      <!-- Recommendations section -->
      <div class="section-container" *ngIf="report.recommendations?.length">
        <h3 class="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Recomendaciones de Calidad y Seguridad
        </h3>
        <ul class="recommendation-list">
          <li *ngFor="let rec of report.recommendations" class="recommendation-item">
            <span class="bullet"></span>
            <span>{{ rec }}</span>
          </li>
        </ul>
      </div>

      <!-- Raw metrics metadata -->
      <div class="section-container" *ngIf="report.metrics">
        <h3 class="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          Metadatos Extraídos por la Estrategia
        </h3>
        <div class="metrics-json">
          <pre><code>{{ report.metrics | json }}</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .results-card {
      padding: 28px;
    }

    .results-header {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-color);
    }

    .header-badges {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .report-id {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: var(--font-code);
    }

    .results-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .results-meta {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .section-container {
      margin-top: 24px;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .recommendation-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .recommendation-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: rgba(11, 15, 25, 0.4);
      border: 1px solid var(--border-color);
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
    }

    .bullet {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--primary);
      margin-top: 6px;
      flex-shrink: 0;
    }

    .metrics-json {
      background: rgba(11, 15, 25, 0.7);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 16px;
      font-family: var(--font-code);
      font-size: 0.85rem;
      color: var(--text-main);
      overflow-x: auto;
    }
  `]
})
export class AnalysisResultsComponent {
  @Input() report: CodeAnalysisResponseDto | null = null;

  getBadgeClass(type: string): string {
    switch (type) {
      case 'JAVA': return 'badge badge-java';
      case 'PYTHON': return 'badge badge-python';
      default: return 'badge badge-generic';
    }
  }
}
