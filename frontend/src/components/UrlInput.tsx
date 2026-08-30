'use client'

import { useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Zap } from 'lucide-react'

interface UrlInputProps {
  onAnalyze: (url: string, scanDepth: 'Fast' | 'Deep Analysis') => void
  isLoading: boolean
  defaultUrl?: string
  defaultScanDepth?: 'Fast' | 'Deep Analysis'
}

export default function UrlInput({
  onAnalyze,
  isLoading,
  defaultUrl = '',
  defaultScanDepth = 'Fast',
}: UrlInputProps) {
  const [url, setUrl] = useState(defaultUrl)
  const [scanDepth, setScanDepth] = useState<'Fast' | 'Deep Analysis'>(defaultScanDepth)
  const [urlError, setUrlError] = useState('')

  /**
   * Validates URL format using regex pattern
   * Supports: http://, https://, www., and bare domains
   */
  const validateUrl = useCallback((inputUrl: string): boolean => {
    // Deep regex validation for URLs
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
    return urlRegex.test(inputUrl)
  }, [])

  /**
   * Normalizes URL by adding protocol if missing
   */
  const normalizeUrl = (inputUrl: string): string => {
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
      return `https://${inputUrl}`
    }
    return inputUrl
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUrlError('')

    // Trim whitespace
    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      setUrlError('Please enter a website URL')
      return
    }

    if (!validateUrl(trimmedUrl)) {
      setUrlError('Please enter a valid URL (e.g., example.com or https://example.com)')
      return
    }

    const normalizedUrl = normalizeUrl(trimmedUrl)
    onAnalyze(normalizedUrl, scanDepth)
  }

  return (
    <div className="w-full">
      <div className="glass rounded-xl p-8 border border-dark-700">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dark-100 mb-2">Scan Your Website</h2>
          <p className="text-dark-400">
            Enter your website URL to analyze it for structural, SEO, and performance issues
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input Field */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-dark-300 mb-2">
              Website URL
            </label>
            <div className="relative">
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (urlError) setUrlError('')
                }}
                onBlur={() => {
                  if (url && !validateUrl(url)) {
                    setUrlError('Please enter a valid URL')
                  }
                }}
                placeholder="example.com or https://example.com"
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
              {url && validateUrl(url) && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-success-600" />
              )}
            </div>
            {urlError && (
              <p className="mt-2 text-sm text-danger-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {urlError}
              </p>
            )}
          </div>

          {/* Scan Depth Selector */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-3">
              Scan Depth
            </label>
            <div className="flex gap-4">
              {['Fast', 'Deep Analysis'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setScanDepth(option as 'Fast' | 'Deep Analysis')}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    scanDepth === option
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-2 ring-offset-dark-800'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {option === 'Fast' ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {option}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-dark-500">
              {scanDepth === 'Fast'
                ? 'Quick scan focusing on critical issues'
                : 'Comprehensive analysis including optimization suggestions'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !url}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              'Scan Website'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
