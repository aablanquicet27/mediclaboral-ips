'use client';

import { motion } from 'framer-motion';
import { Headphones, Eye, Wind } from 'lucide-react';
import { PRECIOS, formatearPrecio } from '../lib/calculos';
import type { ServiciosSeleccionados } from '../types';

interface Step3Props {
  data: ServiciosSeleccionados;
  numEmpleados: number;
  onChange: (data: ServiciosSeleccionados) => void;
  onNext: () => void;
  onBack: () => void;
}

interface AdicionalConfig {
  key: keyof ServiciosSeleccionados['examenesAdicionales'];
  label: string;
  fullName: string;
  desc: string;
  icon: React.ReactNode;
  gradient: string;
  bg: string;
  norma?: string;
}

const ADICIONALES: AdicionalConfig[] = [
  {
    key: 'audiometria',
    label: 'Audiometría',
    fullName: 'Audiometría tonal',
    desc: 'Evaluación de la capacidad auditiva. Obligatoria en cargos con exposición a ruido.',
    icon: <Headphones size={20} />,
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    norma: 'Res. 8321/1983',
  },
  {
    key: 'visiometria',
    label: 'Visiometría',
    fullName: 'Visiometría completa',
    desc: 'Evaluación de agudeza visual, campo visual y visión cromática.',
    icon: <Eye size={20} />,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    norma: 'NTC 4272',
  },
  {
    key: 'espirometria',
    label: 'Espirometría',
    fullName: 'Espirometría (función pulmonar)',
    desc: 'Medición de la capacidad respiratoria. Requerida en cargos con exposición a polvos o gases.',
    icon: <Wind size={20} />,
    gradient: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50',
    norma: 'ATS/ERS 2005',
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

export default function Step3Adicionales({
  data,
  numEmpleados,
  onChange,
  onNext,
  onBack,
}: Step3Props) {
  function toggle(key: keyof ServiciosSeleccionados['examenesAdicionales']) {
    onChange({
      ...data,
      examenesAdicionales: {
        ...data.examenesAdicionales,
        [key]: !data.examenesAdicionales[key],
      },
    });
  }

  const anySelected = Object.values(data.examenesAdicionales).some(Boolean);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Exámenes paraclínicos</h2>
        <p className="text-slate-500 text-sm">
          Pruebas complementarias según el cargo y nivel de riesgo.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {ADICIONALES.map((item) => {
          const selected = data.examenesAdicionales[item.key];
          return (
            <motion.button
              key={item.key}
              variants={itemVariants}
              onClick={() => toggle(item.key)}
              className={`
                option-card text-left rounded-2xl border-2 bg-white/70 w-full
                overflow-hidden transition-all duration-200
                ${selected ? 'selected' : 'border-slate-150 hover:border-slate-300'}
              `}
            >
              <div className="flex items-start gap-4 p-5">
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient}
                  flex items-center justify-center text-white shrink-0
                  ${selected ? 'shadow-lg' : 'opacity-75'}
                  transition-all duration-200
                `}>
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{item.fullName}</h3>
                      {item.norma && (
                        <span className="inline-block text-xs text-slate-400 font-medium mt-0.5">
                          {item.norma}
                        </span>
                      )}
                    </div>
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5
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
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.desc}</p>
                </div>
              </div>

              {/* Price row */}
              <div className={`
                flex items-center justify-between px-5 py-3 border-t
                ${selected ? 'bg-cyan-50/60 border-cyan-100' : 'bg-slate-50/50 border-slate-100'}
                transition-colors duration-200
              `}>
                <div>
                  <span className={`text-lg font-bold ${selected ? 'text-cyan-700' : 'text-slate-600'}`}>
                    {formatearPrecio(PRECIOS.examenesAdicionales[item.key])}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">/ empleado</span>
                </div>
                {selected && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-right"
                  >
                    <p className="text-sm font-semibold text-cyan-700">
                      = {formatearPrecio(PRECIOS.examenesAdicionales[item.key] * numEmpleados)}
                    </p>
                    <p className="text-xs text-slate-400">{numEmpleados} empleado{numEmpleados !== 1 ? 's' : ''}</p>
                  </motion.div>
                )}
              </div>
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
          {anySelected ? 'Continuar →' : 'Omitir →'}
        </button>
      </motion.div>
    </motion.div>
  );
}
