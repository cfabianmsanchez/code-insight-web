import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TechnologyStack } from "../../models/analysis-response.model";

@Component({
  selector: "app-tech-stack-view",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tech-stack-card glass-card" *ngIf="stack">
      <div class="card-header">
        <h3 class="card-title">🛠️ Stack Tecnológico Detectado</h3>
      </div>

      <div class="stack-grid">
        <div class="stack-item">
          <span class="item-label">Lenguaje Principal</span>
          <span class="item-value badge language">{{
            stack.mainLanguage || "No detectado"
          }}</span>
        </div>

        <div class="stack-item">
          <span class="item-label">Framework Principal</span>
          <span class="item-value badge framework">{{
            stack.mainFramework || "No detectado"
          }}</span>
        </div>

        <div class="stack-item">
          <span class="item-label">Herramienta de Compilación</span>
          <span class="item-value badge build">{{
            stack.buildTool || "No detectada"
          }}</span>
        </div>

        <div class="stack-item">
          <span class="item-label">Bases de Datos</span>
          <div class="tags-list">
            <span *ngFor="let db of stack.databasesDetected" class="tag db">{{
              db
            }}</span>
            <span *ngIf="!stack.databasesDetected?.length" class="tag empty"
              >Ninguna observada</span
            >
          </div>
        </div>
      </div>

      <div class="libraries-section" *ngIf="stack.keyLibraries?.length">
        <span class="item-label">Librerías y Dependencias Clave</span>
        <div class="tags-list">
          <span *ngFor="let lib of stack.keyLibraries" class="tag lib">{{
            lib
          }}</span>
        </div>
      </div>

      <!-- Conteo por extensión -->
      <div
        class="extensions-section"
        *ngIf="extensionCounts && extensionCountKeys.length"
      >
        <span class="item-label">Distribución por Extensión de Archivo</span>
        <div class="extensions-list">
          <div *ngFor="let ext of extensionCountKeys" class="extension-pill">
            <span class="ext-name">{{ ext }}</span>
            <span class="ext-count">{{ extensionCounts[ext] }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .tech-stack-card {
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .card-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .stack-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
      }
      .stack-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .item-label {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--text-muted);
      }
      .badge {
        display: inline-block;
        padding: 6px 14px;
        border-radius: var(--radius-sm);
        font-weight: 700;
        font-size: 0.95rem;
        width: fit-content;
      }
      .badge.language {
        background: rgba(59, 130, 246, 0.15);
        color: #3b82f6;
      }
      .badge.framework {
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
      }
      .badge.build {
        background: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
      }

      .libraries-section,
      .extensions-section {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-top: 12px;
        border-top: 1px solid var(--border-color);
      }
      .tags-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .tag {
        padding: 4px 10px;
        border-radius: var(--radius-sm);
        font-size: 0.85rem;
        font-weight: 600;
      }
      .tag.lib {
        background: var(--bg-hover);
        color: var(--text-main);
        border: 1px solid var(--border-color);
      }
      .tag.db {
        background: rgba(139, 92, 246, 0.15);
        color: #8b5cf6;
      }
      .tag.empty {
        background: transparent;
        color: var(--text-muted);
        font-style: italic;
      }

      .extensions-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .extension-pill {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 12px;
        border-radius: 999px;
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        font-size: 0.85rem;
      }
      .ext-name {
        font-weight: 700;
        color: var(--text-main);
      }
      .ext-count {
        font-weight: 600;
        color: var(--text-muted);
      }
    `,
  ],
})
export class TechStackViewComponent {
  @Input() stack: TechnologyStack | null = null;
  @Input() extensionCounts: Record<string, number> | null = null;

  get extensionCountKeys(): string[] {
    return this.extensionCounts ? Object.keys(this.extensionCounts) : [];
  }
}
