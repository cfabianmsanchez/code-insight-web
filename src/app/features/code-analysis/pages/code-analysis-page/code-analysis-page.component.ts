import { Component, ViewChild, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CodeAnalysisFacade } from "../../facade/code-analysis.facade";
import { AnalysisInputComponent } from "../../components/analysis-input/analysis-input.component";
import { SummaryCardComponent } from "../../components/summary-card/summary-card.component";
import { TechStackViewComponent } from "../../components/tech-stack-view/tech-stack-view.component";
import { ArchitectureEvidenceComponent } from "../../components/architecture-evidence/architecture-evidence.component";
import { ComponentsCatalogComponent } from "../../components/components-catalog/components-catalog.component";
import { AiSynthesisViewComponent } from "../../components/ai-synthesis-view/ai-synthesis-view.component";
import { PromptInspectorComponent } from "../../components/prompt-inspector/prompt-inspector.component";
import { LoaderComponent } from "@shared/components/loader/loader.component";

@Component({
  selector: "app-code-analysis-page",
  standalone: true,
  imports: [
    CommonModule,
    AnalysisInputComponent,
    SummaryCardComponent,
    TechStackViewComponent,
    ArchitectureEvidenceComponent,
    ComponentsCatalogComponent,
    AiSynthesisViewComponent,
    PromptInspectorComponent,
    LoaderComponent,
  ],
  template: `
    <div class="container page-layout">
      <!-- Error Notification Banner -->
      <div class="error-banner glass-card" *ngIf="facade.error()">
        <div class="error-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="error-content">
          <h4 class="error-title">No se pudo realizar el análisis</h4>
          <p class="error-message">{{ facade.error() }}</p>
        </div>
        <button type="button" class="error-dismiss" (click)="facade.reset()">
          Descartar
        </button>
      </div>

      <!-- Hero Introduction -->
      <div class="page-intro" *ngIf="!facade.hasReport()">
        <div class="title-with-badge">
          <h1 class="intro-title">
            Ingeniería Inversa & Síntesis de Arquitectura
          </h1>
        </div>
        <p class="intro-desc">
          Analiza cualquier repositorio público <strong>GitHub</strong> o
          paquete <strong>.ZIP</strong> para extraer métricas factuales de
          arquitectura, estereotipos de componentes e inferencia técnica
          asistida por <strong>IA</strong>.
        </p>
      </div>

      <!-- Input Form Component (GitHub URL or ZIP upload) -->
      <app-analysis-input
        #analysisInput
        *ngIf="!facade.hasReport()"
        [loading]="facade.loading()"
        (analyzeGithub)="onAnalyzeGithub($event)"
        (analyzeZip)="onAnalyzeZip($event)"
        (clear)="onResetAll()"
      >
      </app-analysis-input>

      <!-- Async Loader (While processing REST call) -->
      <div class="loader-wrapper" *ngIf="facade.loading()">
        <app-loader></app-loader>
        <div class="pipeline-legend">
          <span class="legend-title"
            >Pipeline Determinístico de 7 Etapas en Ejecución:</span
          >
          <div class="stages-pills">
            <span class="stage-pill">1. Loader</span>
            <span class="stage-pill">2. Scanner</span>
            <span class="stage-pill">3. Tech Detector</span>
            <span class="stage-pill">4. Component Detector</span>
            <span class="stage-pill">5. Architecture Evidence</span>
            <span class="stage-pill">6. Context Builder</span>
            <span class="stage-pill ai">7. Ollama AI Synthesis</span>
          </div>
        </div>
      </div>

      <!-- Vertical Continuous Dashboard Results -->
      <div
        class="results-dashboard"
        *ngIf="facade.hasReport() && facade.result() as report"
      >
        <!-- Dashboard Header Banner (Colapsado para máximo protagonismo del reporte) -->
        <div class="dashboard-header glass-card">
          <div class="header-info">
            <h2 class="repo-name">📌 Proyecto: {{ report.projectKey }}</h2>
            <div class="repo-meta">
              <span
                class="meta-badge"
                [class.git]="report.sourceType === 'GITHUB_REPO'"
              >
                {{
                  report.sourceType === "GITHUB_REPO"
                    ? "GitHub Repository"
                    : "ZIP File Archive"
                }}
              </span>
              <span class="meta-time"
                >Concluido: {{ formatTimestamp(report.timestamp) }}</span
              >
            </div>
          </div>
          <button type="button" class="btn-new-analysis" (click)="onResetAll()">
            + Evaluar otro repositorio
          </button>
        </div>

        <!-- 1. Resumen Funcional & Ficha Técnica -->
        <app-summary-card [report]="report"></app-summary-card>

        <!-- 2. Stack Tecnológico & Métricas de Archivos -->
        <app-tech-stack-view
          [stack]="report.technologyStack"
          [extensionCounts]="report.extensionCounts"
        >
        </app-tech-stack-view>

        <!-- 3. Relaciones y Evidencias de Arquitectura -->
        <app-architecture-evidence
          [evidence]="report.architectureEvidence"
        ></app-architecture-evidence>

        <!-- 4. Catálogo de Componentes Identificados -->
        <app-components-catalog
          [analysis]="report.componentAnalysis"
        ></app-components-catalog>

        <!-- 5. Informe de Síntesis IA (Ollama Markdown Renderizado) -->
        <app-ai-synthesis-view
          [synthesis]="report.aiSynthesis"
          [aiModelUsed]="report.aiModelUsed"
        >
        </app-ai-synthesis-view>

        <!-- 6. Inspector de Prompts (Sección para Desarrolladores) -->
        <app-prompt-inspector
          [context]="report.analysisContext"
        ></app-prompt-inspector>
      </div>
    </div>
  `,
  styles: [
    `
      .page-layout {
        display: flex;
        flex-direction: column;
        gap: 28px;
      }
      .page-intro {
        margin-bottom: 4px;
      }
      .title-with-badge {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .intro-title {
        font-size: 1.8rem;
        font-weight: 800;
        color: var(--text-main);
        margin: 0;
      }
      .intro-desc {
        font-size: 0.95rem;
        color: var(--text-muted);
        margin-top: 8px;
        max-width: 860px;
        line-height: 1.5;
      }
      .error-banner {
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        border: 1px solid rgba(239, 68, 68, 0.4);
        background: rgba(239, 68, 68, 0.1);
        border-radius: var(--radius-sm);
      }
      .error-icon {
        color: var(--danger);
        flex-shrink: 0;
      }
      .error-content {
        flex: 1;
      }
      .error-title {
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--danger);
        margin: 0 0 2px 0;
      }
      .error-message {
        font-size: 0.85rem;
        color: var(--text-main);
        margin: 0;
      }
      .error-dismiss {
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-muted);
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 0.75rem;
        cursor: pointer;
      }
      .loader-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 32px 0;
      }
      .pipeline-legend {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      .legend-title {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text-muted);
      }
      .stages-pills {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }
      .stage-pill {
        font-size: 0.75rem;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 999px;
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        color: var(--text-muted);
      }
      .stage-pill.ai {
        background: rgba(139, 92, 246, 0.15);
        color: #8b5cf6;
        border-color: rgba(139, 92, 246, 0.3);
        font-weight: 700;
      }
      .results-dashboard {
        display: flex;
        flex-direction: column;
        gap: 24px;
        animation: fadeIn 0.4s ease-out;
      }
      .dashboard-header {
        padding: 20px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }
      .repo-name {
        font-size: 1.3rem;
        font-weight: 800;
        color: var(--text-main);
        margin: 0 0 6px 0;
      }
      .repo-meta {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .meta-badge {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 4px;
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
      }
      .meta-badge.git {
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
      }
      .meta-time {
        font-size: 0.8rem;
        color: var(--text-muted);
      }
      .btn-new-analysis {
        background: var(--primary);
        color: #ffffff;
        border: 1px solid var(--primary);
        padding: 8px 16px;
        border-radius: var(--radius-sm);
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .btn-new-analysis:hover {
        box-shadow: var(--shadow-glow);
        transform: translateY(-1px);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class CodeAnalysisPageComponent {
  readonly facade = inject(CodeAnalysisFacade);
  @ViewChild("analysisInput") analysisInputComponent?: AnalysisInputComponent;

  onAnalyzeGithub(event: { repoUrl: string; projectKey?: string }): void {
    this.facade.analyzeGithubRepo(event.repoUrl, event.projectKey);
  }

  onAnalyzeZip(event: { file: File; projectKey?: string }): void {
    this.facade.analyzeZipFile(event.file, event.projectKey);
  }

  onResetAll(): void {
    this.facade.reset();
    if (this.analysisInputComponent) {
      this.analysisInputComponent.clearForm();
    }
  }

  formatTimestamp(ts: string): string {
    if (!ts) return "";
    try {
      const d = new Date(ts);
      return d.toLocaleString("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return ts;
    }
  }
}
