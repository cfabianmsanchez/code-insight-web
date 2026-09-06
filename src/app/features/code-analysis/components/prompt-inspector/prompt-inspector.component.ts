import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisContext } from '../../models/analysis-response.model';

@Component({
  selector: 'app-prompt-inspector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inspector-card glass-card" *ngIf="context">
      <button type="button" class="accordion-toggle" (click)="toggleOpen()">
        <div class="toggle-title">
          <span>🔧 Inspector de Prompts (Detalles para Desarrolladores)</span>
          <span class="toggle-sub">Visualiza el contexto exacto generado y enviado al motor de IA</span>
        </div>
        <span class="chevron" [class.open]="isOpen">▼</span>
      </button>

      <div class="accordion-content" *ngIf="isOpen">
        <!-- System Prompt -->
        <div class="prompt-box">
          <div class="box-header">
            <span class="prompt-type-badge system">System Prompt (system-v1.md)</span>
            <button type="button" class="copy-btn" (click)="copyToClipboard(context.systemPrompt)">Copiar</button>
          </div>
          <pre class="prompt-code">{{ context.systemPrompt }}</pre>
        </div>

        <!-- User Prompt -->
        <div class="prompt-box">
          <div class="box-header">
            <span class="prompt-type-badge user">User Prompt & Radiografía Factual (analysis-v1.md)</span>
            <button type="button" class="copy-btn" (click)="copyToClipboard(context.userPrompt)">Copiar</button>
          </div>
          <pre class="prompt-code">{{ context.userPrompt }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inspector-card {
      padding: 16px 24px;
    }
    .accordion-toggle {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: transparent;
      border: none;
      color: var(--text-main);
      cursor: pointer;
      padding: 8px 0;
      text-align: left;
    }
    .toggle-title {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 1rem;
      font-weight: 700;
    }
    .toggle-sub {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 400;
    }
    .chevron {
      font-size: 0.8rem;
      color: var(--text-muted);
      transition: transform 0.2s ease;
    }
    .chevron.open {
      transform: rotate(180deg);
    }
    .accordion-content {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .prompt-box {
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 16px;
    }
    .box-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .prompt-type-badge {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 3px 10px;
      border-radius: 4px;
    }
    .prompt-type-badge.system { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
    .prompt-type-badge.user { background: rgba(16, 185, 129, 0.2); color: #10b981; }

    .copy-btn {
      background: var(--bg-hover);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .copy-btn:hover {
      color: var(--text-main);
    }
    .prompt-code {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: monospace;
      font-size: 0.85rem;
      color: var(--text-main);
      line-height: 1.5;
    }
  `]
})
export class PromptInspectorComponent {
  @Input() context: AnalysisContext | null | undefined = null;
  isOpen = false;

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  copyToClipboard(text: string): void {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  }
}
