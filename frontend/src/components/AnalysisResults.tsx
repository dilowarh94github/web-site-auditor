'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  AlertOctagon,
} from 'lucide-react'
import { AuditResponse, AuditIssue, SeverityMetrics } from '@/types/analyzer'
import LoadingState from './LoadingState'
import IssueCard from './IssueCard'

interface AnalysisResultsProps {
  isLoading: boolean
  isStreaming: boolean
  progress: {
    currentStep: string
    stepNumber: number
    totalSteps: number
  }
  results: AuditResponse | null
}

export default function AnalysisResults({
  isLoading,
  isStreaming,
  progress,
  results,
}: AnalysisResultsProps) {
  const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null)

  /**
   * Calculate severity metrics from audit results
   */
  const metrics = useMemo((): SeverityMetrics => {
    if (!results?.audit) {
      return { critical: 0, warning: 0, optimization: 0, total: 0 }
    }

    return {
      critical: results.audit.filter((issue) => issue.severity === 'High').length,
      warning: results.audit.filter((issue) => issue.severity === 'Medium').length,
      optimization: results.audit.filter((issue) => issue.severity === 'Low').length,
      total: results.audit.length,
    }
  }, [results])

  if (isLoading || isStreaming) {
    return <LoadingState progress={progress} />
  }

  if (!results) {
    return null
  }

  if (results.error) {
    return (
      <div className="p-6 bg-danger-700/20 border border-danger-600 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertOctagon className="w-6 h-6 text-danger-500" />
          <div>
            <h3 className="font-semibold text-danger-100">Analysis Failed</h3>
            <p className="text-sm text-danger-200 mt-1">{results.error}</p>
            {results.details && (
              <p className="text-xs text-danger-300 mt-2">{results.details}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Warning Message */}
      {results.warning && (
        <div className="p-4 bg-warning-700/20 border border-warning-600 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-warning-100">{results.warning}</p>
          </div>
        </div>
      )}

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Issues */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-6 border border-dark-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Total Issues</p>
              <p className="text-3xl font-bold text-dark-100 mt-2">{metrics.total}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-dark-400" />
            </div>
          </div>
        </motion.div>

        {/* Critical Issues */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`glass rounded-lg p-6 border ${
            metrics.critical > 0 ? 'border-danger-600' : 'border-dark-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Critical</p>
              <p className={`text-3xl font-bold mt-2 ${
                metrics.critical > 0 ? 'text-danger-400' : 'text-success-400'
              }`}>
                {metrics.critical}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              metrics.critical > 0 ? 'bg-danger-700/30' : 'bg-success-700/30'
            }`}>
              {metrics.critical > 0 ? (
                <AlertOctagon className="w-6 h-6 text-danger-500" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-success-500" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Warnings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`glass rounded-lg p-6 border ${
            metrics.warning > 0 ? 'border-warning-600' : 'border-dark-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Warnings</p>
              <p className={`text-3xl font-bold mt-2 ${
                metrics.warning > 0 ? 'text-warning-400' : 'text-success-400'
              }`}>
                {metrics.warning}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              metrics.warning > 0 ? 'bg-warning-700/30' : 'bg-success-700/30'
            }`}>
              {metrics.warning > 0 ? (
                <AlertTriangle className="w-6 h-6 text-warning-500" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-success-500" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Optimizations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-lg p-6 border border-dark-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Optimizations</p>
              <p className="text-3xl font-bold text-dark-100 mt-2">{metrics.optimization}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-dark-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Issues Feed */}
      {results.audit && results.audit.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-dark-100 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Detailed Issues
          </h3>

          <div className="space-y-3">
            <AnimatePresence>
              {results.audit.map((issue, index) => (
                <IssueCard
                  key={`${issue.category}-${index}`}
                  issue={issue}
                  index={index}
                  isExpanded={expandedIssueId === index}
                  onToggle={() =>
                    setExpandedIssueId(expandedIssueId === index ? null : index)
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CheckCircle2 className="w-12 h-12 text-success-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-success-300">
            No issues detected!
          </h3>
          <p className="text-dark-400 mt-2">
            Your website looks great and follows best practices.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
