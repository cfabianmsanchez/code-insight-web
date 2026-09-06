import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { GithubAnalysisRequestDto } from '../models/analysis-request.model';
import { RepositoryAnalysisResponseDto } from '../models/analysis-response.model';
import { SystemConfigResponseDto } from '../models/system-config.model';

/**
 * Servicio de acceso a datos HTTP REST para comunicarse con el backend code-insight-api.
 */
@Injectable({
  providedIn: 'root'
})
export class CodeAnalysisApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/analyses`;
  private readonly configUrl = `${environment.apiUrl}/config`;

  /**
   * Consulta la configuración activa del backend (modelo de IA, URL base, versión de prompts y modelos disponibles).
   */
  getSystemConfig(): Observable<SystemConfigResponseDto> {
    return this.http.get<SystemConfigResponseDto>(this.configUrl);
  }

  /**
   * Actualiza el modelo de IA activo en el backend.
   */
  updateActiveModel(model: string): Observable<SystemConfigResponseDto> {
    return this.http.put<SystemConfigResponseDto>(`${this.configUrl}/model`, { model });
  }

  /**
   * Envía una solicitud de análisis de repositorio público de GitHub.
   */
  analyzeGithubRepo(dto: GithubAnalysisRequestDto): Observable<RepositoryAnalysisResponseDto> {
    return this.http.post<RepositoryAnalysisResponseDto>(`${this.baseUrl}/github`, dto);
  }

  /**
   * Envía un archivo ZIP para extracción y análisis efímero.
   */
  analyzeZipFile(file: File, projectKey?: string): Observable<RepositoryAnalysisResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
    if (projectKey && projectKey.trim().length > 0) {
      formData.append('projectKey', projectKey);
    }
    return this.http.post<RepositoryAnalysisResponseDto>(`${this.baseUrl}/zip`, formData);
  }
}
