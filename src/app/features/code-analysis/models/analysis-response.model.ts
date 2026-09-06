export interface TechnologyStack {
  mainLanguage: string;
  mainFramework: string;
  buildTool: string;
  databasesDetected: string[];
  keyLibraries: string[];
}

export interface DetectedComponent {
  name: string;
  type: string;
  relativePath: string;
}

export interface ComponentAnalysisResult {
  totalComponents: number;
  componentCounts: Record<string, number>;
  components: DetectedComponent[];
}

export interface EngineeringEvidence {
  testFilesDetected: number;
  testDirectories: string[];
  testScriptDetected: boolean;
  springConfigurationDetected: boolean;
  beanDefinitions: number;
  constructorInjectionDetected: boolean;
  projectName?: string;
  projectDescription?: string;
  mainEntry?: string;
  testScript?: string;
}

export interface ArchitectureEvidenceResult {
  totalStructuralPaths: number;
  maxPathDepth: number;
  detectedKeywords: string[];
  packageComponentDistribution: Record<string, number>;
  evidenceNotes: string[];
  inboundPortImplementations: Record<string, string>;
  outboundAdapterImplementations: Record<string, string>;
  engineeringEvidence?: EngineeringEvidence;
  projectKind?: string;
  frontendFramework?: string;
  frontendEvidenceNotes?: string[];
}

export interface AnalysisContext {
  systemPrompt: string;
  userPrompt: string;
  formattedContextPrompt: string;
}

export interface RepositoryAnalysisResponseDto {
  projectKey: string;
  sourceType: 'GITHUB_REPO' | 'ZIP_FILE';
  totalFiles: number;
  totalDirectories: number;
  functionalSummary?: string;
  technologyStack: TechnologyStack;
  componentAnalysis: ComponentAnalysisResult;
  architectureEvidence: ArchitectureEvidenceResult;
  analysisContext?: AnalysisContext;
  aiSynthesis: string;
  aiModelUsed?: string;
  extensionCounts: Record<string, number>;
  timestamp: string;
}
