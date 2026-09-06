import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ComponentAnalysisResult,
  DetectedComponent,
} from "../../models/analysis-response.model";

@Component({
  selector: "app-components-catalog",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="components-card glass-card" *ngIf="analysis">
      <div class="card-header">
        <h3 class="card-title">
          🧩 Catálogo de Componentes Identificados ({{
            analysis.totalComponents
          }})
        </h3>
        <p class="card-subtitle">
          Clases y componentes detectados por estereotipo de arquitectura
        </p>
      </div>

      <!-- Filtro rápido por estereotipo -->
      <div class="stereotype-counts" *ngIf="stereotypeKeys.length">
        <button
          type="button"
          class="count-badge"
          [class.active]="selectedStereotype === null"
          (click)="selectStereotype(null)"
        >
          Todos ({{ analysis.totalComponents }})
        </button>
        <button
          *ngFor="let st of stereotypeKeys"
          type="button"
          class="count-badge"
          [class.active]="selectedStereotype === st"
          (click)="selectStereotype(st)"
        >
          {{ st }}: {{ analysis.componentCounts[st] }}
        </button>
      </div>

      <!-- Tabla de componentes -->
      <div class="table-responsive" *ngIf="filteredComponents.length">
        <table class="components-table">
          <thead>
            <tr>
              <th>Nombre de Componente</th>
              <th>Estereotipo</th>
              <th>Ruta Relativa</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let comp of filteredComponents">
              <td class="comp-name">
                <code>{{ comp.name }}</code>
              </td>
              <td>
                <span
                  class="stereotype-tag"
                  [ngClass]="getStereotypeClass(comp.type)"
                >
                  {{ comp.type }}
                </span>
              </td>
              <td class="comp-path" [title]="comp.relativePath">
                <code>{{ comp.relativePath }}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!filteredComponents.length" class="empty-table">
        No se encontraron componentes para el estereotipo seleccionado.
      </div>
    </div>
  `,
  styles: [
    `
      .components-card {
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
      .card-subtitle {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 4px;
      }
      .stereotype-counts {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .count-badge {
        padding: 6px 12px;
        border-radius: var(--radius-sm);
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        color: var(--text-muted);
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .count-badge:hover {
        background: var(--bg-hover);
        color: var(--text-main);
      }
      .count-badge.active {
        background: var(--primary-bg-subtle);
        color: var(--primary);
        border-color: var(--primary-border);
      }
      .table-responsive {
        overflow-x: auto;
      }
      .components-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
        text-align: left;
      }
      .components-table th,
      .components-table td {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-color);
      }
      .components-table th {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--text-muted);
        background: var(--bg-input);
      }
      .comp-name {
        font-weight: 700;
        color: var(--text-main);
      }
      .comp-path {
        font-size: 0.85rem;
        color: var(--text-muted);
        max-width: 320px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .stereotype-tag {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
      }
      .st-controller {
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
      }
      .st-service {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
      }
      .st-repository {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
      }
      .st-component {
        background: rgba(139, 92, 246, 0.2);
        color: #8b5cf6;
      }
      .st-config {
        background: rgba(236, 72, 153, 0.2);
        color: #ec4899;
      }
      .st-default {
        background: var(--bg-hover);
        color: var(--text-muted);
      }

      .empty-table {
        padding: 24px;
        text-align: center;
        color: var(--text-muted);
        font-style: italic;
      }
    `,
  ],
})
export class ComponentsCatalogComponent {
  @Input() analysis: ComponentAnalysisResult | null = null;
  selectedStereotype: string | null = null;

  get stereotypeKeys(): string[] {
    return this.analysis?.componentCounts
      ? Object.keys(this.analysis.componentCounts)
      : [];
  }

  get filteredComponents(): DetectedComponent[] {
    if (!this.analysis || !this.analysis.components) return [];
    if (!this.selectedStereotype) return this.analysis.components;
    return this.analysis.components.filter(
      (c) => c.type === this.selectedStereotype,
    );
  }

  selectStereotype(stereotype: string | null): void {
    this.selectedStereotype = stereotype;
  }

  getStereotypeClass(type: string): string {
    switch (type.toUpperCase()) {
      case "CONTROLLER":
      case "RESTCONTROLLER":
        return "st-controller";
      case "SERVICE":
        return "st-service";
      case "REPOSITORY":
        return "st-repository";
      case "COMPONENT":
        return "st-component";
      case "CONFIGURATION":
        return "st-config";
      default:
        return "st-default";
    }
  }
}
