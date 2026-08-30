'use client'

import { motion } from 'framer-motion'

interface LoadingStateProps {
  progress: {
    currentStep: string
    stepNumber: number
    totalSteps: number
  }
}

export default function LoadingState({ progress }: LoadingStateProps) {
  const steps = [
    'Fetching HTML...',
    'Running Agent Reasoning...',
    'Generating Highlights...',
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-xl p-12 border border-dark-700 text-center"
    >
      {/* Animated Loading Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative w-24 h-24">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-emerald-500/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-500"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl font-bold text-emerald-400">
              {progress.stepNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Current Step Text */}
      <motion.h3
        key={progress.currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-xl font-semibold text-dark-100 mb-2"
      >
        {progress.currentStep}
      </motion.h3>

      {/* Progress Bar */}
      <div className="w-full bg-dark-700 rounded-full h-2 mt-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${(progress.stepNumber / progress.totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center gap-3 mt-8">
        {steps.map((step, index) => (
          <motion.div
            key={`step-${index}`}
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              index < progress.stepNumber
                ? 'bg-emerald-500/20 text-emerald-300'
                : index === progress.stepNumber - 1
                  ? 'bg-emerald-500 text-white'
                  : 'bg-dark-700 text-dark-500'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {step}
          </motion.div>
        ))}
      </div>

      {/* Loading Text */}
      <p className="text-dark-400 mt-8 text-sm">
        Please wait while we analyze your website...
      </p>
    </motion.div>
  )
}
