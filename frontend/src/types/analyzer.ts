/**
 * Type definitions for the website auditor API and analysis responses
 */

export interface AuditIssue {
  category: 'SEO' | 'Accessibility' | 'Structure' | 'Performance';
  issue: string;
  location: string;
  severity: 'High' | 'Medium' | 'Low';
  businessImpact: string;
  remediation: string;
}

export interface AuditResponse {
  success: boolean;
  audit?: AuditIssue[];
  warning?: string;
  error?: string;
  details?: string;
}

export interface StreamChunk {
  type: 'chunk' | 'complete' | 'error';
  data?: Partial<AuditResponse>;
  message?: string;
}

export interface AnalysisState {
  url: string;
  scanDepth: 'Fast' | 'Deep Analysis';
  isLoading: boolean;
  isStreaming: boolean;
  progress: {
    currentStep: string;
    stepNumber: number;
    totalSteps: number;
  };
  results: AuditResponse | null;
  error: string | null;
}

export type SeverityLevel = 'High' | 'Medium' | 'Low';

export interface SeverityMetrics {
  critical: number;
  warning: number;
  optimization: number;
  total: number;
}
