import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RepositoryAnalysisResponseDto } from "../../models/analysis-response.model";

@Component({
  selector: "app-summary-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="summary-container" *ngIf="report">
      <!-- Resumen Funcional Destacado -->
      <div class="functional-card glass-card">
        <div class="card-badge">
          🎯 Resumen Funcional (Propósito del Sistema)
        </div>
        <p class="summary-text" *ngIf="report.functionalSummary">
          {{ report.functionalSummary }}
        </p>
        <p class="summary-text muted" *ngIf="!report.functionalSummary">
          El resumen funcional se encuentra incluido en el informe completo de
          IA a continuación.
        </p>
      </div>

      <!-- Ficha Técnica y Métricas Clave -->
      <div class="metrics-grid">
        <div class="metric-card glass-card">
          <div class="metric-icon primary">📁</div>
          <div class="metric-content">
            <span class="metric-value">{{ report.totalFiles }}</span>
            <span class="metric-label">Archivos Analizados</span>
          </div>
        </div>

        <div class="metric-card glass-card">
          <div class="metric-icon secondary">🗂️</div>
          <div class="metric-content">
            <span class="metric-value">{{ report.totalDirectories }}</span>
            <span class="metric-label">Directorios Escaneados</span>
          </div>
        </div>

        <div class="metric-card glass-card">
          <div class="metric-icon success">🧩</div>
          <div class="metric-content">
            <span class="metric-value">{{
              report.componentAnalysis.totalComponents
            }}</span>
            <span class="metric-label">Componentes Identificados</span>
          </div>
        </div>

        <div class="metric-card glass-card">
          <div class="metric-icon warning">📐</div>
          <div class="metric-content">
            <span class="metric-value">{{
              report.architectureEvidence.totalStructuralPaths
            }}</span>
            <span class="metric-label">Rutas Estructurales</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .summary-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .functional-card {
        padding: 24px;
        border-left: 4px solid var(--primary);
      }
      .card-badge {
        display: inline-block;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--primary);
        margin-bottom: 12px;
      }
      .summary-text {
        font-size: 1.05rem;
        line-height: 1.6;
        color: var(--text-main);
        margin: 0;
      }
      .summary-text.muted {
        color: var(--text-muted);
        font-style: italic;
      }
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }
      .metric-card {
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .metric-icon {
        font-size: 1.8rem;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-sm);
        background: var(--bg-hover);
      }
      .metric-content {
        display: flex;
        flex-direction: column;
      }
      .metric-value {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text-main);
      }
      .metric-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-muted);
      }
    `,
  ],
})
export class SummaryCardComponent {
  @Input() report: RepositoryAnalysisResponseDto | null = null;
}
