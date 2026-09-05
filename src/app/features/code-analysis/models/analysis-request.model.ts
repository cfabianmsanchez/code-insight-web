export interface CodeAnalysisRequestDto {
  projectKey: string;
  sourceCode: string;
  type: 'JAVA' | 'PYTHON' | 'GENERIC';
  metadata?: Record<string, any>;
}
