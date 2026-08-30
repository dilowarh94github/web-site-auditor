'use client'

import { useState } from 'react'
import UrlInput from '@/components/UrlInput'
import AnalysisResults from '@/components/AnalysisResults'
import { AnalysisState, AuditResponse } from '@/types/analyzer'

export default function Home() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    url: '',
    scanDepth: 'Fast',
    isLoading: false,
    isStreaming: false,
    progress: {
      currentStep: '',
      stepNumber: 0,
      totalSteps: 3,
    },
    results: null,
    error: null,
  })

  const handleAnalyze = async (url: string, scanDepth: 'Fast' | 'Deep Analysis') => {
    setAnalysisState((prev) => ({
      ...prev,
      url,
      scanDepth,
      isLoading: true,
      isStreaming: true,
      error: null,
      progress: {
        currentStep: 'Fetching HTML...',
        stepNumber: 1,
        totalSteps: 3,
      },
    }))

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, scanDepth }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`)
      }

      // Simulate streaming effect with progress updates
      setAnalysisState((prev) => ({
        ...prev,
        progress: {
          currentStep: 'Running Agent Reasoning...',
          stepNumber: 2,
          totalSteps: 3,
        },
      }))

      const data: AuditResponse = await response.json()

      // Final progress update
      setAnalysisState((prev) => ({
        ...prev,
        progress: {
          currentStep: 'Generating Highlights...',
          stepNumber: 3,
          totalSteps: 3,
        },
      }))

      // Small delay to show the final step
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed')
      }

      setAnalysisState((prev) => ({
        ...prev,
        results: data,
        isStreaming: false,
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setAnalysisState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        isStreaming: false,
      }))
    }
  }

  const handleReset = () => {
    setAnalysisState({
      url: '',
      scanDepth: 'Fast',
      isLoading: false,
      isStreaming: false,
      progress: {
        currentStep: '',
        stepNumber: 0,
        totalSteps: 3,
      },
      results: null,
      error: null,
    })
  }

  return (
    <main className="flex-1 w-full">
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        {/* Header */}
        <header className="border-b border-dark-700 bg-dark-800/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Website Auditor</h1>
                <p className="text-dark-400 text-sm mt-1">
                  Analyze websites and uncover architectural, SEO, and performance issues
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* URL Input Section */}
          <section className="mb-12">
            <UrlInput
              onAnalyze={handleAnalyze}
              isLoading={analysisState.isLoading}
              defaultUrl={analysisState.url}
              defaultScanDepth={analysisState.scanDepth}
            />
          </section>

          {/* Error Display */}
          {analysisState.error && (
            <div className="mb-8 p-4 bg-danger-700/20 border border-danger-600 rounded-lg text-danger-100">
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{analysisState.error}</p>
              <button
                onClick={handleReset}
                className="mt-3 text-sm text-danger-400 hover:text-danger-300 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading State */}
          {analysisState.isLoading && (
            <section className="mb-12">
              <AnalysisResults
                isLoading={true}
                isStreaming={analysisState.isStreaming}
                progress={analysisState.progress}
                results={null}
              />
            </section>
          )}

          {/* Results Display */}
          {analysisState.results && !analysisState.isLoading && (
            <section>
              <AnalysisResults
                isLoading={false}
                isStreaming={false}
                progress={analysisState.progress}
                results={analysisState.results}
              />
              <div className="mt-8 text-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-dark-100 rounded-lg transition-colors"
                >
                  Analyze Another Website
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
