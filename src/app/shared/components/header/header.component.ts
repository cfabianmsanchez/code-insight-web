import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeAnalysisFacade } from '../../../features/code-analysis/facade/code-analysis.facade';

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
            <h1 class="logo-title">Code Insight</h1>
          </div>
        </div>

        <div class="ai-model-selector" [title]="facade.systemConfig() ? 'Servidor Ollama en: ' + facade.systemConfig()?.ollamaBaseUrl : 'Backend offline o consultando configuración...'">
          <span class="ai-icon">🦙</span>
          <span class="model-label">Ollama:</span>
          <select 
            class="model-dropdown" 
            [value]="facade.activeModel()" 
            (change)="onModelSelect($event)" 
            [disabled]="facade.loading() || !facade.systemConfig() || facade.availableModels().length === 0"
            aria-label="Seleccionar Modelo de IA">
            <option *ngIf="facade.availableModels().length === 0" value="">
              {{ facade.systemConfig() ? 'Sin modelos' : 'Desconectado' }}
            </option>
            <option *ngFor="let m of facade.availableModels()" [value]="m">
              {{ m }}
            </option>
          </select>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      background: rgba(11, 15, 25, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      padding: 14px 0;
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
      gap: 12px;
    }

    .logo-icon {
      width: 38px;
      height: 38px;
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
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ai-model-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.3);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.78rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .ai-model-selector:hover {
      border-color: rgba(139, 92, 246, 0.5);
      box-shadow: 0 0 12px rgba(139, 92, 246, 0.2);
    }

    .ai-icon {
      font-size: 0.95rem;
    }

    .model-label {
      font-weight: 700;
      color: #a78bfa;
      letter-spacing: 0.3px;
    }

    .model-dropdown {
      background: rgba(15, 23, 42, 0.85);
      color: var(--text-main);
      border: 1px solid rgba(139, 92, 246, 0.35);
      border-radius: 6px;
      padding: 3px 8px;
      font-size: 0.76rem;
      font-weight: 600;
      outline: none;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
    }

    .model-dropdown:focus {
      border-color: var(--primary);
      box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
    }

    .model-dropdown:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .model-dropdown option {
      background: #0f172a;
      color: #f8fafc;
      padding: 6px;
    }
  `]
})
export class HeaderComponent {
  readonly facade = inject(CodeAnalysisFacade);

  onModelSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select && select.value) {
      this.facade.selectModel(select.value);
    }
  }
}
