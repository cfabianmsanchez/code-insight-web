import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeAnalysisFacade } from '../../facade/code-analysis.facade';
import { CodeInputComponent } from '../../components/code-input/code-input.component';
import { MetricsSummaryComponent } from '../../components/metrics-summary/metrics-summary.component';
import { AnalysisResultsComponent } from '../../components/analysis-results/analysis-results.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { CodeAnalysisRequestDto } from '../../models/analysis-request.model';

@Component({
  selector: 'app-code-analysis-page',
  standalone: true,
  imports: [
    CommonModule,
    CodeInputComponent,
    MetricsSummaryComponent,
    AnalysisResultsComponent,
    LoaderComponent
  ],
  template: `
    <div class="container page-layout">
      <!-- Error notification banner -->
      <div class="error-banner glass-card" *ngIf="facade.error()">
        <div class="error-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div>
          <h4 class="error-title">Error en el análisis de código</h4>
          <p class="error-message">{{ facade.error() }}</p>
        </div>
      </div>

      <!-- Feature Header intro -->
      <div class="page-intro">
        <h2 class="intro-title">Inspección de Código & Métricas de Arquitectura</h2>
        <p class="intro-desc">
          Esta vista utiliza el <strong>Patrón Facade (Angular Signals)</strong> para comunicarse vía REST con la 
          <strong>Arquitectura Hexagonal</strong> y el <strong>Patrón Strategy</strong> del backend <code>code-insight-api</code>.
        </p>
      </div>

      <!-- Form for code input -->
      <app-code-input (analyze)="onAnalyze($event)"></app-code-input>

      <!-- Async Loader -->
      <app-loader *ngIf="facade.loading()"></app-loader>

      <!-- Analysis Results & Metrics -->
      <div class="results-section" *ngIf="facade.hasReport()">
        <app-metrics-summary [report]="facade.report()"></app-metrics-summary>
        <app-analysis-results [report]="facade.report()"></app-analysis-results>
      </div>
    </div>
  `,
  styles: [`
    .page-layout {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .page-intro {
      margin-bottom: 8px;
    }

    .intro-title {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .intro-desc {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-top: 6px;
      max-width: 800px;
    }

    .error-banner {
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      border: 1px solid rgba(248, 113, 113, 0.4);
      background: rgba(248, 113, 113, 0.1);
    }

    .error-icon {
      color: var(--danger);
      flex-shrink: 0;
    }

    .error-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--danger);
    }

    .error-message {
      font-size: 0.85rem;
      color: var(--text-main);
    }

    .results-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
      animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class CodeAnalysisPageComponent {
  // Inject Facade Pattern manager
  readonly facade = inject(CodeAnalysisFacade);

  onAnalyze(request: CodeAnalysisRequestDto): void {
    this.facade.analyzeCode(request);
  }
}
