'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  AlertTriangle,
  Zap,
  ChevronDown,
  CheckCircle2,
  AlertOctagon,
  Code,
  Target,
  DollarSign,
} from 'lucide-react'
import { AuditIssue } from '@/types/analyzer'

interface IssueCardProps {
  issue: AuditIssue
  index: number
  isExpanded: boolean
  onToggle: () => void
}

export default function IssueCard({
  issue,
  index,
  isExpanded,
  onToggle,
}: IssueCardProps) {
  /**
   * Get severity styling based on severity level
   */
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'High':
        return {
          bgColor: 'bg-danger-700/20',
          borderColor: 'border-danger-600',
          textColor: 'text-danger-300',
          badgeColor: 'bg-danger-600 text-white',
          icon: <AlertOctagon className="w-5 h-5" />,
        }
      case 'Medium':
        return {
          bgColor: 'bg-warning-700/20',
          borderColor: 'border-warning-600',
          textColor: 'text-warning-300',
          badgeColor: 'bg-warning-600 text-white',
          icon: <AlertTriangle className="w-5 h-5" />,
        }
      default:
        return {
          bgColor: 'bg-info-700/20',
          borderColor: 'border-info-600',
          textColor: 'text-info-300',
          badgeColor: 'bg-info-600 text-white',
          icon: <Zap className="w-5 h-5" />,
        }
    }
  }

  /**
   * Get category styling
   */
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'SEO':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
      case 'Accessibility':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
      case 'Performance':
        return 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
    }
  }

  const severity = getSeverityStyles(issue.severity)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05 }}
      className={`glass rounded-lg border transition-all ${severity.borderColor} ${
        isExpanded ? 'shadow-lg' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left hover:bg-dark-700/30 transition-colors"
      >
        <div className="flex items-start gap-4">
          {/* Severity Icon */}
          <div className={`flex-shrink-0 p-2 rounded-lg ${severity.bgColor}`}>
            {severity.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="text-sm font-semibold text-dark-100 flex-1">
                {issue.issue}
              </h4>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${severity.badgeColor}`}>
                {issue.severity}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getCategoryStyles(issue.category)}`}>
                {issue.category}
              </span>
            </div>
            <p className="text-xs text-dark-400 truncate">
              {issue.location}
            </p>
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-1"
          >
            <ChevronDown className="w-5 h-5 text-dark-400" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-dark-700"
          >
            <div className="px-6 py-4 space-y-4">
              {/* Problem Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-danger-400" />
                  <h5 className="text-sm font-semibold text-dark-100">Problem</h5>
                </div>
                <p className="text-sm text-dark-300 leading-relaxed">
                  {issue.issue}
                </p>
              </div>

              {/* Affected Element */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <h5 className="text-sm font-semibold text-dark-100">Location</h5>
                </div>
                <div className="bg-dark-800 rounded p-3 border border-dark-700">
                  <code className="text-xs text-dark-300 break-words">
                    {issue.location}
                  </code>
                </div>
              </div>

              {/* Business Impact */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-warning-400" />
                  <h5 className="text-sm font-semibold text-dark-100">Business Impact</h5>
                </div>
                <p className="text-sm text-dark-300 leading-relaxed">
                  {issue.businessImpact}
                </p>
              </div>

              {/* Recommended Fix */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-success-400" />
                  <h5 className="text-sm font-semibold text-dark-100">Recommended Fix</h5>
                </div>
                <div className="bg-success-900/20 border border-success-600/30 rounded p-3">
                  <p className="text-sm text-success-200 leading-relaxed">
                    {issue.remediation}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
