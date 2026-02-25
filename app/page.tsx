'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

import ProgressBar from './components/ProgressBar';
import Step1Empresa from './components/Step1Empresa';
import Step2Examenes from './components/Step2Examenes';
import Step3Adicionales from './components/Step3Adicionales';
import Step4Laboratorio from './components/Step4Laboratorio';
import Step5SST from './components/Step5SST';
import QuotationResult from './components/QuotationResult';
import { ToastContainer, useToast } from './components/Toast';

import { calcularCotizacion } from './lib/calculos';
import type { DatosEmpresa, ServiciosSeleccionados, Cotizacion, Step } from './types';

// ─── Default state ───────────────────────────────────────────────────────────

const DEFAULT_EMPRESA: DatosEmpresa = {
  nombre: '',
  nit: '',
  contactoNombre: '',
  contactoEmail: '',
  contactoTelefono: '',
  numEmpleados: 0,
};

const DEFAULT_SERVICIOS: ServiciosSeleccionados = {
  examenes: { ingreso: false, periodico: false, egreso: false },
  examenesAdicionales: { audiometria: false, visiometria: false, espirometria: false },
  laboratorio: 'ninguno',
  sst: 'ninguno',
};

// ─── Step transition variants ────────────────────────────────────────────────

const stepVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  }),
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);
  const [empresa, setEmpresa] = useState<DatosEmpresa>(DEFAULT_EMPRESA);
  const [servicios, setServicios] = useState<ServiciosSeleccionados>(DEFAULT_SERVICIOS);
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);
  const [loading, setLoading] = useState(false);

  const { toasts, addToast, dismiss } = useToast();

  function goNext() {
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, 5) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 1) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = calcularCotizacion(empresa, servicios);
    setCotizacion(result);
    setLoading(false);
    addToast('success', '¡Cotización generada!', `Número: ${result.numero}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleReset() {
    setEmpresa(DEFAULT_EMPRESA);
    setServicios(DEFAULT_SERVICIOS);
    setCotizacion(null);
    setCurrentStep(1);
    setDirection(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleToast = useCallback(
    (type: 'success' | 'error' | 'info', title: string, message?: string) =>
      addToast(type, title, message),
    [addToast]
  );

  return (
    <>
      {/* Full-page gradient background with decorative blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-cyan-50/60 to-emerald-50/40" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cyan-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-200/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sky-100/20 blur-3xl" />
      </div>

      <div className="min-h-screen flex flex-col">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 border-b border-white/40 backdrop-blur-xl bg-white/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-700 flex items-center justify-center shadow-md shadow-cyan-200">
                <HeartPulse size={20} className="text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-slate-800">MedicLaboral IPS</p>
                <p className="text-xs text-slate-400 hidden sm:block">Salud Ocupacional & SST</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Resultados en 4 horas</span>
            </div>
          </div>
        </header>

        {/* ── Main ────────────────────────────────────────────────────────── */}
        <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full max-w-2xl">

            {!cotizacion && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
              >
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Cotiza tus{' '}
                  <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                    exámenes ocupacionales
                  </span>
                </h1>
                <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-md mx-auto">
                  Completa el formulario en minutos y recibe tu cotización personalizada al instante.
                </p>
              </motion.div>
            )}

            {/* Glass card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card rounded-3xl p-6 sm:p-8"
            >
              {!cotizacion && <ProgressBar currentStep={currentStep} />}

              <div className="overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  {cotizacion ? (
                    <motion.div
                      key="result"
                      variants={stepVariants}
                      custom={1}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <QuotationResult
                        cotizacion={cotizacion}
                        onReset={handleReset}
                        onToast={handleToast}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`step-${currentStep}`}
                      variants={stepVariants}
                      custom={direction}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      {currentStep === 1 && (
                        <Step1Empresa data={empresa} onChange={setEmpresa} onNext={goNext} />
                      )}
                      {currentStep === 2 && (
                        <Step2Examenes
                          data={servicios}
                          numEmpleados={empresa.numEmpleados}
                          onChange={setServicios}
                          onNext={goNext}
                          onBack={goBack}
                        />
                      )}
                      {currentStep === 3 && (
                        <Step3Adicionales
                          data={servicios}
                          numEmpleados={empresa.numEmpleados}
                          onChange={setServicios}
                          onNext={goNext}
                          onBack={goBack}
                        />
                      )}
                      {currentStep === 4 && (
                        <Step4Laboratorio
                          data={servicios}
                          numEmpleados={empresa.numEmpleados}
                          onChange={setServicios}
                          onNext={goNext}
                          onBack={goBack}
                        />
                      )}
                      {currentStep === 5 && (
                        <Step5SST
                          data={servicios}
                          onChange={setServicios}
                          onSubmit={handleSubmit}
                          onBack={goBack}
                          loading={loading}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-xs text-slate-400 mt-6 px-4"
            >
              © {new Date().getFullYear()} MedicLaboral IPS · Habilitada MinSalud ·{' '}
              <a
                href="https://www.mediclaboral.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-cyan-600 transition-colors"
              >
                mediclaboral.com
              </a>
            </motion.p>
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
