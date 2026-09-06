export interface GithubAnalysisRequestDto {
  projectKey: string;
  repoUrl: string;
}

export interface ZipAnalysisRequest {
  file: File;
  projectKey?: string;
}
