export interface SystemConfigResponseDto {
  ollamaBaseUrl: string;
  ollamaModel: string;
  promptVersion: string;
  availableModels: string[];
}

export interface UpdateModelRequestDto {
  model: string;
}
