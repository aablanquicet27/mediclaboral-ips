'use client';

import { motion } from 'framer-motion';
import { UserPlus, RefreshCw, UserMinus, Info } from 'lucide-react';
import { PRECIOS, NOMBRES_SERVICIOS, formatearPrecio } from '../lib/calculos';
import type { ServiciosSeleccionados } from '../types';

interface Step2Props {
  data: ServiciosSeleccionados;
  numEmpleados: number;
  onChange: (data: ServiciosSeleccionados) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ExamConfig {
  key: keyof ServiciosSeleccionados['examenes'];
  label: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

const EXAM_OPTIONS: ExamConfig[] = [
  {
    key: 'ingreso',
    label: 'Ingreso',
    desc: 'Para nuevos colaboradores al iniciar su vínculo laboral',
    icon: <UserPlus size={22} />,
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    key: 'periodico',
    label: 'Periódico',
    desc: 'Seguimiento anual o según cargo y riesgo de exposición',
    icon: <RefreshCw size={22} />,
    color: 'from-teal-500 to-teal-600',
  },
  {
    key: 'egreso',
    label: 'Egreso',
    desc: 'Al finalizar el vínculo laboral — requerido por ley',
    icon: <UserMinus size={22} />,
    color: 'from-emerald-500 to-emerald-600',
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

export default function Step2Examenes({
  data,
  numEmpleados,
  onChange,
  onNext,
  onBack,
}: Step2Props) {
  function toggleExam(key: keyof ServiciosSeleccionados['examenes']) {
    onChange({
      ...data,
      examenes: { ...data.examenes, [key]: !data.examenes[key] },
    });
  }

  const anySelected = Object.values(data.examenes).some(Boolean);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Exámenes ocupacionales</h2>
        <p className="text-slate-500 text-sm">
          Seleccione los tipos de examen que necesita.{' '}
          <span className="font-medium text-cyan-700">
            Precio por empleado — {numEmpleados} empleado{numEmpleados !== 1 ? 's' : ''}
          </span>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {EXAM_OPTIONS.map((exam) => {
          const selected = data.examenes[exam.key];
          return (
            <motion.button
              key={exam.key}
              variants={itemVariants}
              onClick={() => toggleExam(exam.key)}
              className={`
                option-card text-left p-5 rounded-2xl border-2 bg-white/70 w-full
                ${selected ? 'selected' : 'border-slate-150 hover:border-slate-300'}
              `}
            >
              <div className={`
                w-10 h-10 rounded-xl bg-gradient-to-br ${exam.color}
                flex items-center justify-center text-white mb-3
                ${selected ? 'shadow-lg' : 'opacity-70'}
                transition-all duration-200
              `}>
                {exam.icon}
              </div>

              <h3 className="font-bold text-slate-800 text-base mb-1">
                Examen de {exam.label}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{exam.desc}</p>

              <div className="flex items-center justify-between mt-auto">
                <div>
                  <p className="text-lg font-bold text-cyan-700">
                    {formatearPrecio(PRECIOS.examenes[exam.key])}
                  </p>
                  <p className="text-xs text-slate-400">por empleado</p>
                </div>
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200
                  ${selected
                    ? 'bg-cyan-600 border-cyan-600'
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

              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 pt-3 border-t border-cyan-100"
                >
                  <p className="text-xs font-semibold text-cyan-700">
                    Subtotal: {formatearPrecio(PRECIOS.examenes[exam.key] * numEmpleados)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatearPrecio(PRECIOS.examenes[exam.key])} × {numEmpleados}
                  </p>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Info note */}
      <motion.div
        variants={itemVariants}
        className="flex items-start gap-2.5 p-3.5 rounded-xl bg-cyan-50/80 border border-cyan-100 mb-8"
      >
        <Info size={15} className="text-cyan-600 mt-0.5 shrink-0" />
        <p className="text-xs text-cyan-700 leading-relaxed">
          <span className="font-semibold">Todos los exámenes incluyen:</span> anamnesis ocupacional,
          evaluación clínica, aptitud médica y certificado según{' '}
          <span className="font-medium">Resolución 2346 de 2007</span>.
          Resultados entregados en <span className="font-semibold">4 horas</span>.
        </p>
      </motion.div>

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
