'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Hash, User, Phone, Mail, Users, AlertCircle } from 'lucide-react';
import type { DatosEmpresa } from '../types';

interface Step1Props {
  data: DatosEmpresa;
  onChange: (data: DatosEmpresa) => void;
  onNext: () => void;
}

interface FieldConfig {
  key: keyof DatosEmpresa;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
  hint?: string;
}

const FIELDS: FieldConfig[] = [
  {
    key: 'nombre',
    label: 'Razón social',
    placeholder: 'Nombre completo de la empresa',
    icon: <Building2 size={16} />,
  },
  {
    key: 'nit',
    label: 'NIT',
    placeholder: 'Ej: 900.123.456-7',
    icon: <Hash size={16} />,
    hint: 'Con dígito de verificación',
  },
  {
    key: 'contactoNombre',
    label: 'Nombre del contacto',
    placeholder: 'Persona que recibirá la cotización',
    icon: <User size={16} />,
  },
  {
    key: 'contactoTelefono',
    label: 'Teléfono / WhatsApp',
    placeholder: '+57 300 000 0000',
    icon: <Phone size={16} />,
    type: 'tel',
  },
  {
    key: 'contactoEmail',
    label: 'Correo electrónico',
    placeholder: 'correo@empresa.com',
    icon: <Mail size={16} />,
    type: 'email',
  },
  {
    key: 'numEmpleados',
    label: 'Número de empleados',
    placeholder: 'Ej: 25',
    icon: <Users size={16} />,
    type: 'number',
    hint: 'Empleados a examinar',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function Step1Empresa({ data, onChange, onNext }: Step1Props) {
  const [touched, setTouched] = useState<Partial<Record<keyof DatosEmpresa, boolean>>>({});

  function validate(field: keyof DatosEmpresa, value: string | number): string | null {
    if (field === 'numEmpleados') {
      const n = Number(value);
      if (!n || n < 1) return 'Ingrese al menos 1 empleado';
      if (n > 10000) return 'Valor fuera de rango';
      return null;
    }
    if (!String(value).trim()) return 'Este campo es requerido';
    if (field === 'contactoEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
      return 'Correo electrónico inválido';
    }
    return null;
  }

  function getError(field: keyof DatosEmpresa): string | null {
    if (!touched[field]) return null;
    return validate(field, data[field]);
  }

  function isFormValid(): boolean {
    return FIELDS.every((f) => validate(f.key, data[f.key]) === null);
  }

  function handleChange(key: keyof DatosEmpresa, value: string) {
    onChange({
      ...data,
      [key]: key === 'numEmpleados' ? (parseInt(value) || 0) : value,
    });
  }

  function handleBlur(key: keyof DatosEmpresa) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function handleSubmit() {
    const allTouched = Object.fromEntries(FIELDS.map((f) => [f.key, true])) as Record<keyof DatosEmpresa, boolean>;
    setTouched(allTouched);
    if (isFormValid()) onNext();
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Datos de su empresa</h2>
        <p className="text-slate-500 text-sm">
          Necesitamos esta información para personalizar su cotización.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {FIELDS.map((field) => {
          const error = getError(field.key);
          return (
            <motion.div
              key={field.key}
              variants={itemVariants}
              className={field.key === 'nombre' || field.key === 'contactoNombre' ? 'sm:col-span-2' : ''}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {field.label}
                <span className="text-cyan-600 ml-0.5">*</span>
              </label>
              <div className="relative">
                <div className={`
                  absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors
                  ${error ? 'text-red-400' : 'text-slate-400'}
                `}>
                  {field.icon}
                </div>
                <input
                  type={field.type || 'text'}
                  value={field.key === 'numEmpleados' ? (data.numEmpleados || '') : String(data[field.key])}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  onBlur={() => handleBlur(field.key)}
                  placeholder={field.placeholder}
                  min={field.type === 'number' ? 1 : undefined}
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-800
                    bg-white/80 border-2 outline-none transition-all duration-200
                    placeholder:text-slate-300
                    focus:bg-white focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(14,116,144,0.1)]
                    ${error
                      ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]'
                      : 'border-slate-200 hover:border-slate-300'
                    }
                  `}
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-1.5 text-xs text-red-500 font-medium"
                >
                  <AlertCircle size={12} />
                  {error}
                </motion.p>
              )}
              {!error && field.hint && (
                <p className="mt-1 text-xs text-slate-400">{field.hint}</p>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={itemVariants} className="mt-8">
        <button
          onClick={handleSubmit}
          className="
            w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white text-sm
            bg-gradient-to-r from-cyan-600 to-cyan-700
            hover:from-cyan-500 hover:to-cyan-600
            active:scale-95
            transition-all duration-200
            shadow-lg shadow-cyan-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          Continuar →
        </button>
      </motion.div>
    </motion.div>
  );
}
