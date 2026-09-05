import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodeAnalysisRequestDto } from '../../models/analysis-request.model';

@Component({
  selector: 'app-code-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-card code-input-card">
      <div class="card-header">
        <h2 class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          Ingresar Código Fuente
        </h2>
        <p class="card-subtitle">Selecciona el lenguaje para ejecutar la Estrategia de Inspección en el Backend</p>
      </div>

      <form (ngSubmit)="onSubmit()" class="input-form">
        <div class="form-row">
          <div class="form-group flex-1">
            <label for="projectKey">Nombre del Proyecto</label>
            <input
              type="text"
              id="projectKey"
              [(ngModel)]="projectKey"
              name="projectKey"
              placeholder="ej: my-awesome-service"
              required
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="analysisType">Tipo de Análisis (Strategy)</label>
            <select
              id="analysisType"
              [(ngModel)]="selectedType"
              name="selectedType"
              class="form-control select-control"
            >
              <option value="JAVA">Java 17 (Strategy)</option>
              <option value="PYTHON">Python 3.x (Strategy)</option>
              <option value="GENERIC">Genérico (Strategy)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="sourceCode">Código a Inspeccionar</label>
          <textarea
            id="sourceCode"
            [(ngModel)]="sourceCode"
            name="sourceCode"
            rows="10"
            placeholder="// Pega tu código Java o Python aquí..."
            required
            class="form-control code-editor"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" (click)="loadSampleJava()" class="btn-sample">
            Cargar Ejemplo Java
          </button>
          <button type="button" (click)="loadSamplePython()" class="btn-sample">
            Cargar Ejemplo Python
          </button>
          <button type="submit" class="btn-primary" [disabled]="!sourceCode.trim() || !projectKey.trim()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
            Analizar con Strategy Pattern
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .code-input-card {
      padding: 28px;
    }

    .card-header {
      margin-bottom: 24px;
    }

    .card-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .card-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .input-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .flex-1 { flex: 1; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-control {
      background: rgba(11, 15, 25, 0.6);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      color: var(--text-main);
      font-family: var(--font-body);
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }

    .select-control {
      cursor: pointer;
      min-width: 200px;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 12px var(--primary-glow);
    }

    .code-editor {
      font-family: var(--font-code);
      font-size: 0.9rem;
      line-height: 1.5;
      resize: vertical;
      tab-size: 2;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }

    .btn-sample {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 10px 16px;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn-sample:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-main);
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }
      .form-actions {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class CodeInputComponent {
  @Output() analyze = new EventEmitter<CodeAnalysisRequestDto>();

  projectKey = 'backend-service';
  selectedType: 'JAVA' | 'PYTHON' | 'GENERIC' = 'JAVA';
  sourceCode = `package com.example.service;

public class OrderProcessingService {
    public void processOrder(String orderId) {
        System.out.println("Processing order: " + orderId);
        // FIXME: add validation
    }
}`;

  loadSampleJava(): void {
    this.selectedType = 'JAVA';
    this.projectKey = 'java-code-insight';
    this.sourceCode = `package com.codeinsight.api.service;

import java.util.List;

public class PaymentProcessor {
    public void executePayment(double amount) {
        System.out.println("Processing payment of $" + amount);
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
    }
}`;
  }

  loadSamplePython(): void {
    this.selectedType = 'PYTHON';
    this.projectKey = 'python-insight-app';
    this.sourceCode = `def calculate_metrics(data_points):
    total = 0
    try:
        for point in data_points:
            total += eval(point)
    except:
        print("Error processing point")
    return total`;
  }

  onSubmit(): void {
    if (!this.sourceCode.trim() || !this.projectKey.trim()) return;

    this.analyze.emit({
      projectKey: this.projectKey.trim(),
      sourceCode: this.sourceCode,
      type: this.selectedType
    });
  }
}
