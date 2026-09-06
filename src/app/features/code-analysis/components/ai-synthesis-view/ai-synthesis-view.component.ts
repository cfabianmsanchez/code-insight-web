import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

interface SynthesisSection {
  type: "h2" | "h3" | "p" | "ul";
  content: string;
  items?: string[];
}

@Component({
  selector: "app-ai-synthesis-view",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="synthesis-card glass-card" *ngIf="synthesis">
      <div class="card-header">
        <div class="header-title-box">
          <div class="header-badges">
            <span class="ai-badge">🦙 Ollama Local LLM</span>
            <span class="provenance-badge" *ngIf="aiModelUsed">
              Modelo utilizado: <strong>{{ aiModelUsed }}</strong>
            </span>
          </div>
          <h3 class="card-title">Informe Técnico de Síntesis Arquitectónica</h3>
        </div>
      </div>

      <div class="synthesis-formatted-body">
        <ng-container *ngFor="let sec of formattedSections">
          <h2 *ngIf="sec.type === 'h2'" class="synth-h2">{{ sec.content }}</h2>
          <h3 *ngIf="sec.type === 'h3'" class="synth-h3">{{ sec.content }}</h3>
          <p
            *ngIf="sec.type === 'p'"
            class="synth-p"
            [innerHTML]="parseBold(sec.content)"
          ></p>
          <ul *ngIf="sec.type === 'ul'" class="synth-ul">
            <li
              *ngFor="let item of sec.items"
              [innerHTML]="parseBold(item)"
            ></li>
          </ul>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .synthesis-card {
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .card-header {
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 16px;
      }
      .header-title-box {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .header-badges {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .ai-badge {
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #8b5cf6;
        background: rgba(139, 92, 246, 0.15);
        border: 1px solid rgba(139, 92, 246, 0.3);
        padding: 3px 10px;
        border-radius: 999px;
        width: fit-content;
      }
      .provenance-badge {
        font-size: 0.76rem;
        color: var(--text-muted);
        background: rgba(255, 255, 255, 0.06);
        padding: 3px 10px;
        border-radius: 999px;
        border: 1px solid var(--border-color);
      }
      .provenance-badge strong {
        color: var(--primary);
      }
      .card-title {
        font-size: 1.25rem;
        font-weight: 800;
        color: var(--text-main);
      }
      .synthesis-formatted-body {
        background: var(--bg-input);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        line-height: 1.65;
        color: var(--text-main);
        font-size: 0.93rem;
      }
      .synth-h2 {
        font-size: 1.1rem;
        font-weight: 800;
        color: #38bdf8;
        margin-top: 14px;
        margin-bottom: 4px;
        border-bottom: 1px dashed rgba(56, 189, 248, 0.2);
        padding-bottom: 4px;
      }
      .synth-h3 {
        font-size: 0.98rem;
        font-weight: 700;
        color: #a78bfa;
        margin-top: 8px;
      }
      .synth-p {
        margin: 0;
      }
      .synth-ul {
        margin: 0;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .synth-ul li {
        list-style-type: disc;
      }
      ::ng-deep .synth-p strong,
      ::ng-deep .synth-ul strong {
        color: #f8fafc;
        font-weight: 700;
      }
      ::ng-deep .synth-p code,
      ::ng-deep .synth-ul code {
        background: rgba(255, 255, 255, 0.1);
        color: #38bdf8;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class AiSynthesisViewComponent {
  @Input() synthesis = "";
  @Input() aiModelUsed?: string;

  get formattedSections(): SynthesisSection[] {
    if (!this.synthesis) return [];
    const lines = this.synthesis.split("\n");
    const sections: SynthesisSection[] = [];
    let currentList: string[] | null = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        if (currentList && currentList.length > 0) {
          sections.push({ type: "ul", content: "", items: currentList });
          currentList = null;
        }
        continue;
      }

      if (line.startsWith("## ")) {
        if (currentList && currentList.length > 0) {
          sections.push({ type: "ul", content: "", items: currentList });
          currentList = null;
        }
        sections.push({ type: "h2", content: line.replace(/^##\s+/, "") });
      } else if (line.startsWith("### ")) {
        if (currentList && currentList.length > 0) {
          sections.push({ type: "ul", content: "", items: currentList });
          currentList = null;
        }
        sections.push({ type: "h3", content: line.replace(/^###\s+/, "") });
      } else if (
        line.startsWith("- ") ||
        line.startsWith("* ") ||
        /^\d+\.\s/.test(line)
      ) {
        const itemText = line.replace(/^(-\s*|\*\s*|\d+\.\s*)/, "");
        if (!currentList) currentList = [];
        currentList.push(itemText);
      } else {
        if (currentList && currentList.length > 0) {
          sections.push({ type: "ul", content: "", items: currentList });
          currentList = null;
        }
        sections.push({ type: "p", content: line });
      }
    }

    if (currentList && currentList.length > 0) {
      sections.push({ type: "ul", content: "", items: currentList });
    }

    return sections;
  }

  parseBold(text: string): string {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  }
}
