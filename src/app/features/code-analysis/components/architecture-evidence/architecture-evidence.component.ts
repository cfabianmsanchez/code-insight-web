import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArchitectureEvidenceResult } from "../../models/analysis-response.model";

@Component({
  selector: "app-architecture-evidence",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="arch-evidence-card glass-card" *ngIf="evidence">
      <div class="card-header">
        <div class="header-title-row">
          <h3 class="card-title">🏛️ Estructura & Relaciones Arquitectónicas</h3>
          <span class="kind-badge" *ngIf="evidence.projectKind">{{
            evidence.projectKind
          }}</span>
          <span
            class="framework-badge"
            *ngIf="
              evidence.frontendFramework &&
              evidence.frontendFramework !== 'NONE'
            "
            >{{ evidence.frontendFramework }}</span
          >
        </div>
        <p class="card-subtitle">
          Evidencias determinísticas de paquetes, puertos, adaptadores y
          prácticas de ingeniería
        </p>
      </div>

      <!-- Evidencias Específicas de Arquitectura Frontend -->
      <div
        class="frontend-box"
        *ngIf="
          evidence.projectKind !== 'BACKEND' &&
          evidence.frontendEvidenceNotes?.length
        "
      >
        <h4 class="box-subtitle">🎨 Evidencias de Arquitectura Frontend</h4>
        <div class="frontend-notes-list">
          <div
            *ngFor="let note of evidence.frontendEvidenceNotes"
            class="frontend-note-item"
          >
            <span class="note-bullet">✓</span>
            <span class="note-text">{{ note }}</span>
          </div>
        </div>
      </div>

      <!-- Inbound & Outbound Port Relations -->
      <div class="relations-grid">
        <!-- 4a. Relaciones Inbound -->
        <div class="relation-box inbound">
          <div class="box-header">
            <span class="box-badge inbound-badge">Inbound Ports</span>
            <span class="box-title"
              >Puerto de Entrada (Caso de Uso) ➔ Servicio (Implementación)</span
            >
          </div>

          <div class="relations-list" *ngIf="inboundKeys.length">
            <div *ngFor="let port of inboundKeys" class="relation-item">
              <span class="port-name">{{ port }}</span>
              <span class="relation-arrow">➔ implementado por</span>
              <span class="impl-name">{{
                evidence.inboundPortImplementations[port]
              }}</span>
            </div>
          </div>
          <div *ngIf="!inboundKeys.length" class="empty-state">
            No se observaron implementaciones de puertos inbound explícitas.
          </div>
        </div>

        <!-- 4b. Relaciones Outbound -->
        <div class="relation-box outbound">
          <div class="box-header">
            <span class="box-badge outbound-badge">Outbound Adapters</span>
            <span class="box-title"
              >Adaptador (Infraestructura) ➔ Puerto de Salida</span
            >
          </div>

          <div class="relations-list" *ngIf="outboundKeys.length">
            <div *ngFor="let adapter of outboundKeys" class="relation-item">
              <span class="impl-name">{{ adapter }}</span>
              <span class="relation-arrow">➔ implementa</span>
              <span class="port-name">{{
                evidence.outboundAdapterImplementations[adapter]
              }}</span>
            </div>
          </div>
          <div *ngIf="!outboundKeys.length" class="empty-state">
            No se observaron adaptadores outbound explícitos.
          </div>
        </div>
      </div>

      <!-- 4c. Evidencias de Prácticas de Ingeniería -->
      <div class="engineering-box" *ngIf="evidence.engineeringEvidence">
        <h4 class="box-subtitle">🛡️ Prácticas de Ingeniería Observadas</h4>
        <div class="engineering-grid">
          <div class="eng-item">
            <span class="eng-label">Tests Detectados (Multiplataforma)</span>
            <span
              class="eng-val"
              [class.positive]="
                evidence.engineeringEvidence.testFilesDetected > 0
              "
            >
              {{ evidence.engineeringEvidence.testFilesDetected }} archivos
            </span>
          </div>

          <div
            class="eng-item"
            *ngIf="evidence.engineeringEvidence.testDirectories?.length"
          >
            <span class="eng-label">Directorios de Test</span>
            <span class="eng-val">{{
              evidence.engineeringEvidence.testDirectories.join(", ")
            }}</span>
          </div>

          <div class="eng-item" *ngIf="evidence.engineeringEvidence.testScript">
            <span class="eng-label">Script de Test (package.json)</span>
            <span class="eng-val code"
              ><code>{{ evidence.engineeringEvidence.testScript }}</code></span
            >
          </div>

          <div
            class="eng-item"
            *ngIf="evidence.engineeringEvidence.springConfigurationDetected"
          >
            <span class="eng-label"
              >Inyección de Dependencias (&#64;Configuration)</span
            >
            <span class="eng-val positive">DETECTADA</span>
          </div>

          <div
            class="eng-item"
            *ngIf="evidence.engineeringEvidence.beanDefinitions > 0"
          >
            <span class="eng-label">Definiciones &#64;Bean</span>
            <span class="eng-val"
              >{{ evidence.engineeringEvidence.beanDefinitions }} beans</span
            >
          </div>

          <div
            class="eng-item"
            *ngIf="evidence.engineeringEvidence.constructorInjectionDetected"
          >
            <span class="eng-label">Inyección por Constructor</span>
            <span class="eng-val positive">DETECTADA</span>
          </div>
        </div>
      </div>

      <!-- Distribución de Paquetes -->
      <div class="package-distribution" *ngIf="packageKeys.length">
        <span class="box-subtitle"
          >Distribución de Componentes por Capa / Paquete</span
        >
        <div class="packages-list">
          <div *ngFor="let pkg of packageKeys" class="package-tag">
            <span class="pkg-name">{{ pkg }}</span>
            <span class="pkg-count">{{
              evidence.packageComponentDistribution[pkg]
            }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .arch-evidence-card {
        padding: 28px 32px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .card-header {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .header-title-row {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .card-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .card-subtitle {
        font-size: 0.88rem;
        color: var(--text-muted);
      }
      .kind-badge {
        font-size: 0.72rem;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 6px;
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.3);
        letter-spacing: 0.05em;
      }
      .framework-badge {
        font-size: 0.72rem;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 6px;
        background: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.3);
        letter-spacing: 0.05em;
      }
      .frontend-box {
        background: rgba(15, 23, 42, 0.65);
        padding: 20px 24px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .frontend-notes-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .frontend-note-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 0.88rem;
        color: var(--text-main);
        background: rgba(255, 255, 255, 0.03);
        padding: 10px 14px;
        border-radius: var(--radius-sm);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      .note-bullet {
        color: var(--success);
        font-weight: 800;
        margin-top: 1px;
      }
      .note-text {
        line-height: 1.45;
      }
      .relations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 20px;
      }
      .relation-box {
        padding: 20px 24px;
        border-radius: var(--radius-md);
        background: rgba(15, 23, 42, 0.65);
        border: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .box-header {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .box-badge {
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        width: fit-content;
        padding: 3px 10px;
        border-radius: 4px;
      }
      .inbound-badge {
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
        border: 1px solid rgba(59, 130, 246, 0.3);
      }
      .outbound-badge {
        background: rgba(168, 85, 247, 0.2);
        color: #a855f7;
        border: 1px solid rgba(168, 85, 247, 0.3);
      }

      .box-title {
        font-size: 0.88rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .relations-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .relation-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        font-size: 0.85rem;
        background: rgba(255, 255, 255, 0.03);
        padding: 10px 14px;
        border-radius: var(--radius-sm);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      .impl-name {
        font-weight: 700;
        color: var(--text-main);
      }
      .relation-arrow {
        font-size: 0.75rem;
        color: var(--text-muted);
      }
      .port-name {
        font-weight: 600;
        color: var(--primary);
      }

      .empty-state {
        font-size: 0.85rem;
        color: var(--text-muted);
        font-style: italic;
        padding: 8px 0;
      }

      .engineering-box,
      .package-distribution {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 20px 24px;
        border-radius: var(--radius-md);
        background: rgba(15, 23, 42, 0.65);
        border: 1px solid var(--border-color);
      }
      .box-subtitle {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .engineering-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 14px;
      }
      .eng-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
        background: rgba(255, 255, 255, 0.03);
        padding: 12px 16px;
        border-radius: var(--radius-sm);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      .eng-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-muted);
      }
      .eng-val {
        font-size: 0.92rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .eng-val.positive {
        color: var(--success);
      }

      .packages-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .package-tag {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: var(--radius-sm);
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        font-size: 0.85rem;
      }
      .pkg-name {
        font-weight: 600;
        color: var(--text-main);
      }
      .pkg-count {
        font-weight: 700;
        color: var(--primary);
      }
    `,
  ],
})
export class ArchitectureEvidenceComponent {
  @Input() evidence: ArchitectureEvidenceResult | null = null;

  get inboundKeys(): string[] {
    return this.evidence?.inboundPortImplementations
      ? Object.keys(this.evidence.inboundPortImplementations)
      : [];
  }

  get outboundKeys(): string[] {
    return this.evidence?.outboundAdapterImplementations
      ? Object.keys(this.evidence.outboundAdapterImplementations)
      : [];
  }

  get packageKeys(): string[] {
    return this.evidence?.packageComponentDistribution
      ? Object.keys(this.evidence.packageComponentDistribution)
      : [];
  }
}
