'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  Stethoscope,
  Activity,
  FlaskConical,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import type { Step } from '../types';

interface StepConfig {
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const STEPS: StepConfig[] = [
  {
    label: 'Datos de la empresa',
    shortLabel: 'Empresa',
    icon: <Building2 size={16} />,
  },
  {
    label: 'Exámenes ocupacionales',
    shortLabel: 'Exámenes',
    icon: <Stethoscope size={16} />,
  },
  {
    label: 'Exámenes adicionales',
    shortLabel: 'Adicionales',
    icon: <Activity size={16} />,
  },
  {
    label: 'Laboratorio',
    shortLabel: 'Laboratorio',
    icon: <FlaskConical size={16} />,
  },
  {
    label: 'SST',
    shortLabel: 'SST',
    icon: <Shield size={16} />,
  },
];

interface ProgressBarProps {
  currentStep: Step;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full px-2 py-6">
      {/* Mobile: compact bar */}
      <div className="flex sm:hidden items-center gap-3 mb-2">
        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-emerald-500"
            initial={{ width: '20%' }}
            animate={{ width: `${(currentStep / 5) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-sm font-semibold text-cyan-700 whitespace-nowrap">
          {currentStep} / 5
        </span>
      </div>
      <p className="sm:hidden text-xs text-slate-500 font-medium mb-1">
        {STEPS[currentStep - 1].label}
      </p>

      {/* Desktop: step indicators */}
      <div className="hidden sm:flex items-center justify-between relative">
        {STEPS.map((step, index) => {
          const stepNumber = (index + 1) as Step;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1 relative">
              {/* Connector line (not for last step) */}
              {index < STEPS.length - 1 && (
                <div className="absolute top-5 left-1/2 right-0 h-0.5 z-0">
                  <div className="w-full h-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-600 to-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.4, delay: isCompleted ? 0.1 : 0 }}
                    />
                  </div>
                </div>
              )}

              {/* Step circle */}
              <motion.div
                className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                  text-sm font-semibold transition-all duration-300 border-2
                  ${isCompleted
                    ? 'bg-gradient-to-br from-cyan-600 to-emerald-500 border-transparent text-white shadow-lg shadow-cyan-200'
                    : isActive
                    ? 'bg-white border-cyan-600 text-cyan-700 shadow-lg shadow-cyan-100 ring-4 ring-cyan-50'
                    : 'bg-white border-slate-200 text-slate-400'
                  }
                `}
                initial={false}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                  >
                    <CheckCircle2 size={18} />
                  </motion.div>
                ) : (
                  <span className="flex items-center gap-0.5">
                    {step.icon}
                  </span>
                )}
              </motion.div>

              {/* Step label */}
              <span
                className={`
                  mt-2 text-xs font-medium text-center leading-tight max-w-[72px]
                  ${isCompleted || isActive ? 'text-cyan-700' : 'text-slate-400'}
                `}
              >
                {step.shortLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
