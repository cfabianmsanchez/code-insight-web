import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CodeAnalysisRequestDto } from '../models/analysis-request.model';
import { CodeAnalysisResponseDto } from '../models/analysis-response.model';

@Injectable({
  providedIn: 'root'
})
export class CodeAnalysisApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/analysis`;

  analyzeCode(request: CodeAnalysisRequestDto): Observable<CodeAnalysisResponseDto> {
    return this.http.post<CodeAnalysisResponseDto>(this.baseUrl, request);
  }
}
