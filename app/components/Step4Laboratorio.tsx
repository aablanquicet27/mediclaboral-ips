'use client';

import { motion } from 'framer-motion';
import { FlaskConical, Check } from 'lucide-react';
import { PRECIOS, formatearPrecio } from '../lib/calculos';
import type { ServiciosSeleccionados } from '../types';

interface Step4Props {
  data: ServiciosSeleccionados;
  numEmpleados: number;
  onChange: (data: ServiciosSeleccionados) => void;
  onNext: () => void;
  onBack: () => void;
}

interface LabOption {
  value: ServiciosSeleccionados['laboratorio'];
  label: string;
  subtitle: string;
  items: string[];
  badge?: string;
}

const LAB_OPTIONS: LabOption[] = [
  {
    value: 'ninguno',
    label: 'Sin laboratorio',
    subtitle: 'No incluir estudios de laboratorio',
    items: [],
  },
  {
    value: 'basico',
    label: 'Laboratorio básico',
    subtitle: 'Los estudios esenciales para la mayoría de cargos',
    items: ['Hemograma completo', 'Glicemia en ayunas', 'Parcial de orina'],
  },
  {
    value: 'completo',
    label: 'Laboratorio completo',
    subtitle: 'Evaluación integral para cargos críticos',
    items: [
      'Todo lo del básico',
      'Perfil lipídico (colesterol + triglicéridos)',
      'Creatinina',
      'Transaminasas (ALT / AST)',
    ],
    badge: 'Recomendado',
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

export default function Step4Laboratorio({
  data,
  numEmpleados,
  onChange,
  onNext,
  onBack,
}: Step4Props) {
  function select(value: ServiciosSeleccionados['laboratorio']) {
    onChange({ ...data, laboratorio: value });
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Estudios de laboratorio</h2>
        <p className="text-slate-500 text-sm">
          Elija el paquete de laboratorio clínico para sus colaboradores.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {LAB_OPTIONS.map((option) => {
          const selected = data.laboratorio === option.value;
          return (
            <motion.button
              key={option.value}
              variants={itemVariants}
              onClick={() => select(option.value)}
              className={`
                option-card text-left p-5 rounded-2xl border-2 bg-white/70 w-full h-full
                ${selected ? 'selected' : 'border-slate-150 hover:border-slate-300'}
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${selected
                    ? 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-200'
                    : 'bg-slate-100 text-slate-400'
                  }
                  transition-all duration-200
                `}>
                  <FlaskConical size={18} />
                </div>
                {option.badge && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {option.badge}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-800 text-base mb-1">{option.label}</h3>
              <p className="text-xs text-slate-500 mb-3">{option.subtitle}</p>

              {/* Items list */}
              {option.items.length > 0 && (
                <ul className="space-y-1.5 mb-4">
                  {option.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check size={12} className={`mt-0.5 shrink-0 ${selected ? 'text-cyan-600' : 'text-slate-400'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Price */}
              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {option.value === 'ninguno' ? (
                    <p className="text-base font-bold text-slate-400">Gratis</p>
                  ) : (
                    <>
                      <p className={`text-lg font-bold ${selected ? 'text-cyan-700' : 'text-slate-600'}`}>
                        {formatearPrecio(PRECIOS.laboratorio[option.value])}
                      </p>
                      <p className="text-xs text-slate-400">por empleado</p>
                    </>
                  )}
                </div>
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200
                  ${selected ? 'bg-cyan-600 border-cyan-600' : 'border-slate-300 bg-white'}
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

              {selected && option.value !== 'ninguno' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-semibold text-cyan-700 mt-2"
                >
                  Total: {formatearPrecio(PRECIOS.laboratorio[option.value] * numEmpleados)}
                  <span className="font-normal text-slate-400 ml-1">({numEmpleados} emp.)</span>
                </motion.p>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.div variants={itemVariants} className="flex gap-3">
        <button
          onClick={onBack}
          className="
            px-6 py-3.5 rounded-xl font-semibold text-slate-600 text-sm
            bg-white border-2 border-slate-200
            hover:border-slate-300 hover:bg-slate-50
            active:scale-95 transition-all duration-200
          "
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          className="
            flex-1 sm:flex-none px-8 py-3.5 rounded-xl font-semibold text-white text-sm
            bg-gradient-to-r from-cyan-600 to-cyan-700
            hover:from-cyan-500 hover:to-cyan-600
            active:scale-95 transition-all duration-200
            shadow-lg shadow-cyan-200
          "
        >
          Continuar →
        </button>
      </motion.div>
    </motion.div>
  );
}
