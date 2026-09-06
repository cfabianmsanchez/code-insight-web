import { Component, EventEmitter, Output, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

export type InputMode = "GITHUB" | "ZIP";

@Component({
  selector: "app-analysis-input",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-card glass-card">
      <div class="card-header">
        <h3 class="card-title">Seleccionar Origen del Repositorio</h3>
        <p class="card-subtitle">
          Ingresa la URL pública de GitHub o sube un paquete comprimido .ZIP
        </p>
      </div>

      <!-- Mode Selector Tabs -->
      <div class="tabs-container">
        <button
          type="button"
          class="tab-btn"
          [class.active]="mode === 'GITHUB'"
          (click)="setMode('GITHUB')"
          [disabled]="loading"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
            ></path>
          </svg>
          Repositorio GitHub
        </button>
        <button
          type="button"
          class="tab-btn"
          [class.active]="mode === 'ZIP'"
          (click)="setMode('ZIP')"
          [disabled]="loading"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
            ></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          Archivo .ZIP
        </button>
      </div>

      <!-- Mode 1: GitHub URL Form -->
      <form
        *ngIf="mode === 'GITHUB'"
        (ngSubmit)="submitGithub()"
        class="input-form"
      >
        <div class="form-row">
          <div class="form-group flex-2">
            <label class="form-label"
              >URL del repositorio público de GitHub</label
            >
            <input
              type="url"
              class="form-control"
              placeholder="https://github.com/owner/repository"
              [(ngModel)]="githubUrl"
              name="githubUrl"
              required
              [disabled]="loading"
            />
          </div>

          <div class="form-group flex-1">
            <label class="form-label"
              >Identificador del análisis (opcional)</label
            >
            <input
              type="text"
              class="form-control"
              placeholder="ej. code-insight-api"
              [(ngModel)]="githubProjectKey"
              name="githubProjectKey"
              [disabled]="loading"
            />
            <span class="form-help"
              >Se usará como identificador del reporte</span
            >
          </div>
        </div>

        <div class="form-actions">
          <button
            type="button"
            class="btn btn-secondary"
            (click)="clearForm()"
            [disabled]="loading || (!githubUrl && !githubProjectKey)"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 6h18"></path>
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              ></path>
            </svg>
            <span>Limpiar</span>
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="loading || !githubUrl"
          >
            <span>▶ Analizar Repositorio</span>
          </button>
        </div>
      </form>

      <!-- Mode 2: File ZIP Form -->
      <form *ngIf="mode === 'ZIP'" (ngSubmit)="submitZip()" class="input-form">
        <div class="form-row">
          <div class="form-group flex-2">
            <label class="form-label">Seleccionar Archivo .ZIP</label>
            <div class="file-dropzone" [class.has-file]="selectedFile">
              <input
                *ngIf="!selectedFile"
                type="file"
                accept=".zip"
                (change)="onFileSelected($event)"
                class="file-input"
                #fileInput
                [disabled]="loading"
              />
              <div class="dropzone-content" *ngIf="!selectedFile">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span class="dropzone-text"
                  >Haz clic o arrastra un archivo .ZIP aquí</span
                >
              </div>
              <div class="file-selected-box" *ngIf="selectedFile">
                <div class="file-icon-check">✓</div>
                <div class="file-details">
                  <span class="file-name">{{ selectedFile.name }}</span>
                  <span class="file-size">{{
                    formatFileSize(selectedFile.size)
                  }}</span>
                </div>
                <button
                  type="button"
                  class="btn-change-file"
                  (click)="clearSelectedFile($event)"
                  [disabled]="loading"
                >
                  Cambiar archivo
                </button>
              </div>
            </div>
          </div>

          <div class="form-group flex-1">
            <label class="form-label"
              >Identificador del análisis (opcional)</label
            >
            <input
              type="text"
              class="form-control"
              placeholder="ej. proyecto-zip"
              [(ngModel)]="zipProjectKey"
              name="zipProjectKey"
              [disabled]="loading"
            />
            <span class="form-help"
              >Se usará como identificador del reporte</span
            >
          </div>
        </div>

        <div class="form-actions">
          <button
            type="button"
            class="btn btn-secondary"
            (click)="clearForm()"
            [disabled]="loading || (!selectedFile && !zipProjectKey)"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 6h18"></path>
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              ></path>
            </svg>
            <span>Limpiar</span>
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="loading || !selectedFile"
          >
            <span>▶ Analizar Archivo ZIP</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .input-card {
        padding: 24px;
      }
      .card-header {
        margin-bottom: 20px;
      }
      .card-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .card-subtitle {
        font-size: 0.9rem;
        color: var(--text-muted);
        margin-top: 4px;
      }
      .tabs-container {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 12px;
      }
      .tab-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: var(--radius-sm);
        background: transparent;
        border: 1px solid transparent;
        color: var(--text-muted);
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .tab-btn:hover:not(:disabled) {
        color: var(--text-main);
        background: var(--bg-hover);
      }
      .tab-btn.active {
        background: var(--primary-bg-subtle);
        color: var(--primary);
        border-color: var(--primary-border);
      }
      .input-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .form-row {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
      }
      .flex-1 {
        flex: 1;
        min-width: 240px;
      }
      .flex-2 {
        flex: 2;
        min-width: 320px;
      }
      .form-help {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-top: 2px;
      }
      .form-control {
        width: 100%;
        padding: 12px 16px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
        background: var(--bg-input);
        color: var(--text-main);
        font-size: 0.95rem;
        transition: border-color 0.2s ease;
      }
      .form-control:focus {
        outline: none;
        border-color: var(--primary);
      }
      .file-dropzone {
        position: relative;
        border: 2px dashed var(--border-color);
        border-radius: var(--radius-sm);
        padding: 16px;
        text-align: center;
        background: var(--bg-input);
        transition: all 0.2s ease;
      }
      .file-dropzone.has-file {
        border-color: rgba(52, 211, 153, 0.5);
        background: rgba(52, 211, 153, 0.05);
      }
      .file-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
      .dropzone-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        color: var(--text-muted);
      }
      .file-selected-box {
        display: flex;
        align-items: center;
        gap: 12px;
        justify-content: space-between;
        padding: 4px 8px;
      }
      .file-icon-check {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(52, 211, 153, 0.2);
        color: var(--success);
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
      }
      .file-details {
        display: flex;
        flex-direction: column;
        text-align: left;
        flex: 1;
      }
      .file-name {
        font-weight: 700;
        color: var(--text-main);
        font-size: 0.9rem;
      }
      .file-size {
        font-size: 0.78rem;
        color: var(--text-muted);
      }
      .btn-change-file {
        background: var(--bg-hover);
        border: 1px solid var(--border-color);
        color: var(--primary);
        padding: 6px 12px;
        border-radius: var(--radius-sm);
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        z-index: 2;
      }
      .btn-change-file:hover:not(:disabled) {
        background: var(--primary-bg-subtle);
        border-color: var(--primary-border);
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: var(--radius-sm);
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        border: none;
        transition: all 0.25s ease;
      }
      .btn-secondary {
        background: var(--bg-hover);
        color: var(--text-muted);
        border: 1px solid var(--border-color);
      }
      .btn-secondary:hover:not(:disabled) {
        background: rgba(239, 68, 68, 0.15);
        color: var(--danger);
        border-color: rgba(239, 68, 68, 0.3);
      }
      .btn-secondary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class AnalysisInputComponent {
  @Input() loading = false;
  @Output() analyzeGithub = new EventEmitter<{
    repoUrl: string;
    projectKey?: string;
  }>();
  @Output() analyzeZip = new EventEmitter<{
    file: File;
    projectKey?: string;
  }>();
  @Output() clear = new EventEmitter<void>();

  mode: InputMode = "GITHUB";
  githubUrl = "";
  githubProjectKey = "";
  zipProjectKey = "";
  selectedFile: File | null = null;

  setMode(newMode: InputMode): void {
    this.mode = newMode;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  clearSelectedFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
  }

  submitGithub(): void {
    if (this.githubUrl && this.githubUrl.trim().length > 0) {
      this.analyzeGithub.emit({
        repoUrl: this.githubUrl.trim(),
        projectKey: this.githubProjectKey.trim() || undefined,
      });
    }
  }

  submitZip(): void {
    if (this.selectedFile) {
      this.analyzeZip.emit({
        file: this.selectedFile,
        projectKey: this.zipProjectKey.trim() || undefined,
      });
    }
  }

  clearForm(): void {
    this.githubUrl = "";
    this.githubProjectKey = "";
    this.zipProjectKey = "";
    this.selectedFile = null;
    this.clear.emit();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}
