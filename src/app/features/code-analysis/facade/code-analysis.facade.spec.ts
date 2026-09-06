import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CodeAnalysisFacade } from './code-analysis.facade';
import { CodeAnalysisApiService } from '../data-access/code-analysis-api.service';
import { RepositoryAnalysisResponseDto } from '../models/analysis-response.model';
import { SystemConfigResponseDto } from '../models/system-config.model';

describe('CodeAnalysisFacade', () => {
  let facade: CodeAnalysisFacade;
  let apiServiceSpy: jasmine.SpyObj<CodeAnalysisApiService>;

  const mockConfig: SystemConfigResponseDto = {
    ollamaBaseUrl: 'http://localhost:11434',
    ollamaModel: 'qwen2.5-coder',
    promptVersion: 'v1',
    availableModels: ['qwen2.5-coder', 'llama3']
  };

  const mockResponse: RepositoryAnalysisResponseDto = {
    projectKey: 'test-repo',
    sourceType: 'GITHUB_REPO',
    totalFiles: 10,
    totalDirectories: 4,
    technologyStack: {
      mainLanguage: 'TypeScript',
      mainFramework: 'Angular',
      buildTool: 'npm',
      databasesDetected: [],
      keyLibraries: []
    },
    componentAnalysis: {
      totalComponents: 2,
      componentCounts: { COMPONENT: 2 },
      components: []
    },
    architectureEvidence: {
      totalStructuralPaths: 4,
      maxPathDepth: 3,
      detectedKeywords: ['features'],
      packageComponentDistribution: {},
      evidenceNotes: [],
      inboundPortImplementations: {},
      outboundAdapterImplementations: {},
      projectKind: 'FRONTEND',
      frontendFramework: 'ANGULAR'
    },
    aiSynthesis: '## Synthesis Report',
    aiModelUsed: 'qwen2.5-coder',
    extensionCounts: { ts: 10 },
    timestamp: '2026-09-06T00:00:00'
  };

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('CodeAnalysisApiService', [
      'getSystemConfig',
      'updateActiveModel',
      'analyzeGithubRepo',
      'analyzeZipFile'
    ]);

    apiServiceSpy.getSystemConfig.and.returnValue(of(mockConfig));

    TestBed.configureTestingModule({
      providers: [
        CodeAnalysisFacade,
        { provide: CodeAnalysisApiService, useValue: apiServiceSpy }
      ]
    });

    facade = TestBed.inject(CodeAnalysisFacade);
  });

  it('should initialize with IDLE status and load system config', () => {
    expect(facade.status()).toBe('IDLE');
    expect(facade.systemConfig()).toEqual(mockConfig);
    expect(facade.activeModel()).toBe('qwen2.5-coder');
    expect(facade.availableModels()).toEqual(['qwen2.5-coder', 'llama3']);
  });

  it('should transition IDLE -> LOADING -> SUCCESS on analyzeGithubRepo', () => {
    apiServiceSpy.analyzeGithubRepo.and.returnValue(of(mockResponse));

    facade.analyzeGithubRepo('https://github.com/org/test-repo');

    expect(facade.status()).toBe('SUCCESS');
    expect(facade.result()).toEqual(mockResponse);
    expect(facade.hasReport()).toBeTrue();
    expect(facade.lastSourceType()).toBe('GITHUB');
  });

  it('should transition IDLE -> LOADING -> ERROR on analyzeGithubRepo failure', () => {
    apiServiceSpy.analyzeGithubRepo.and.returnValue(throwError(() => ({ message: 'API connection failed' })));

    facade.analyzeGithubRepo('https://github.com/org/test-repo');

    expect(facade.status()).toBe('ERROR');
    expect(facade.error()).toBe('API connection failed');
    expect(facade.result()).toBeNull();
  });

  it('should reset state on reset() call', () => {
    apiServiceSpy.analyzeGithubRepo.and.returnValue(of(mockResponse));
    facade.analyzeGithubRepo('https://github.com/org/test-repo');

    facade.reset();

    expect(facade.status()).toBe('IDLE');
    expect(facade.result()).toBeNull();
    expect(facade.error()).toBeNull();
    expect(facade.lastSourceType()).toBeNull();
  });
});
