'use client';

import { motion } from 'framer-motion';
import { Shield, Check, Loader2 } from 'lucide-react';
import { PRECIOS, formatearPrecio } from '../lib/calculos';
import type { ServiciosSeleccionados } from '../types';

interface Step5Props {
  data: ServiciosSeleccionados;
  onChange: (data: ServiciosSeleccionados) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
}

interface SSTOption {
  value: ServiciosSeleccionados['sst'];
  label: string;
  subtitle: string;
  items: string[];
  badge?: string;
  highlight?: boolean;
}

const SST_OPTIONS: SSTOption[] = [
  {
    value: 'ninguno',
    label: 'Sin SST',
    subtitle: 'No incluir servicios de SST en esta cotización',
    items: [],
  },
  {
    value: 'basico',
    label: 'SST Básico',
    subtitle: 'Formación esencial para cumplimiento normativo',
    items: [
      'Capacitación en SST (4 horas)',
      'Inducción a riesgos laborales',
      'Entrega de material formativo',
      'Certificado de participación',
    ],
  },
  {
    value: 'completo',
    label: 'SST Completo',
    subtitle: 'Diagnóstico, plan de acción y formación integral',
    items: [
      'Todo lo del básico',
      'Diagnóstico inicial (Decreto 1072/2015)',
      'Plan de trabajo anual en SST',
      'Política y objetivos de SST',
      'Identificación de peligros y valoración de riesgos',
      'Acompañamiento durante implementación',
    ],
    badge: 'Cumplimiento total',
    highlight: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function Step5SST({
  data,
  onChange,
  onSubmit,
  onBack,
  loading,
}: Step5Props) {
  function select(value: ServiciosSeleccionados['sst']) {
    onChange({ ...data, sst: value });
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          Seguridad y Salud en el Trabajo
        </h2>
        <p className="text-slate-500 text-sm">
          Apoyo en SST — cumplimiento Decreto 1072/2015 y Resolución 0312/2019.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {SST_OPTIONS.map((option) => {
          const selected = data.sst === option.value;
          return (
            <motion.button
              key={option.value}
              variants={itemVariants}
              onClick={() => select(option.value)}
              className={`
                option-card text-left p-5 rounded-2xl border-2 bg-white/70 w-full
                ${option.highlight ? 'ring-1 ring-emerald-200' : ''}
                ${selected ? 'selected' : 'border-slate-150 hover:border-slate-300'}
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${selected
                    ? option.highlight
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-gradient-to-br from-cyan-500 to-cyan-700 text-white shadow-lg shadow-cyan-200'
                    : 'bg-slate-100 text-slate-400'
                  }
                  transition-all duration-200
                `}>
                  <Shield size={18} />
                </div>
                {option.badge && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {option.badge}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-800 text-base mb-1">{option.label}</h3>
              <p className="text-xs text-slate-500 mb-3">{option.subtitle}</p>

              {option.items.length > 0 && (
                <ul className="space-y-1.5 mb-4">
                  {option.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check
                        size={12}
                        className={`mt-0.5 shrink-0 ${
                          selected
                            ? option.highlight ? 'text-emerald-600' : 'text-cyan-600'
                            : 'text-slate-400'
                        }`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Price */}
              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {option.value === 'ninguno' ? (
                    <p className="text-base font-bold text-slate-400">No aplica</p>
                  ) : (
                    <>
                      <p className={`text-lg font-bold ${selected ? (option.highlight ? 'text-emerald-700' : 'text-cyan-700') : 'text-slate-600'}`}>
                        {formatearPrecio(PRECIOS.sst[option.value])}
                      </p>
                      <p className="text-xs text-slate-400">precio fijo</p>
                    </>
                  )}
                </div>
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200
                  ${selected
                    ? option.highlight ? 'bg-emerald-600 border-emerald-600' : 'bg-cyan-600 border-cyan-600'
                    : 'border-slate-300 bg-white'
                  }
                `}>
                  {selected && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div variants={itemVariants} className="flex gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="
            px-6 py-3.5 rounded-xl font-semibold text-slate-600 text-sm
            bg-white border-2 border-slate-200
            hover:border-slate-300 hover:bg-slate-50
            active:scale-95 transition-all duration-200
            disabled:opacity-50
          "
        >
          ← Atrás
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="
            flex-1 sm:flex-none px-8 py-3.5 rounded-xl font-semibold text-white text-sm
            bg-gradient-to-r from-emerald-600 to-teal-600
            hover:from-emerald-500 hover:to-teal-500
            active:scale-95 transition-all duration-200
            shadow-lg shadow-emerald-200
            disabled:opacity-70 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generando cotización...
            </>
          ) : (
            '✓ Ver mi cotización'
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
