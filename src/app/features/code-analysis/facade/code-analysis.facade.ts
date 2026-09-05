import { Injectable, inject, signal, computed } from '@angular/core';
import { CodeAnalysisApiService } from '../services/code-analysis-api.service';
import { CodeAnalysisRequestDto } from '../models/analysis-request.model';
import { CodeAnalysisResponseDto } from '../models/analysis-response.model';
import { ApiErrorResponse } from '@core/models/api-error.model';

@Injectable({
  providedIn: 'root'
})
export class CodeAnalysisFacade {
  private readonly apiService = inject(CodeAnalysisApiService);

  // Private reactive state using Angular Signals
  private readonly _report = signal<CodeAnalysisResponseDto | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly Signals exposed to UI Components
  readonly report = this._report.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly hasReport = computed(() => this._report() !== null);

  /**
   * Facade entry point for analyzing code.
   * Connects UI request to backend API service and manages internal state.
   */
  analyzeCode(request: CodeAnalysisRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.apiService.analyzeCode(request).subscribe({
      next: (response) => {
        this._report.set(response);
        this._loading.set(false);
      },
      error: (err) => {
        const errorMsg = err?.error?.message || err?.message || 'Error executing code analysis request';
        this._error.set(errorMsg);
        this._loading.set(false);
      }
    });
  }

  /**
   * Reset report state
   */
  reset(): void {
    this._report.set(null);
    this._error.set(null);
    this._loading.set(false);
  }
}
