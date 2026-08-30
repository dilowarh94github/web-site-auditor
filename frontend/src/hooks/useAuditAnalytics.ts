'use client'

import { useMemo } from 'react'
import { AuditIssue } from '@/types/analyzer'

/**
 * Hook for calculating and caching severity metrics
 * Prevents recalculation on every render
 */
export function useSeverityMetrics(issues: AuditIssue[] | undefined) {
  return useMemo(() => {
    if (!issues) {
      return { critical: 0, warning: 0, optimization: 0, total: 0 }
    }

    return {
      critical: issues.filter((issue) => issue.severity === 'High').length,
      warning: issues.filter((issue) => issue.severity === 'Medium').length,
      optimization: issues.filter((issue) => issue.severity === 'Low').length,
      total: issues.length,
    }
  }, [issues])
}

/**
 * Hook for filtering issues by category
 */
export function useFilteredIssues(
  issues: AuditIssue[] | undefined,
  category: string | null
) {
  return useMemo(() => {
    if (!issues) return []
    if (!category) return issues
    return issues.filter((issue) => issue.category === category)
  }, [issues, category])
}

/**
 * Hook for sorting issues by severity and category
 */
export function useSortedIssues(issues: AuditIssue[] | undefined) {
  return useMemo(() => {
    if (!issues) return []

    const severityOrder = { High: 0, Medium: 1, Low: 2 }
    const categoryOrder = {
      SEO: 0,
      Accessibility: 1,
      Structure: 2,
      Performance: 3,
    }

    return [...issues].sort((a, b) => {
      const severityDiff =
        severityOrder[a.severity as keyof typeof severityOrder] -
        severityOrder[b.severity as keyof typeof severityOrder]

      if (severityDiff !== 0) return severityDiff

      return (
        categoryOrder[a.category as keyof typeof categoryOrder] -
        categoryOrder[b.category as keyof typeof categoryOrder]
      )
    })
  }, [issues])
}
