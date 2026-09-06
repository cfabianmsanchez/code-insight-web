import { Injectable, inject, signal, computed } from '@angular/core';
import { CodeAnalysisApiService } from '../data-access/code-analysis-api.service';
import { GithubAnalysisRequestDto } from '../models/analysis-request.model';
import { RepositoryAnalysisResponseDto } from '../models/analysis-response.model';

import { SystemConfigResponseDto } from '../models/system-config.model';

export type AnalysisStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

/**
 * Fachada (Facade Pattern) para la gestión del estado reactivo de análisis de código.
 * Utiliza Angular Signals para exponer un estado inmutable y reactivo a los componentes de UI.
 */
@Injectable({
  providedIn: 'root'
})
export class CodeAnalysisFacade {
  private readonly apiService = inject(CodeAnalysisApiService);

  // Estados reactivos internos mediante Signals
  private readonly _status = signal<AnalysisStatus>('IDLE');
  private readonly _result = signal<RepositoryAnalysisResponseDto | null>(null);
  private readonly _error = signal<string | null>(null);
  private readonly _lastSourceType = signal<'GITHUB' | 'ZIP' | null>(null);
  private readonly _systemConfig = signal<SystemConfigResponseDto | null>(null);

  // Signals públicos de solo lectura para componentes de UI
  readonly status = this._status.asReadonly();
  readonly result = this._result.asReadonly();
  readonly error = this._error.asReadonly();
  readonly lastSourceType = this._lastSourceType.asReadonly();
  readonly systemConfig = this._systemConfig.asReadonly();

  // Signals computados
  readonly loading = computed(() => this._status() === 'LOADING');
  readonly hasReport = computed(() => this._status() === 'SUCCESS' && this._result() !== null);
  readonly activeModel = computed(() => this._systemConfig()?.ollamaModel || '');
  readonly availableModels = computed(() => this._systemConfig()?.availableModels ?? []);

  constructor() {
    this.loadSystemConfig();
  }

  /**
   * Carga la configuración activa del backend (modelo de IA, URL base, versión de prompts y modelos disponibles).
   */
  loadSystemConfig(): void {
    this.apiService.getSystemConfig().subscribe({
      next: (config) => this._systemConfig.set(config),
      error: () => {} // Si el backend está desconectado en inicio, falla silenciosamente
    });
  }

  /**
   * Cambia el modelo de IA activo utilizado por el backend.
   */
  selectModel(modelName: string): void {
    if (!modelName || modelName.trim() === '') return;
    this.apiService.updateActiveModel(modelName.trim()).subscribe({
      next: (config) => this._systemConfig.set(config),
      error: (err) => console.error('Error al actualizar el modelo de IA en el backend:', err)
    });
  }

  /**
   * Ejecuta el análisis de un repositorio GitHub.
   */
  analyzeGithubRepo(repoUrl: string, projectKey?: string): void {
    if (!repoUrl || repoUrl.trim().length === 0) {
      this._error.set('Por favor ingresa una URL válida de repositorio GitHub.');
      return;
    }

    const calculatedKey = (projectKey && projectKey.trim().length > 0)
      ? projectKey.trim()
      : this.extractKeyFromUrl(repoUrl);

    const dto: GithubAnalysisRequestDto = {
      projectKey: calculatedKey,
      repoUrl: repoUrl.trim()
    };

    this._status.set('LOADING');
    this._error.set(null);
    this._lastSourceType.set('GITHUB');

    this.apiService.analyzeGithubRepo(dto).subscribe({
      next: (response) => {
        this._result.set(response);
        this._status.set('SUCCESS');
      },
      error: (err) => {
        const errorMsg = err?.error?.detail || err?.error?.message || err?.message || 'Error al conectar con la API de análisis.';
        this._error.set(errorMsg);
        this._status.set('ERROR');
      }
    });
  }

  /**
   * Ejecuta el análisis de un archivo .ZIP subido.
   */
  analyzeZipFile(file: File, projectKey?: string): void {
    if (!file) {
      this._error.set('Por favor selecciona un archivo ZIP válido.');
      return;
    }

    const calculatedKey = (projectKey && projectKey.trim().length > 0)
      ? projectKey.trim()
      : file.name.replace(/\.zip$/i, '');

    this._status.set('LOADING');
    this._error.set(null);
    this._lastSourceType.set('ZIP');

    this.apiService.analyzeZipFile(file, calculatedKey).subscribe({
      next: (response) => {
        this._result.set(response);
        this._status.set('SUCCESS');
      },
      error: (err) => {
        const errorMsg = err?.error?.detail || err?.error?.message || err?.message || 'Error al procesar el archivo ZIP subido.';
        this._error.set(errorMsg);
        this._status.set('ERROR');
      }
    });
  }

  /**
   * Reinicia el estado del análisis para realizar uno nuevo.
   */
  reset(): void {
    this._status.set('IDLE');
    this._result.set(null);
    this._error.set(null);
    this._lastSourceType.set(null);
  }

  private extractKeyFromUrl(url: string): string {
    try {
      const cleanUrl = url.replace(/\.git$/, '');
      const parts = cleanUrl.split('/');
      return parts[parts.length - 1] || 'github-repo';
    } catch {
      return 'github-repo';
    }
  }
}
