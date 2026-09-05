export interface CodeAnalysisResponseDto {
  id: string;
  projectKey: string;
  analysisType: 'JAVA' | 'PYTHON' | 'GENERIC';
  linesOfCode: number;
  cyclomaticComplexity: number;
  estimatedBugs: number;
  securityVulnerabilities: number;
  summary: string;
  recommendations: string[];
  metrics: Record<string, any>;
  timestamp: string;
}
